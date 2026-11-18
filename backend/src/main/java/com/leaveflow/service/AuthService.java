package com.leaveflow.service;

import com.leaveflow.dto.request.LoginRequest;
import com.leaveflow.dto.response.AuthResponse;
import com.leaveflow.entity.Employee;
import com.leaveflow.entity.User;
import com.leaveflow.exception.ResourceNotFoundException;
import com.leaveflow.repository.EmployeeRepository;
import com.leaveflow.repository.UserRepository;
import com.leaveflow.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       UserRepository userRepository,
                       EmployeeRepository employeeRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail().trim().toLowerCase(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + loginRequest.getEmail()));

        Employee employee = employeeRepository.findByUser(user)
                .orElse(null);

        return AuthResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .employeeCode(employee != null ? employee.getEmployeeCode() : "N/A")
                .firstName(employee != null ? employee.getFirstName() : "Admin")
                .lastName(employee != null ? employee.getLastName() : "User")
                .department(employee != null ? employee.getDepartment() : "Administration")
                .designation(employee != null ? employee.getDesignation() : "System Administrator")
                .avatarUrl(employee != null ? employee.getAvatarUrl() : null)
                .build();
    }
}
