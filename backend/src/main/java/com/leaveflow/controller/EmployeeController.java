package com.leaveflow.controller;

import com.leaveflow.dto.response.ApiResponse;
import com.leaveflow.entity.Employee;
import com.leaveflow.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Employee>>> getAllEmployees() {
        return ResponseEntity.ok(ApiResponse.ok("Workforce employee directory", employeeService.getAllEmployees()));
    }

    @GetMapping("/{code}")
    public ResponseEntity<ApiResponse<Employee>> getEmployeeByCode(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.ok("Employee profile", employeeService.getEmployeeByCode(code)));
    }
}
