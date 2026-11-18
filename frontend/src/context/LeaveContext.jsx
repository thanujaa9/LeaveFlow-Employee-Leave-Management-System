import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_LEAVE_TYPES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_BALANCES,
  INITIAL_USERS,
} from '../services/mockData';
import { useAuth } from './AuthContext';
import { calculateWorkingDays } from '../utils/dateUtils';
import { request } from '../services/api';

const LeaveContext = createContext(null);

export function LeaveProvider({ children }) {
  const { currentUser } = useAuth();

  const [leaveTypes, setLeaveTypes] = useState(() => {
    const saved = localStorage.getItem('leaveflow_types');
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_TYPES;
  });

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('leaveflow_requests');
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  const [balances, setBalances] = useState(() => {
    const saved = localStorage.getItem('leaveflow_balances');
    return saved ? JSON.parse(saved) : INITIAL_BALANCES;
  });

  const [employees] = useState(INITIAL_USERS);

  // Sync to local storage for persistence across reloads
  useEffect(() => {
    localStorage.setItem('leaveflow_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('leaveflow_balances', JSON.stringify(balances));
  }, [balances]);

  // Try fetching from backend if available, fallback smoothly
  useEffect(() => {
    async function fetchBackendData() {
      try {
        const typesRes = await request('/leave-types');
        if (Array.isArray(typesRes) && typesRes.length > 0) {
          setLeaveTypes(typesRes);
        }
      } catch (e) {
        // backend unavailable, using initial mock data
      }
    }
    fetchBackendData();
  }, []);

  const getBalancesForEmployee = (employeeId) => {
    return balances[employeeId] || balances['EMP-1042'] || [];
  };

  const checkOverlap = (employeeId, startDate, endDate, excludeId = null) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const empRequests = requests.filter(
      (r) =>
        r.employeeId === employeeId &&
        r.id !== excludeId &&
        ['PENDING', 'APPROVED'].includes(r.status)
    );

    for (const req of empRequests) {
      const reqStart = new Date(req.startDate);
      const reqEnd = new Date(req.endDate);

      // Overlap condition
      if (start <= reqEnd && end >= reqStart) {
        return {
          hasOverlap: true,
          conflictingRequest: req,
        };
      }
    }
    return { hasOverlap: false, conflictingRequest: null };
  };

  const applyLeave = async ({ leaveTypeId, startDate, endDate, reason }) => {
    if (!currentUser) throw new Error('You must be logged in to apply for leave.');

    const leaveType = leaveTypes.find((lt) => lt.id === Number(leaveTypeId));
    if (!leaveType) throw new Error('Invalid leave type selected.');

    const daysCount = calculateWorkingDays(startDate, endDate);
    if (daysCount <= 0) {
      throw new Error('Leave duration must be at least 1 working day (excluding weekends).');
    }

    // Overlap check
    const overlap = checkOverlap(currentUser.employeeId, startDate, endDate);
    if (overlap.hasOverlap) {
      throw new Error(
        `Overlaps with existing ${overlap.conflictingRequest.status.toLowerCase()} leave (${overlap.conflictingRequest.startDate} to ${overlap.conflictingRequest.endDate}).`
      );
    }

    // Balance check
    const currentBalList = getBalancesForEmployee(currentUser.employeeId);
    const balEntry = currentBalList.find((b) => b.leaveTypeId === Number(leaveTypeId));
    if (balEntry && balEntry.remaining < daysCount) {
      throw new Error(
        `Insufficient balance. You have ${balEntry.remaining} days remaining for ${leaveType.name}, but requested ${daysCount} days.`
      );
    }

    const newRequest = {
      id: `LR-2026-${String(Math.floor(100 + Math.random() * 900))}`,
      employeeId: currentUser.employeeId,
      employeeName: currentUser.name,
      employeeAvatar: currentUser.avatar,
      department: currentUser.department,
      leaveTypeId: Number(leaveTypeId),
      leaveTypeName: leaveType.name,
      startDate,
      endDate,
      daysCount,
      reason,
      status: 'PENDING',
      appliedAt: new Date().toISOString(),
      approverName: null,
      approvalComment: null,
      actionedAt: null,
    };

    // Update balances: increase pending, decrease remaining
    setBalances((prev) => {
      const userBals = prev[currentUser.employeeId] || [];
      const updated = userBals.map((b) => {
        if (b.leaveTypeId === Number(leaveTypeId)) {
          return {
            ...b,
            pending: b.pending + daysCount,
            remaining: Math.max(0, b.remaining - daysCount),
          };
        }
        return b;
      });
      return {
        ...prev,
        [currentUser.employeeId]: updated,
      };
    });

    setRequests((prev) => [newRequest, ...prev]);
    return newRequest;
  };

  const cancelLeave = async (requestId) => {
    const target = requests.find((r) => r.id === requestId);
    if (!target) throw new Error('Leave request not found.');
    if (target.status !== 'PENDING') {
      throw new Error('Only pending leave requests can be cancelled.');
    }

    // Refund pending balance
    setBalances((prev) => {
      const userBals = prev[target.employeeId] || [];
      const updated = userBals.map((b) => {
        if (b.leaveTypeId === target.leaveTypeId) {
          return {
            ...b,
            pending: Math.max(0, b.pending - target.daysCount),
            remaining: b.remaining + target.daysCount,
          };
        }
        return b;
      });
      return {
        ...prev,
        [target.employeeId]: updated,
      };
    });

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'CANCELLED',
              approvalComment: 'Cancelled by applicant',
              actionedAt: new Date().toISOString(),
            }
          : r
      )
    );
  };

  const approveLeave = async (requestId, comment = 'Approved.') => {
    const target = requests.find((r) => r.id === requestId);
    if (!target) throw new Error('Leave request not found.');
    if (target.status !== 'PENDING') {
      throw new Error('Only pending requests can be approved.');
    }

    // Move days from pending to used
    setBalances((prev) => {
      const userBals = prev[target.employeeId] || [];
      const updated = userBals.map((b) => {
        if (b.leaveTypeId === target.leaveTypeId) {
          return {
            ...b,
            pending: Math.max(0, b.pending - target.daysCount),
            used: b.used + target.daysCount,
          };
        }
        return b;
      });
      return {
        ...prev,
        [target.employeeId]: updated,
      };
    });

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'APPROVED',
              approverName: currentUser?.name || 'HR Admin',
              approvalComment: comment,
              actionedAt: new Date().toISOString(),
            }
          : r
      )
    );
  };

  const rejectLeave = async (requestId, comment = 'Request declined.') => {
    const target = requests.find((r) => r.id === requestId);
    if (!target) throw new Error('Leave request not found.');
    if (target.status !== 'PENDING') {
      throw new Error('Only pending requests can be rejected.');
    }

    // Refund pending back to remaining
    setBalances((prev) => {
      const userBals = prev[target.employeeId] || [];
      const updated = userBals.map((b) => {
        if (b.leaveTypeId === target.leaveTypeId) {
          return {
            ...b,
            pending: Math.max(0, b.pending - target.daysCount),
            remaining: b.remaining + target.daysCount,
          };
        }
        return b;
      });
      return {
        ...prev,
        [target.employeeId]: updated,
      };
    });

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'REJECTED',
              approverName: currentUser?.name || 'HR Admin',
              approvalComment: comment,
              actionedAt: new Date().toISOString(),
            }
          : r
      )
    );
  };

  // Helper stats
  const getStats = () => {
    const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
    const approvedCount = requests.filter((r) => r.status === 'APPROVED').length;
    const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length;
    const totalEmployees = employees.length;

    // Today's active leaves
    const todayStr = new Date().toISOString().split('T')[0];
    const onLeaveToday = requests.filter((r) => {
      if (r.status !== 'APPROVED') return false;
      return todayStr >= r.startDate && todayStr <= r.endDate;
    });

    return {
      pendingCount,
      approvedCount,
      rejectedCount,
      totalEmployees,
      onLeaveToday,
    };
  };

  return (
    <LeaveContext.Provider
      value={{
        leaveTypes,
        requests,
        balances,
        employees,
        getBalancesForEmployee,
        checkOverlap,
        applyLeave,
        cancelLeave,
        approveLeave,
        rejectLeave,
        getStats,
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
}

export function useLeave() {
  const context = useContext(LeaveContext);
  if (!context) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
}
