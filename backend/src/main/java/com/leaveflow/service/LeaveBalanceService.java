package com.leaveflow.service;

import com.leaveflow.entity.Employee;
import com.leaveflow.entity.LeaveBalance;
import com.leaveflow.entity.LeaveType;
import com.leaveflow.exception.BadRequestException;
import com.leaveflow.repository.LeaveBalanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LeaveBalanceService {

    private final LeaveBalanceRepository leaveBalanceRepository;

    public LeaveBalanceService(LeaveBalanceRepository leaveBalanceRepository) {
        this.leaveBalanceRepository = leaveBalanceRepository;
    }

    @Transactional(readOnly = true)
    public List<LeaveBalance> getBalances(Employee employee, int year) {
        return leaveBalanceRepository.findByEmployeeAndYear(employee, year);
    }

    @Transactional
    public void holdBalance(Employee employee, LeaveType leaveType, int days, int year) {
        LeaveBalance balance = leaveBalanceRepository.findByEmployeeAndLeaveTypeAndYear(employee, leaveType, year)
                .orElseThrow(() -> new BadRequestException("No leave balance record found for " + leaveType.getName() + " in year " + year));

        if (balance.getRemainingDays() < days) {
            throw new BadRequestException("Insufficient leave balance. Remaining: " + balance.getRemainingDays() + ", Requested: " + days);
        }

        balance.setPendingDays(balance.getPendingDays() + days);
        balance.calculateRemaining();
        leaveBalanceRepository.save(balance);
    }

    @Transactional
    public void releaseHold(Employee employee, LeaveType leaveType, int days, int year) {
        LeaveBalance balance = leaveBalanceRepository.findByEmployeeAndLeaveTypeAndYear(employee, leaveType, year)
                .orElseThrow(() -> new BadRequestException("Leave balance record not found"));

        balance.setPendingDays(Math.max(0, balance.getPendingDays() - days));
        balance.calculateRemaining();
        leaveBalanceRepository.save(balance);
    }

    @Transactional
    public void confirmUsed(Employee employee, LeaveType leaveType, int days, int year) {
        LeaveBalance balance = leaveBalanceRepository.findByEmployeeAndLeaveTypeAndYear(employee, leaveType, year)
                .orElseThrow(() -> new BadRequestException("Leave balance record not found"));

        balance.setPendingDays(Math.max(0, balance.getPendingDays() - days));
        balance.setUsedDays(balance.getUsedDays() + days);
        balance.calculateRemaining();
        leaveBalanceRepository.save(balance);
    }
}
