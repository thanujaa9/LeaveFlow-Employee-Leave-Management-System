package com.leaveflow.config;

import com.leaveflow.entity.*;
import com.leaveflow.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveApprovalRepository leaveApprovalRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           EmployeeRepository employeeRepository,
                           LeaveTypeRepository leaveTypeRepository,
                           LeaveBalanceRepository leaveBalanceRepository,
                           LeaveRequestRepository leaveRequestRepository,
                           LeaveApprovalRepository leaveApprovalRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.leaveTypeRepository = leaveTypeRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.leaveApprovalRepository = leaveApprovalRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("LeaveFlow database is already seeded. Skipping initialization.");
            return;
        }

        log.info("Initializing LeaveFlow Enterprise Seed Data with Indian staff profiles...");

        // 1. Leave Types
        LeaveType cl = leaveTypeRepository.save(LeaveType.builder()
                .name("Casual Leave").code("CL").defaultDays(12).colorCode("#2563EB")
                .description("Personal errands, family events, and short planned breaks").build());

        LeaveType sl = leaveTypeRepository.save(LeaveType.builder()
                .name("Sick Leave").code("SL").defaultDays(10).colorCode("#D97706")
                .description("Medical appointments, sudden illness, and recovery").build());

        LeaveType el = leaveTypeRepository.save(LeaveType.builder()
                .name("Earned Leave").code("EL").defaultDays(15).colorCode("#059669")
                .description("Annual vacations, travel, and extended personal time off").build());

        LeaveType pl = leaveTypeRepository.save(LeaveType.builder()
                .name("Paternity / Maternity").code("PL").defaultDays(30).colorCode("#7C3AED")
                .description("Parental leave for childbirth and early childcare support").build());

        List<LeaveType> leaveTypes = List.of(cl, sl, el, pl);

        String encodedPassword = passwordEncoder.encode("password123");

        // 2. Admin User: Priya Nair
        User adminUser = userRepository.save(User.builder()
                .email("priya.nair@leaveflow.com")
                .password(encodedPassword)
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build());

        Employee adminEmp = employeeRepository.save(Employee.builder()
                .user(adminUser)
                .employeeCode("EMP-1001")
                .firstName("Priya")
                .lastName("Nair")
                .department("People & Culture")
                .designation("Head of Human Resources")
                .phone("+91 98201 44521")
                .joiningDate(LocalDate.of(2021, 3, 15))
                .avatarUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80")
                .build());

        seedBalances(adminEmp, leaveTypes);

        // 3. Employee User: Rohan Sharma
        User rohanUser = userRepository.save(User.builder()
                .email("rohan.sharma@leaveflow.com")
                .password(encodedPassword)
                .role(Role.ROLE_EMPLOYEE)
                .enabled(true)
                .build());

        Employee rohanEmp = employeeRepository.save(Employee.builder()
                .user(rohanUser)
                .employeeCode("EMP-1042")
                .firstName("Rohan")
                .lastName("Sharma")
                .department("Engineering")
                .designation("Staff Software Engineer")
                .phone("+91 98452 33112")
                .joiningDate(LocalDate.of(2022, 6, 1))
                .avatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80")
                .build());

        seedBalances(rohanEmp, leaveTypes);

        // 4. Employee User: Ananya Iyer
        User ananyaUser = userRepository.save(User.builder()
                .email("ananya.iyer@leaveflow.com")
                .password(encodedPassword)
                .role(Role.ROLE_EMPLOYEE)
                .enabled(true)
                .build());

        Employee ananyaEmp = employeeRepository.save(Employee.builder()
                .user(ananyaUser)
                .employeeCode("EMP-1088")
                .firstName("Ananya")
                .lastName("Iyer")
                .department("Product Design")
                .designation("Lead UI/UX Designer")
                .phone("+91 97110 77291")
                .joiningDate(LocalDate.of(2022, 9, 12))
                .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80")
                .build());

        seedBalances(ananyaEmp, leaveTypes);

        // 5. Employee User: Vikram Malhotra
        User vikramUser = userRepository.save(User.builder()
                .email("vikram.malhotra@leaveflow.com")
                .password(encodedPassword)
                .role(Role.ROLE_EMPLOYEE)
                .enabled(true)
                .build());

        Employee vikramEmp = employeeRepository.save(Employee.builder()
                .user(vikramUser)
                .employeeCode("EMP-1104")
                .firstName("Vikram")
                .lastName("Malhotra")
                .department("Engineering")
                .designation("DevOps & Cloud Architect")
                .phone("+91 99801 88411")
                .joiningDate(LocalDate.of(2023, 1, 10))
                .avatarUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80")
                .build());

        seedBalances(vikramEmp, leaveTypes);

        // 6. Employee User: Neha Verma
        User nehaUser = userRepository.save(User.builder()
                .email("neha.verma@leaveflow.com")
                .password(encodedPassword)
                .role(Role.ROLE_EMPLOYEE)
                .enabled(true)
                .build());

        Employee nehaEmp = employeeRepository.save(Employee.builder()
                .user(nehaUser)
                .employeeCode("EMP-1115")
                .firstName("Neha")
                .lastName("Verma")
                .department("Marketing")
                .designation("Senior Growth Manager")
                .phone("+91 98103 66733")
                .joiningDate(LocalDate.of(2023, 4, 18))
                .avatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80")
                .build());

        seedBalances(nehaEmp, leaveTypes);

        // 7. Seed Sample Leave Requests & Approvals
        LeaveRequest pendingReq1 = leaveRequestRepository.save(LeaveRequest.builder()
                .referenceNumber("LR-2026-089")
                .employee(rohanEmp)
                .leaveType(cl)
                .startDate(LocalDate.of(2026, 11, 26))
                .endDate(LocalDate.of(2026, 11, 27))
                .totalDays(2)
                .reason("Family wedding celebrations and travel to hometown in Jaipur.")
                .status(LeaveStatus.PENDING)
                .appliedAt(LocalDateTime.now().minusDays(1))
                .build());

        LeaveRequest pendingReq2 = leaveRequestRepository.save(LeaveRequest.builder()
                .referenceNumber("LR-2026-088")
                .employee(ananyaEmp)
                .leaveType(sl)
                .startDate(LocalDate.of(2026, 11, 23))
                .endDate(LocalDate.of(2026, 11, 23))
                .totalDays(1)
                .reason("Dental appointment and prescribed post-procedure rest.")
                .status(LeaveStatus.PENDING)
                .appliedAt(LocalDateTime.now().minusHours(8))
                .build());

        LeaveRequest approvedReq1 = leaveRequestRepository.save(LeaveRequest.builder()
                .referenceNumber("LR-2026-074")
                .employee(rohanEmp)
                .leaveType(el)
                .startDate(LocalDate.of(2026, 11, 5))
                .endDate(LocalDate.of(2026, 11, 9))
                .totalDays(3)
                .reason("Annual trekking trip in Himachal Pradesh with college batchmates.")
                .status(LeaveStatus.APPROVED)
                .appliedAt(LocalDateTime.now().minusDays(20))
                .build());

        leaveApprovalRepository.save(LeaveApproval.builder()
                .leaveRequest(approvedReq1)
                .approver(adminUser)
                .status(LeaveStatus.APPROVED)
                .comments("Approved! Have a refreshing trek Rohan.")
                .actionedAt(LocalDateTime.now().minusDays(19))
                .build());

        LeaveRequest approvedReq2 = leaveRequestRepository.save(LeaveRequest.builder()
                .referenceNumber("LR-2026-062")
                .employee(vikramEmp)
                .leaveType(cl)
                .startDate(LocalDate.of(2026, 11, 19))
                .endDate(LocalDate.of(2026, 11, 20))
                .totalDays(2)
                .reason("Apartment shifting and home internet setup in Pune.")
                .status(LeaveStatus.APPROVED)
                .appliedAt(LocalDateTime.now().minusDays(6))
                .build());

        leaveApprovalRepository.save(LeaveApproval.builder()
                .leaveRequest(approvedReq2)
                .approver(adminUser)
                .status(LeaveStatus.APPROVED)
                .comments("Approved. Sprint deliverables covered by DevOps team.")
                .actionedAt(LocalDateTime.now().minusDays(5))
                .build());

        LeaveRequest rejectedReq = leaveRequestRepository.save(LeaveRequest.builder()
                .referenceNumber("LR-2026-038")
                .employee(rohanEmp)
                .leaveType(cl)
                .startDate(LocalDate.of(2026, 9, 15))
                .endDate(LocalDate.of(2026, 9, 16))
                .totalDays(2)
                .reason("Long weekend family trip to Goa.")
                .status(LeaveStatus.REJECTED)
                .appliedAt(LocalDateTime.now().minusMonths(2))
                .build());

        leaveApprovalRepository.save(LeaveApproval.builder()
                .leaveRequest(rejectedReq)
                .approver(adminUser)
                .status(LeaveStatus.REJECTED)
                .comments("Major Q3 microservices migration scheduled on Sept 15 requires all senior engineering leads.")
                .actionedAt(LocalDateTime.now().minusMonths(2).plusDays(1))
                .build());

        log.info("LeaveFlow Enterprise Seed Data successfully populated.");
    }

    private void seedBalances(Employee emp, List<LeaveType> types) {
        int currentYear = 2026;
        for (LeaveType type : types) {
            int used = 0;
            int pending = 0;
            if (emp.getEmployeeCode().equals("EMP-1042") && type.getCode().equals("CL")) {
                used = 4;
                pending = 2;
            } else if (emp.getEmployeeCode().equals("EMP-1042") && type.getCode().equals("EL")) {
                used = 3;
            } else if (emp.getEmployeeCode().equals("EMP-1088") && type.getCode().equals("SL")) {
                used = 1;
                pending = 1;
            }

            LeaveBalance balance = LeaveBalance.builder()
                    .employee(emp)
                    .leaveType(type)
                    .year(currentYear)
                    .totalDays(type.getDefaultDays())
                    .usedDays(used)
                    .pendingDays(pending)
                    .remainingDays(type.getDefaultDays() - used - pending)
                    .build();
            leaveBalanceRepository.save(balance);
        }
    }
}
