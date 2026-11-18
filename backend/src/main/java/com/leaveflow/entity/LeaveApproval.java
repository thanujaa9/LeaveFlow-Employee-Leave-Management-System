package com.leaveflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_approvals")
public class LeaveApproval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leave_request_id", nullable = false)
    private LeaveRequest leaveRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id", nullable = false)
    private User approver;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LeaveStatus status;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(name = "actioned_at", updatable = false)
    private LocalDateTime actionedAt = LocalDateTime.now();

    public LeaveApproval() {}

    public LeaveApproval(Long id, LeaveRequest leaveRequest, User approver, LeaveStatus status, String comments, LocalDateTime actionedAt) {
        this.id = id;
        this.leaveRequest = leaveRequest;
        this.approver = approver;
        this.status = status;
        this.comments = comments;
        this.actionedAt = actionedAt != null ? actionedAt : LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private LeaveRequest leaveRequest;
        private User approver;
        private LeaveStatus status;
        private String comments;
        private LocalDateTime actionedAt = LocalDateTime.now();

        public Builder id(Long id) { this.id = id; return this; }
        public Builder leaveRequest(LeaveRequest leaveRequest) { this.leaveRequest = leaveRequest; return this; }
        public Builder approver(User approver) { this.approver = approver; return this; }
        public Builder status(LeaveStatus status) { this.status = status; return this; }
        public Builder comments(String comments) { this.comments = comments; return this; }
        public Builder actionedAt(LocalDateTime actionedAt) { this.actionedAt = actionedAt; return this; }
        public LeaveApproval build() {
            return new LeaveApproval(id, leaveRequest, approver, status, comments, actionedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LeaveRequest getLeaveRequest() { return leaveRequest; }
    public void setLeaveRequest(LeaveRequest leaveRequest) { this.leaveRequest = leaveRequest; }

    public User getApprover() { return approver; }
    public void setApprover(User approver) { this.approver = approver; }

    public LeaveStatus getStatus() { return status; }
    public void setStatus(LeaveStatus status) { this.status = status; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public LocalDateTime getActionedAt() { return actionedAt; }
    public void setActionedAt(LocalDateTime actionedAt) { this.actionedAt = actionedAt; }
}
