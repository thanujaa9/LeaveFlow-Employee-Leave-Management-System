package com.leaveflow.controller;

import com.leaveflow.dto.request.ApprovalDecisionRequest;
import com.leaveflow.dto.response.ApiResponse;
import com.leaveflow.dto.response.DashboardStatsDto;
import com.leaveflow.dto.response.LeaveRequestDto;
import com.leaveflow.security.UserPrincipal;
import com.leaveflow.service.LeaveService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/leaves")
@PreAuthorize("hasRole('ADMIN')")
public class AdminLeaveController {

    private final LeaveService leaveService;

    public AdminLeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<LeaveRequestDto>>> getAllLeaves() {
        return ResponseEntity.ok(ApiResponse.ok("All employee leave applications", leaveService.getAllLeaves()));
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<LeaveRequestDto>>> getPendingLeaves() {
        return ResponseEntity.ok(ApiResponse.ok("Pending approvals queue", leaveService.getPendingLeaves()));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<LeaveRequestDto>> approveLeave(
            @AuthenticationPrincipal UserPrincipal adminUser,
            @PathVariable Long id,
            @RequestBody(required = false) ApprovalDecisionRequest decisionRequest
    ) {
        String comment = decisionRequest != null ? decisionRequest.getComment() : "Approved by administrator";
        LeaveRequestDto dto = leaveService.approveLeave(adminUser, id, comment);
        return ResponseEntity.ok(ApiResponse.ok("Leave request approved", dto));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<LeaveRequestDto>> rejectLeave(
            @AuthenticationPrincipal UserPrincipal adminUser,
            @PathVariable Long id,
            @RequestBody(required = false) ApprovalDecisionRequest decisionRequest
    ) {
        String comment = decisionRequest != null ? decisionRequest.getComment() : "Declined by administrator";
        LeaveRequestDto dto = leaveService.rejectLeave(adminUser, id, comment);
        return ResponseEntity.ok(ApiResponse.ok("Leave request rejected", dto));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getAdminStats() {
        return ResponseEntity.ok(ApiResponse.ok("Admin dashboard statistics", leaveService.getDashboardStats()));
    }
}
