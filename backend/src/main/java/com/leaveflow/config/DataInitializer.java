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

        log.info("Initializing LeaveFlow Enterprise Seed Data...");

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

        // 2. Admin User: Sarah Jenkins
        User adminUser = userRepository.save(User.builder()
                .email("sarah.jenkins@leaveflow.com")
                .password(encodedPassword)
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build());

        Employee adminEmp = employeeRepository.save(Employee.builder()
                .user(adminUser)
                .employeeCode("EMP-1001")
                .firstName("Sarah")
                .lastName("Jenkins")
                .department("People & Culture")
                .designation("Head of Human Resources")
                .phone("+1 (555) 234-8901")
                .joiningDate(LocalDate.of(2021, 3, 15))
                .avatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80")
                .build());

        seedBalances(adminEmp, leaveTypes);

        // 3. Employee User: David Miller
        User davidUser = userRepository.save(User.builder()
                .email("david.miller@leaveflow.com")
                .password(encodedPassword)
                .role(Role.ROLE_EMPLOYEE)
                .enabled(true)
                .build());

        Employee davidEmp = employeeRepository.save(Employee.builder()
                .user(davidUser)
                .employeeCode("EMP-1042")
                .firstName("David")
                .lastName("Miller")
                .department("Engineering")
                .designation("Staff Software Engineer")
                .phone("+1 (555) 872-3112")
                .joiningDate(LocalDate.of(2022, 6, 1))
                .avatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80")
                .build());

        seedBalances(davidEmp, leaveTypes);

        // 4. Employee User: Elena Rostova
        User elenaUser = userRepository.save(User.builder()
                .email("elena.rostova@leaveflow.com")
                .password(encodedPassword)
                .role(Role.ROLE_EMPLOYEE)
                .enabled(true)
                .build());

        Employee elenaEmp = employeeRepository.save(Employee.builder()
                .user(elenaUser)
                .employeeCode("EMP-1088")
                .firstName("Elena")
                .lastName("Rostova")
                .department("Product Design")
                .designation("Lead UI/UX Designer")
                .phone("+1 (555) 431-7729")
                .joiningDate(LocalDate.of(2022, 9, 12))
                .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80")
                .build());

        seedBalances(elenaEmp, leaveTypes);

        // 5. Employee User: Marcus Vance
        User marcusUser = userRepository.save(User.builder()
                .email("marcus.vance@leaveflow.com")
                .password(encodedPassword)
                .role(Role.ROLE_EMPLOYEE)
                .enabled(true)
                .build());

        Employee marcusEmp = employeeRepository.save(Employee.builder()
                .user(marcusUser)
                .employeeCode("EMP-1104")
                .firstName("Marcus")
                .lastName("Vance")
                .department("Engineering")
                .designation("DevOps & Cloud Architect")
                .phone("+1 (555) 902-4411")
                .joiningDate(LocalDate.of(2023, 1, 10))
                .avatarUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80")
                .build());

        seedBalances(marcusEmp, leaveTypes);

        // 6. Employee User: Aisha Patel
        User aishaUser = userRepository.save(User.builder()
                .email("aisha.patel@leaveflow.com")
                .password(encodedPassword)
                .role(Role.ROLE_EMPLOYEE)
                .enabled(true)
                .build());

        Employee aishaEmp = employeeRepository.save(Employee.builder()
                .user(aishaUser)
                .employeeCode("EMP-1115")
                .firstName("Aisha")
                .lastName("Patel")
                .department("Marketing")
                .designation("Senior Growth Manager")
                .phone("+1 (555) 612-8833")
                .joiningDate(LocalDate.of(2023, 4, 18))
                .avatarUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80")
                .build());

        seedBalances(aishaEmp, leaveTypes);

        // 7. Seed Sample Leave Requests & Approvals
        LeaveRequest pendingReq1 = leaveRequestRepository.save(LeaveRequest.builder()
                .referenceNumber("LR-2026-089")
                .employee(davidEmp)
                .leaveType(cl)
                .startDate(LocalDate.of(2026, 11, 26))
                .endDate(LocalDate.of(2026, 11, 27))
                .totalDays(2)
                .reason("Family Thanksgiving reunion and personal travel out of state.")
                .status(LeaveStatus.PENDING)
                .appliedAt(LocalDateTime.now().minusDays(1))
                .build());

        LeaveRequest pendingReq2 = leaveRequestRepository.save(LeaveRequest.builder()
                .referenceNumber("LR-2026-088")
                .employee(elenaEmp)
                .leaveType(sl)
                .startDate(LocalDate.of(2026, 11, 23))
                .endDate(LocalDate.of(2026, 11, 23))
                .totalDays(1)
                .reason("Dental surgery and prescribed follow-up recovery.")
                .status(LeaveStatus.PENDING)
                .appliedAt(LocalDateTime.now().minusHours(8))
                .build());

        LeaveRequest approvedReq1 = leaveRequestRepository.save(LeaveRequest.builder()
                .referenceNumber("LR-2026-074")
                .employee(davidEmp)
                .leaveType(el)
                .startDate(LocalDate.of(2026, 11, 5))
                .endDate(LocalDate.of(2026, 11, 9))
                .totalDays(3)
                .reason("Annual hiking expedition with college alumni in Rocky Mountain National Park.")
                .status(LeaveStatus.APPROVED)
                .appliedAt(LocalDateTime.now().minusDays(20))
                .build());

        leaveApprovalRepository.save(LeaveApproval.builder()
                .leaveRequest(approvedReq1)
                .approver(adminUser)
                .status(LeaveStatus.APPROVED)
                .comments("Approved! Have a great trip and stay safe.")
                .actionedAt(LocalDateTime.now().minusDays(19))
                .build());

        LeaveRequest approvedReq2 = leaveRequestRepository.save(LeaveRequest.builder()
                .referenceNumber("LR-2026-062")
                .employee(marcusEmp)
                .leaveType(cl)
                .startDate(LocalDate.of(2026, 11, 19))
                .endDate(LocalDate.of(2026, 11, 20))
                .totalDays(2)
                .reason("Apartment relocation and home infrastructure setup.")
                .status(LeaveStatus.APPROVED)
                .appliedAt(LocalDateTime.now().minusDays(6))
                .build());

        leaveApprovalRepository.save(LeaveApproval.builder()
                .leaveRequest(approvedReq2)
                .approver(adminUser)
                .status(LeaveStatus.APPROVED)
                .comments("Approved. Seamless sprint coverage verified with tech lead.")
                .actionedAt(LocalDateTime.now().minusDays(5))
                .build());

        LeaveRequest rejectedReq = leaveRequestRepository.save(LeaveRequest.builder()
                .referenceNumber("LR-2026-038")
                .employee(davidEmp)
                .leaveType(cl)
                .startDate(LocalDate.of(2026, 9, 15))
                .endDate(LocalDate.of(2026, 9, 16))
                .totalDays(2)
                .reason("Long weekend road trip to Pacific coast.")
                .status(LeaveStatus.REJECTED)
                .appliedAt(LocalDateTime.now().minusMonths(2))
                .build());

        leaveApprovalRepository.save(LeaveApproval.builder()
                .leaveRequest(rejectedReq)
                .approver(adminUser)
                .status(LeaveStatus.REJECTED)
                .comments("Quarterly architecture migration scheduled on Sept 15th requires all core backend engineers.")
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
