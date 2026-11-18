package com.leaveflow.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class LeaveRequestDto {
    private Long id;
    private String referenceNumber;
    private Long employeeId;
    private String employeeCode;
    private String employeeName;
    private String employeeAvatar;
    private String department;
    private Long leaveTypeId;
    private String leaveTypeName;
    private String leaveTypeCode;
    private LocalDate startDate;
    private LocalDate endDate;
    private int daysCount;
    private String reason;
    private String status;
    private LocalDateTime appliedAt;
    private String approverName;
    private String approvalComment;
    private LocalDateTime actionedAt;

    public LeaveRequestDto() {}

    public LeaveRequestDto(Long id, String referenceNumber, Long employeeId, String employeeCode,
                           String employeeName, String employeeAvatar, String department,
                           Long leaveTypeId, String leaveTypeName, String leaveTypeCode,
                           LocalDate startDate, LocalDate endDate, int daysCount, String reason,
                           String status, LocalDateTime appliedAt, String approverName,
                           String approvalComment, LocalDateTime actionedAt) {
        this.id = id;
        this.referenceNumber = referenceNumber;
        this.employeeId = employeeId;
        this.employeeCode = employeeCode;
        this.employeeName = employeeName;
        this.employeeAvatar = employeeAvatar;
        this.department = department;
        this.leaveTypeId = leaveTypeId;
        this.leaveTypeName = leaveTypeName;
        this.leaveTypeCode = leaveTypeCode;
        this.startDate = startDate;
        this.endDate = endDate;
        this.daysCount = daysCount;
        this.reason = reason;
        this.status = status;
        this.appliedAt = appliedAt;
        this.approverName = approverName;
        this.approvalComment = approvalComment;
        this.actionedAt = actionedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String referenceNumber;
        private Long employeeId;
        private String employeeCode;
        private String employeeName;
        private String employeeAvatar;
        private String department;
        private Long leaveTypeId;
        private String leaveTypeName;
        private String leaveTypeCode;
        private LocalDate startDate;
        private LocalDate endDate;
        private int daysCount;
        private String reason;
        private String status;
        private LocalDateTime appliedAt;
        private String approverName;
        private String approvalComment;
        private LocalDateTime actionedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder referenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; return this; }
        public Builder employeeId(Long employeeId) { this.employeeId = employeeId; return this; }
        public Builder employeeCode(String employeeCode) { this.employeeCode = employeeCode; return this; }
        public Builder employeeName(String employeeName) { this.employeeName = employeeName; return this; }
        public Builder employeeAvatar(String employeeAvatar) { this.employeeAvatar = employeeAvatar; return this; }
        public Builder department(String department) { this.department = department; return this; }
        public Builder leaveTypeId(Long leaveTypeId) { this.leaveTypeId = leaveTypeId; return this; }
        public Builder leaveTypeName(String leaveTypeName) { this.leaveTypeName = leaveTypeName; return this; }
        public Builder leaveTypeCode(String leaveTypeCode) { this.leaveTypeCode = leaveTypeCode; return this; }
        public Builder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public Builder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public Builder daysCount(int daysCount) { this.daysCount = daysCount; return this; }
        public Builder reason(String reason) { this.reason = reason; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder appliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; return this; }
        public Builder approverName(String approverName) { this.approverName = approverName; return this; }
        public Builder approvalComment(String approvalComment) { this.approvalComment = approvalComment; return this; }
        public Builder actionedAt(LocalDateTime actionedAt) { this.actionedAt = actionedAt; return this; }

        public LeaveRequestDto build() {
            return new LeaveRequestDto(id, referenceNumber, employeeId, employeeCode, employeeName, employeeAvatar, department,
                    leaveTypeId, leaveTypeName, leaveTypeCode, startDate, endDate, daysCount, reason, status, appliedAt,
                    approverName, approvalComment, actionedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReferenceNumber() { return referenceNumber; }
    public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getEmployeeAvatar() { return employeeAvatar; }
    public void setEmployeeAvatar(String employeeAvatar) { this.employeeAvatar = employeeAvatar; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Long getLeaveTypeId() { return leaveTypeId; }
    public void setLeaveTypeId(Long leaveTypeId) { this.leaveTypeId = leaveTypeId; }

    public String getLeaveTypeName() { return leaveTypeName; }
    public void setLeaveTypeName(String leaveTypeName) { this.leaveTypeName = leaveTypeName; }

    public String getLeaveTypeCode() { return leaveTypeCode; }
    public void setLeaveTypeCode(String leaveTypeCode) { this.leaveTypeCode = leaveTypeCode; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public int getDaysCount() { return daysCount; }
    public void setDaysCount(int daysCount) { this.daysCount = daysCount; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }

    public String getApproverName() { return approverName; }
    public void setApproverName(String approverName) { this.approverName = approverName; }

    public String getApprovalComment() { return approvalComment; }
    public void setApprovalComment(String approvalComment) { this.approvalComment = approvalComment; }

    public LocalDateTime getActionedAt() { return actionedAt; }
    public void setActionedAt(LocalDateTime actionedAt) { this.actionedAt = actionedAt; }
}
