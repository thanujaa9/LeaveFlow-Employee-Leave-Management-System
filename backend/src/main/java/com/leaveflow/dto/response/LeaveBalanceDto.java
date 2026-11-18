package com.leaveflow.dto.response;

public class LeaveBalanceDto {
    private Long id;
    private Long leaveTypeId;
    private String leaveTypeName;
    private String leaveTypeCode;
    private int year;
    private int totalDays;
    private int usedDays;
    private int pendingDays;
    private int remainingDays;

    public LeaveBalanceDto() {}

    public LeaveBalanceDto(Long id, Long leaveTypeId, String leaveTypeName, String leaveTypeCode,
                           int year, int totalDays, int usedDays, int pendingDays, int remainingDays) {
        this.id = id;
        this.leaveTypeId = leaveTypeId;
        this.leaveTypeName = leaveTypeName;
        this.leaveTypeCode = leaveTypeCode;
        this.year = year;
        this.totalDays = totalDays;
        this.usedDays = usedDays;
        this.pendingDays = pendingDays;
        this.remainingDays = remainingDays;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long leaveTypeId;
        private String leaveTypeName;
        private String leaveTypeCode;
        private int year;
        private int totalDays;
        private int usedDays;
        private int pendingDays;
        private int remainingDays;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder leaveTypeId(Long leaveTypeId) { this.leaveTypeId = leaveTypeId; return this; }
        public Builder leaveTypeName(String leaveTypeName) { this.leaveTypeName = leaveTypeName; return this; }
        public Builder leaveTypeCode(String leaveTypeCode) { this.leaveTypeCode = leaveTypeCode; return this; }
        public Builder year(int year) { this.year = year; return this; }
        public Builder totalDays(int totalDays) { this.totalDays = totalDays; return this; }
        public Builder usedDays(int usedDays) { this.usedDays = usedDays; return this; }
        public Builder pendingDays(int pendingDays) { this.pendingDays = pendingDays; return this; }
        public Builder remainingDays(int remainingDays) { this.remainingDays = remainingDays; return this; }

        public LeaveBalanceDto build() {
            return new LeaveBalanceDto(id, leaveTypeId, leaveTypeName, leaveTypeCode, year, totalDays, usedDays, pendingDays, remainingDays);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getLeaveTypeId() { return leaveTypeId; }
    public void setLeaveTypeId(Long leaveTypeId) { this.leaveTypeId = leaveTypeId; }

    public String getLeaveTypeName() { return leaveTypeName; }
    public void setLeaveTypeName(String leaveTypeName) { this.leaveTypeName = leaveTypeName; }

    public String getLeaveTypeCode() { return leaveTypeCode; }
    public void setLeaveTypeCode(String leaveTypeCode) { this.leaveTypeCode = leaveTypeCode; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public int getTotalDays() { return totalDays; }
    public void setTotalDays(int totalDays) { this.totalDays = totalDays; }

    public int getUsedDays() { return usedDays; }
    public void setUsedDays(int usedDays) { this.usedDays = usedDays; }

    public int getPendingDays() { return pendingDays; }
    public void setPendingDays(int pendingDays) { this.pendingDays = pendingDays; }

    public int getRemainingDays() { return remainingDays; }
    public void setRemainingDays(int remainingDays) { this.remainingDays = remainingDays; }
}
