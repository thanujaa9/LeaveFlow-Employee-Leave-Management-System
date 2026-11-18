package com.leaveflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_balances", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"employee_id", "leave_type_id", "allocation_year"})
})
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "leave_type_id", nullable = false)
    private LeaveType leaveType;

    @Column(name = "allocation_year", nullable = false)
    private int year;

    @Column(name = "total_days", nullable = false)
    private int totalDays;

    @Column(name = "used_days", nullable = false)
    private int usedDays = 0;

    @Column(name = "pending_days", nullable = false)
    private int pendingDays = 0;

    @Column(name = "remaining_days", nullable = false)
    private int remainingDays;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public LeaveBalance() {}

    public LeaveBalance(Long id, Employee employee, LeaveType leaveType, int year,
                        int totalDays, int usedDays, int pendingDays, int remainingDays, LocalDateTime updatedAt) {
        this.id = id;
        this.employee = employee;
        this.leaveType = leaveType;
        this.year = year;
        this.totalDays = totalDays;
        this.usedDays = usedDays;
        this.pendingDays = pendingDays;
        this.remainingDays = remainingDays;
        this.updatedAt = updatedAt != null ? updatedAt : LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Employee employee;
        private LeaveType leaveType;
        private int year;
        private int totalDays;
        private int usedDays = 0;
        private int pendingDays = 0;
        private int remainingDays;
        private LocalDateTime updatedAt = LocalDateTime.now();

        public Builder id(Long id) { this.id = id; return this; }
        public Builder employee(Employee employee) { this.employee = employee; return this; }
        public Builder leaveType(LeaveType leaveType) { this.leaveType = leaveType; return this; }
        public Builder year(int year) { this.year = year; return this; }
        public Builder totalDays(int totalDays) { this.totalDays = totalDays; return this; }
        public Builder usedDays(int usedDays) { this.usedDays = usedDays; return this; }
        public Builder pendingDays(int pendingDays) { this.pendingDays = pendingDays; return this; }
        public Builder remainingDays(int remainingDays) { this.remainingDays = remainingDays; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public LeaveBalance build() {
            return new LeaveBalance(id, employee, leaveType, year, totalDays, usedDays, pendingDays, remainingDays, updatedAt);
        }
    }

    @PreUpdate
    @PrePersist
    public void calculateRemaining() {
        this.remainingDays = this.totalDays - this.usedDays - this.pendingDays;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public LeaveType getLeaveType() { return leaveType; }
    public void setLeaveType(LeaveType leaveType) { this.leaveType = leaveType; }

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

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
