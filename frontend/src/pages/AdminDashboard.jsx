import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useLeave } from '../context/LeaveContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import LeaveTypeBadge from '../components/common/LeaveTypeBadge';
import LeaveDetailModal from '../components/leave/LeaveDetailModal';
import RejectReasonModal from '../components/leave/RejectReasonModal';
import { formatDateRange, formatDate, getRelativeTime } from '../utils/dateUtils';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const { requests, employees, approveLeave, rejectLeave, getStats } = useLeave();
  const navigate = useNavigate();

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const stats = getStats();

  const pendingRequests = useMemo(() => {
    return requests.filter((r) => r.status === 'PENDING');
  }, [requests]);

  const filteredPending = useMemo(() => {
    if (!searchQuery.trim()) return pendingRequests;
    const q = searchQuery.toLowerCase();
    return pendingRequests.filter(
      (r) =>
        r.employeeName.toLowerCase().includes(q) ||
        r.employeeId.toLowerCase().includes(q) ||
        r.leaveTypeName.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q)
    );
  }, [pendingRequests, searchQuery]);

  const handleApprove = async (id) => {
    await approveLeave(id, 'Approved by HR Operations.');
    setSelectedRequest(null);
    setActionSuccess('Leave request approved successfully.');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleRejectConfirm = async (id, comment) => {
    await rejectLeave(id, comment);
    setRejectingRequest(null);
    setSelectedRequest(null);
    setActionSuccess('Leave request has been declined.');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Admin Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-card border border-slate-800">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="h-4 w-4" />
              <span>HR Administrative Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Executive Leave Command Center
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Welcome {currentUser?.name}. Review time-off queues, department capacity, and organizational balances.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/admin/employees')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Users className="h-4 w-4" />
              <span>Employee Directory</span>
            </button>
            <button
              onClick={() => navigate('/calendar')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
            >
              <Calendar className="h-4 w-4" />
              <span>Leave Calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Toast Alert */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* Executive KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workforce"
          value={`${stats.totalEmployees} Members`}
          subtitle="Active directory"
          icon={Users}
          colorScheme="blue"
        />
        <StatCard
          title="Pending Approvals"
          value={`${stats.pendingCount} Requests`}
          subtitle={stats.pendingCount > 0 ? 'Requires attention' : 'All caught up'}
          icon={Clock}
          colorScheme="amber"
          trend={stats.pendingCount > 0 ? `${stats.pendingCount} awaiting` : '0 pending'}
          trendLabel=""
        />
        <StatCard
          title="Approved Leaves"
          value={`${stats.approvedCount} Records`}
          subtitle="Total approved"
          icon={CheckCircle2}
          colorScheme="emerald"
        />
        <StatCard
          title="On Leave Today"
          value={`${stats.onLeaveToday.length} Out of Office`}
          subtitle="Team away today"
          icon={Calendar}
          colorScheme="purple"
        />
      </div>

      {/* Priority Action Center: Pending Approvals Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Pending Leave Approvals</h2>
              {pendingRequests.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-bold">
                  {pendingRequests.length}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Review and act on employee leave requests awaiting administrative decision
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search pending queue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Dates & Duration</th>
                <th className="py-3 px-4">Reason / Notes</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4 text-right">Decisions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPending.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
                    <p className="text-xs font-semibold text-slate-700">Zero Pending Requests</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      All submitted leave applications have been reviewed!
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPending.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.employeeAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                          alt={req.employeeName}
                          className="h-8 w-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{req.employeeName}</p>
                          <p className="text-[11px] text-slate-400">{req.department} · {req.employeeId}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <LeaveTypeBadge typeName={req.leaveTypeName} />
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{formatDateRange(req.startDate, req.endDate)}</p>
                      <p className="text-[11px] font-bold text-blue-600">{req.daysCount} working days</p>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="truncate text-slate-600 italic" title={req.reason}>
                        "{req.reason}"
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {getRelativeTime(req.appliedAt)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => setRejectingRequest(req)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                        >
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Modals */}
      <LeaveDetailModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
        onApproveRequest={handleApprove}
        onRejectRequest={(req) => {
          setSelectedRequest(null);
          setRejectingRequest(req);
        }}
      />

      <RejectReasonModal
        isOpen={!!rejectingRequest}
        onClose={() => setRejectingRequest(null)}
        request={rejectingRequest}
        onConfirmReject={handleRejectConfirm}
      />
    </div>
  );
}
