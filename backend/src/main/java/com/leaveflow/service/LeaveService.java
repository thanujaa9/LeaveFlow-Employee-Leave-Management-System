package com.leaveflow.service;

import com.leaveflow.dto.request.LeaveApplicationRequest;
import com.leaveflow.dto.response.DashboardStatsDto;
import com.leaveflow.dto.response.LeaveRequestDto;
import com.leaveflow.entity.*;
import com.leaveflow.exception.BadRequestException;
import com.leaveflow.exception.ResourceNotFoundException;
import com.leaveflow.repository.*;
import com.leaveflow.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveApprovalRepository leaveApprovalRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveBalanceService leaveBalanceService;

    public LeaveService(LeaveRequestRepository leaveRequestRepository,
                        LeaveTypeRepository leaveTypeRepository,
                        LeaveApprovalRepository leaveApprovalRepository,
                        UserRepository userRepository,
                        EmployeeRepository employeeRepository,
                        LeaveBalanceService leaveBalanceService) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.leaveTypeRepository = leaveTypeRepository;
        this.leaveApprovalRepository = leaveApprovalRepository;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.leaveBalanceService = leaveBalanceService;
    }

    public int calculateWorkingDays(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null || startDate.isAfter(endDate)) {
            return 0;
        }
        int count = 0;
        LocalDate cur = startDate;
        while (!cur.isAfter(endDate)) {
            DayOfWeek dow = cur.getDayOfWeek();
            if (dow != DayOfWeek.SATURDAY && dow != DayOfWeek.SUNDAY) {
                count++;
            }
            cur = cur.plusDays(1);
        }
        return count;
    }

    @Transactional
    public LeaveRequestDto applyForLeave(UserPrincipal userPrincipal, LeaveApplicationRequest request) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Employee employee = employeeRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("Start date cannot be after end date");
        }

        int workingDays = calculateWorkingDays(request.getStartDate(), request.getEndDate());
        if (workingDays <= 0) {
            throw new BadRequestException("Leave duration must be at least 1 working day (excluding weekends)");
        }

        // Overlap verification
        List<LeaveRequest> overlapping = leaveRequestRepository.findOverlappingRequests(
                employee, request.getStartDate(), request.getEndDate()
        );
        if (!overlapping.isEmpty()) {
            LeaveRequest conflict = overlapping.get(0);
            throw new BadRequestException("Dates overlap with an existing " + conflict.getStatus() +
                    " leave request (" + conflict.getStartDate() + " to " + conflict.getEndDate() + ")");
        }

        LeaveType leaveType = leaveTypeRepository.findById(request.getLeaveTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Leave type not found"));

        int year = request.getStartDate().getYear();

        // Hold balance (deducts remaining, adds to pending)
        leaveBalanceService.holdBalance(employee, leaveType, workingDays, year);

        String refNumber = "LR-" + year + "-" + String.format("%03d", (int) (100 + Math.random() * 899));

        LeaveRequest leaveRequest = LeaveRequest.builder()
                .referenceNumber(refNumber)
                .employee(employee)
                .leaveType(leaveType)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalDays(workingDays)
                .reason(request.getReason())
                .status(LeaveStatus.PENDING)
                .appliedAt(LocalDateTime.now())
                .build();

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);
        return mapToDto(saved);
    }

    @Transactional
    public LeaveRequestDto cancelLeave(UserPrincipal userPrincipal, Long requestId) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + requestId));

        if (!leaveRequest.getEmployee().getUser().getId().equals(userPrincipal.getId())) {
            throw new BadRequestException("You are not authorized to cancel this leave application");
        }

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Only pending leave requests can be cancelled");
        }

        leaveRequest.setStatus(LeaveStatus.CANCELLED);
        leaveRequestRepository.save(leaveRequest);

        // Refund pending hold
        int year = leaveRequest.getStartDate().getYear();
        leaveBalanceService.releaseHold(leaveRequest.getEmployee(), leaveRequest.getLeaveType(), leaveRequest.getTotalDays(), year);

        return mapToDto(leaveRequest);
    }

    @Transactional
    public LeaveRequestDto approveLeave(UserPrincipal adminUser, Long requestId, String comment) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + requestId));

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Only pending leave requests can be approved");
        }

        User approver = userRepository.findById(adminUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        leaveRequest.setStatus(LeaveStatus.APPROVED);
        leaveRequestRepository.save(leaveRequest);

        LeaveApproval approval = LeaveApproval.builder()
                .leaveRequest(leaveRequest)
                .approver(approver)
                .status(LeaveStatus.APPROVED)
                .comments(comment != null ? comment : "Approved by administrator")
                .actionedAt(LocalDateTime.now())
                .build();
        leaveApprovalRepository.save(approval);

        int year = leaveRequest.getStartDate().getYear();
        leaveBalanceService.confirmUsed(leaveRequest.getEmployee(), leaveRequest.getLeaveType(), leaveRequest.getTotalDays(), year);

        return mapToDto(leaveRequest);
    }

    @Transactional
    public LeaveRequestDto rejectLeave(UserPrincipal adminUser, Long requestId, String comment) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + requestId));

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Only pending leave requests can be rejected");
        }

        User approver = userRepository.findById(adminUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        leaveRequest.setStatus(LeaveStatus.REJECTED);
        leaveRequestRepository.save(leaveRequest);

        LeaveApproval approval = LeaveApproval.builder()
                .leaveRequest(leaveRequest)
                .approver(approver)
                .status(LeaveStatus.REJECTED)
                .comments(comment != null ? comment : "Declined by administrator")
                .actionedAt(LocalDateTime.now())
                .build();
        leaveApprovalRepository.save(approval);

        int year = leaveRequest.getStartDate().getYear();
        leaveBalanceService.releaseHold(leaveRequest.getEmployee(), leaveRequest.getLeaveType(), leaveRequest.getTotalDays(), year);

        return mapToDto(leaveRequest);
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestDto> getMyLeaves(UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Employee employee = employeeRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        return leaveRequestRepository.findByEmployeeOrderByAppliedAtDesc(employee)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestDto> getAllLeaves() {
        return leaveRequestRepository.findAllByOrderByAppliedAtDesc()
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestDto> getPendingLeaves() {
        return leaveRequestRepository.findByStatusOrderByAppliedAtDesc(LeaveStatus.PENDING)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestDto> getApprovedLeavesForMonth(int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        return leaveRequestRepository.findApprovedLeavesInMonth(start, end)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        long totalEmployees = employeeRepository.count();
        long pending = leaveRequestRepository.findByStatusOrderByAppliedAtDesc(LeaveStatus.PENDING).size();
        LocalDate now = LocalDate.now();
        List<LeaveRequest> onLeaveToday = leaveRequestRepository.findApprovedLeavesForToday(now);

        YearMonth ym = YearMonth.from(now);
        List<LeaveRequest> approvedThisMonth = leaveRequestRepository.findApprovedLeavesInMonth(
                ym.atDay(1), ym.atEndOfMonth()
        );

        return DashboardStatsDto.builder()
                .totalEmployees(totalEmployees)
                .pendingApprovals(pending)
                .approvedThisMonth(approvedThisMonth.size())
                .onLeaveTodayCount(onLeaveToday.size())
                .onLeaveToday(onLeaveToday.stream().map(this::mapToDto).collect(Collectors.toList()))
                .build();
    }

    public LeaveRequestDto mapToDto(LeaveRequest r) {
        LeaveApproval approval = leaveApprovalRepository.findByLeaveRequest(r).orElse(null);

        return LeaveRequestDto.builder()
                .id(r.getId())
                .referenceNumber(r.getReferenceNumber())
                .employeeId(r.getEmployee().getId())
                .employeeCode(r.getEmployee().getEmployeeCode())
                .employeeName(r.getEmployee().getFullName())
                .employeeAvatar(r.getEmployee().getAvatarUrl())
                .department(r.getEmployee().getDepartment())
                .leaveTypeId(r.getLeaveType().getId())
                .leaveTypeName(r.getLeaveType().getName())
                .leaveTypeCode(r.getLeaveType().getCode())
                .startDate(r.getStartDate())
                .endDate(r.getEndDate())
                .daysCount(r.getTotalDays())
                .reason(r.getReason())
                .status(r.getStatus().name())
                .appliedAt(r.getAppliedAt())
                .approverName(approval != null && approval.getApprover() != null ? approval.getApprover().getEmail() : null)
                .approvalComment(approval != null ? approval.getComments() : null)
                .actionedAt(approval != null ? approval.getActionedAt() : null)
                .build();
    }
}
