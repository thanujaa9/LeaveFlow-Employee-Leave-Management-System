import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarPlus,
  Clock,
  CalendarCheck2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLeave } from '../context/LeaveContext';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import LeaveTypeBadge from '../components/common/LeaveTypeBadge';
import ApplyLeaveModal from '../components/leave/ApplyLeaveModal';
import LeaveDetailModal from '../components/leave/LeaveDetailModal';
import { formatDateRange, formatDate, getRelativeTime } from '../utils/dateUtils';

export default function EmployeeDashboard() {
  const { currentUser } = useAuth();
  const { requests, getBalancesForEmployee, cancelLeave } = useLeave();
  const navigate = useNavigate();

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Balances for the logged-in employee
  const userBalances = getBalancesForEmployee(currentUser?.employeeId);

  // Aggregations
  const totalAllowance = userBalances.reduce((acc, curr) => acc + curr.total, 0);
  const totalUsed = userBalances.reduce((acc, curr) => acc + curr.used, 0);
  const totalPending = userBalances.reduce((acc, curr) => acc + curr.pending, 0);
  const totalRemaining = userBalances.reduce((acc, curr) => acc + curr.remaining, 0);

  // Filter requests for current employee
  const myRequests = requests.filter((r) => r.employeeId === currentUser?.employeeId);
  const pendingRequests = myRequests.filter((r) => r.status === 'PENDING');

  // Upcoming approved leaves (start date in future or current)
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingLeaves = myRequests
    .filter((r) => r.status === 'APPROVED' && r.endDate >= todayStr)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const recentActivity = myRequests.slice(0, 5);

  const handleCancelRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to cancel this pending leave request?')) {
      await cancelLeave(requestId);
      setSelectedRequest(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-blue-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-card border border-slate-800">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Employee Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser?.name}!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              {currentUser?.designation} · {currentUser?.department} · {currentUser?.employeeId}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setApplyModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all"
            >
              <CalendarPlus className="h-4 w-4" />
              <span>Apply for Leave</span>
            </button>
            <button
              onClick={() => navigate('/history')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
            >
              <span>View History</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Annual Allowance"
          value={`${totalAllowance} Days`}
          subtitle="Annual quota"
          icon={Calendar}
          colorScheme="blue"
          progress={100}
        />
        <StatCard
          title="Available Leave Balance"
          value={`${totalRemaining} Days`}
          subtitle="Ready to use"
          icon={CheckCircle2}
          colorScheme="emerald"
          progress={totalAllowance ? (totalRemaining / totalAllowance) * 100 : 0}
        />
        <StatCard
          title="Used Leave Days"
          value={`${totalUsed} Days`}
          subtitle="Approved off-days"
          icon={CalendarCheck2}
          colorScheme="slate"
          progress={totalAllowance ? (totalUsed / totalAllowance) * 100 : 0}
        />
        <StatCard
          title="Pending Approval"
          value={`${totalPending} Days`}
          subtitle={`${pendingRequests.length} active request(s)`}
          icon={Clock}
          colorScheme="amber"
          progress={totalAllowance ? (totalPending / totalAllowance) * 100 : 0}
        />
      </div>

      {/* Leave Balances Breakdown by Type */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Leave Balances by Category
          </h2>
          <span className="text-xs text-slate-400 font-medium">Fiscal Year 2026</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {userBalances.map((bal) => {
            const usagePercent = bal.total ? Math.round((bal.used / bal.total) * 100) : 0;
            return (
              <div
                key={bal.leaveTypeId}
                className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm hover:shadow transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <LeaveTypeBadge typeName={bal.leaveTypeName} />
                  <span className="text-xs font-bold text-slate-700">
                    {bal.remaining} <span className="text-slate-400 font-normal">left</span>
                  </span>
                </div>

                <div className="mt-3 flex items-baseline justify-between text-xs">
                  <span className="text-slate-500 font-medium">Used: {bal.used}d</span>
                  {bal.pending > 0 && (
                    <span className="text-amber-600 font-medium">Pending: {bal.pending}d</span>
                  )}
                  <span className="text-slate-400">Total: {bal.total}d</span>
                </div>

                {/* Progress Bar */}
                <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Upcoming Leaves & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upcoming Leaves */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Upcoming Approved Leaves</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
              {upcomingLeaves.length} scheduled
            </span>
          </div>

          <div className="mt-4 space-y-3 flex-1">
            {upcomingLeaves.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center p-4">
                <Calendar className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xs font-medium text-slate-600">No upcoming leaves</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Plan ahead by applying for your next vacation or personal days.
                </p>
              </div>
            ) : (
              upcomingLeaves.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedRequest(item)}
                  className="p-3 rounded-lg border border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/20 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <LeaveTypeBadge typeName={item.leaveTypeName} />
                    <span className="text-xs font-bold text-slate-800">
                      {item.daysCount} {item.daysCount === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 mt-2">
                    {formatDateRange(item.startDate, item.endDate)}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 italic">
                    "{item.reason}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recent Activity & Pending Tracker */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Leave Requests</h3>
              <p className="text-xs text-slate-400">Track current status and supervisor decisions</p>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-100 overflow-hidden flex-1">
            {recentActivity.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center">
                <Clock className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xs text-slate-500 font-medium">No leave activity yet.</p>
              </div>
            ) : (
              recentActivity.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{req.leaveTypeName}</span>
                        <span className="text-xs text-slate-400">· {req.daysCount}d</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatDateRange(req.startDate, req.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <StatusBadge status={req.status} size="sm" />
                      <p className="text-[10px] text-slate-400 mt-0.5">{getRelativeTime(req.appliedAt)}</p>
                    </div>
                    <div className="sm:hidden">
                      <StatusBadge status={req.status} size="sm" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Global Modals */}
      <ApplyLeaveModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />

      <LeaveDetailModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
        onCancelRequest={handleCancelRequest}
      />
    </div>
  );
}
