package com.leaveflow.controller;

import com.leaveflow.dto.request.LeaveApplicationRequest;
import com.leaveflow.dto.response.ApiResponse;
import com.leaveflow.dto.response.LeaveRequestDto;
import com.leaveflow.security.UserPrincipal;
import com.leaveflow.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveRequestController {

    private final LeaveService leaveService;

    public LeaveRequestController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<LeaveRequestDto>> applyForLeave(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody LeaveApplicationRequest request
    ) {
        LeaveRequestDto dto = leaveService.applyForLeave(currentUser, request);
        return ResponseEntity.ok(ApiResponse.ok("Leave application submitted successfully", dto));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<LeaveRequestDto>>> getMyLeaves(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<LeaveRequestDto> leaves = leaveService.getMyLeaves(currentUser);
        return ResponseEntity.ok(ApiResponse.ok("Personal leave history", leaves));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<LeaveRequestDto>> cancelLeave(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id
    ) {
        LeaveRequestDto dto = leaveService.cancelLeave(currentUser, id);
        return ResponseEntity.ok(ApiResponse.ok("Leave application cancelled", dto));
    }

    @GetMapping("/calendar")
    public ResponseEntity<ApiResponse<List<LeaveRequestDto>>> getCalendarLeaves(
            @RequestParam(defaultValue = "2026") int year,
            @RequestParam(defaultValue = "11") int month
    ) {
        List<LeaveRequestDto> leaves = leaveService.getApprovedLeavesForMonth(year, month);
        return ResponseEntity.ok(ApiResponse.ok("Approved leaves for calendar", leaves));
    }
}
