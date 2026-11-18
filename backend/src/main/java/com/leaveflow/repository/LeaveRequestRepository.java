package com.leaveflow.repository;

import com.leaveflow.entity.Employee;
import com.leaveflow.entity.LeaveRequest;
import com.leaveflow.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeOrderByAppliedAtDesc(Employee employee);
    List<LeaveRequest> findByStatusOrderByAppliedAtDesc(LeaveStatus status);
    List<LeaveRequest> findAllByOrderByAppliedAtDesc();

    Optional<LeaveRequest> findByReferenceNumber(String referenceNumber);

    @Query("SELECT r FROM LeaveRequest r WHERE r.employee = :employee " +
           "AND r.status IN ('PENDING', 'APPROVED') " +
           "AND (:startDate <= r.endDate AND :endDate >= r.startDate)")
    List<LeaveRequest> findOverlappingRequests(
            @Param("employee") Employee employee,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT r FROM LeaveRequest r WHERE r.status = 'APPROVED' " +
           "AND (:today >= r.startDate AND :today <= r.endDate)")
    List<LeaveRequest> findApprovedLeavesForToday(@Param("today") LocalDate today);

    @Query("SELECT r FROM LeaveRequest r WHERE r.status = 'APPROVED' " +
           "AND ((r.startDate BETWEEN :startOfMonth AND :endOfMonth) OR (r.endDate BETWEEN :startOfMonth AND :endOfMonth))")
    List<LeaveRequest> findApprovedLeavesInMonth(
            @Param("startOfMonth") LocalDate startOfMonth,
            @Param("endOfMonth") LocalDate endOfMonth);
}
