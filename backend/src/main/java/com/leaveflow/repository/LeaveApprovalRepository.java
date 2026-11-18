package com.leaveflow.repository;

import com.leaveflow.entity.LeaveApproval;
import com.leaveflow.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LeaveApprovalRepository extends JpaRepository<LeaveApproval, Long> {
    Optional<LeaveApproval> findByLeaveRequest(LeaveRequest leaveRequest);
}
