package com.leaveflow.controller;

import com.leaveflow.dto.request.LoginRequest;
import com.leaveflow.dto.response.ApiResponse;
import com.leaveflow.dto.response.AuthResponse;
import com.leaveflow.entity.Employee;
import com.leaveflow.security.UserPrincipal;
import com.leaveflow.service.AuthService;
import com.leaveflow.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final EmployeeService employeeService;

    public AuthController(AuthService authService, EmployeeService employeeService) {
        this.authService = authService;
        this.employeeService = employeeService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        Employee employee = null;
        try {
            employee = employeeService.getEmployeeForUser(currentUser);
        } catch (Exception ignored) {}

        AuthResponse authResponse = AuthResponse.builder()
                .userId(currentUser.getId())
                .email(currentUser.getEmail())
                .role(currentUser.getAuthorities().iterator().next().getAuthority())
                .employeeCode(employee != null ? employee.getEmployeeCode() : "N/A")
                .firstName(employee != null ? employee.getFirstName() : "Admin")
                .lastName(employee != null ? employee.getLastName() : "")
                .department(employee != null ? employee.getDepartment() : "Administration")
                .designation(employee != null ? employee.getDesignation() : "System Administrator")
                .avatarUrl(employee != null ? employee.getAvatarUrl() : null)
                .build();

        return ResponseEntity.ok(ApiResponse.ok("Current user profile", authResponse));
    }
}
