package com.leaveflow.controller;

import com.leaveflow.dto.response.ApiResponse;
import com.leaveflow.dto.response.LeaveBalanceDto;
import com.leaveflow.entity.Employee;
import com.leaveflow.entity.LeaveBalance;
import com.leaveflow.security.UserPrincipal;
import com.leaveflow.service.EmployeeService;
import com.leaveflow.service.LeaveBalanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/balances")
public class LeaveBalanceController {

    private final LeaveBalanceService leaveBalanceService;
    private final EmployeeService employeeService;

    public LeaveBalanceController(LeaveBalanceService leaveBalanceService, EmployeeService employeeService) {
        this.leaveBalanceService = leaveBalanceService;
        this.employeeService = employeeService;
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<LeaveBalanceDto>>> getMyBalances(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) Integer year
    ) {
        int targetYear = year != null ? year : LocalDate.now().getYear();
        Employee employee = employeeService.getEmployeeForUser(currentUser);
        List<LeaveBalance> balances = leaveBalanceService.getBalances(employee, targetYear);
        List<LeaveBalanceDto> dtos = balances.stream().map(this::mapToDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok("User leave balances", dtos));
    }

    @GetMapping("/employee/{code}")
    public ResponseEntity<ApiResponse<List<LeaveBalanceDto>>> getEmployeeBalances(
            @PathVariable String code,
            @RequestParam(required = false) Integer year
    ) {
        int targetYear = year != null ? year : LocalDate.now().getYear();
        Employee employee = employeeService.getEmployeeByCode(code);
        List<LeaveBalance> balances = leaveBalanceService.getBalances(employee, targetYear);
        List<LeaveBalanceDto> dtos = balances.stream().map(this::mapToDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok("Employee leave balances", dtos));
    }

    private LeaveBalanceDto mapToDto(LeaveBalance b) {
        return LeaveBalanceDto.builder()
                .id(b.getId())
                .leaveTypeId(b.getLeaveType().getId())
                .leaveTypeName(b.getLeaveType().getName())
                .leaveTypeCode(b.getLeaveType().getCode())
                .year(b.getYear())
                .totalDays(b.getTotalDays())
                .usedDays(b.getUsedDays())
                .pendingDays(b.getPendingDays())
                .remainingDays(b.getRemainingDays())
                .build();
    }
}
