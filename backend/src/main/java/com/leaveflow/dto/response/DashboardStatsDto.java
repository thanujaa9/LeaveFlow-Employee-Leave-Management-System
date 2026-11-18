package com.leaveflow.dto.response;

import java.util.List;

public class DashboardStatsDto {
    private long totalEmployees;
    private long pendingApprovals;
    private long approvedThisMonth;
    private long onLeaveTodayCount;
    private List<LeaveRequestDto> onLeaveToday;

    public DashboardStatsDto() {}

    public DashboardStatsDto(long totalEmployees, long pendingApprovals, long approvedThisMonth,
                             long onLeaveTodayCount, List<LeaveRequestDto> onLeaveToday) {
        this.totalEmployees = totalEmployees;
        this.pendingApprovals = pendingApprovals;
        this.approvedThisMonth = approvedThisMonth;
        this.onLeaveTodayCount = onLeaveTodayCount;
        this.onLeaveToday = onLeaveToday;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private long totalEmployees;
        private long pendingApprovals;
        private long approvedThisMonth;
        private long onLeaveTodayCount;
        private List<LeaveRequestDto> onLeaveToday;

        public Builder totalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; return this; }
        public Builder pendingApprovals(long pendingApprovals) { this.pendingApprovals = pendingApprovals; return this; }
        public Builder approvedThisMonth(long approvedThisMonth) { this.approvedThisMonth = approvedThisMonth; return this; }
        public Builder onLeaveTodayCount(long onLeaveTodayCount) { this.onLeaveTodayCount = onLeaveTodayCount; return this; }
        public Builder onLeaveToday(List<LeaveRequestDto> onLeaveToday) { this.onLeaveToday = onLeaveToday; return this; }

        public DashboardStatsDto build() {
            return new DashboardStatsDto(totalEmployees, pendingApprovals, approvedThisMonth, onLeaveTodayCount, onLeaveToday);
        }
    }

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }

    public long getPendingApprovals() { return pendingApprovals; }
    public void setPendingApprovals(long pendingApprovals) { this.pendingApprovals = pendingApprovals; }

    public long getApprovedThisMonth() { return approvedThisMonth; }
    public void setApprovedThisMonth(long approvedThisMonth) { this.approvedThisMonth = approvedThisMonth; }

    public long getOnLeaveTodayCount() { return onLeaveTodayCount; }
    public void setOnLeaveTodayCount(long onLeaveTodayCount) { this.onLeaveTodayCount = onLeaveTodayCount; }

    public List<LeaveRequestDto> getOnLeaveToday() { return onLeaveToday; }
    public void setOnLeaveToday(List<LeaveRequestDto> onLeaveToday) { this.onLeaveToday = onLeaveToday; }
}
