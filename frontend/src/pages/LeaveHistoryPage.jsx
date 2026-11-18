import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Eye,
  Ban,
  Clock,
  ArrowUpDown,
  Download,
  AlertCircle,
} from 'lucide-react';
import { useLeave } from '../context/LeaveContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import LeaveTypeBadge from '../components/common/LeaveTypeBadge';
import LeaveDetailModal from '../components/leave/LeaveDetailModal';
import { formatDateRange, formatDate, getRelativeTime } from '../utils/dateUtils';

export default function LeaveHistoryPage() {
  const { currentUser, isAdmin } = useAuth();
  const { requests, cancelLeave } = useLeave();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Filter requests: if employee, only own requests; if admin, can view all
  const filteredRequests = useMemo(() => {
    let list = isAdmin ? requests : requests.filter((r) => r.employeeId === currentUser?.employeeId);

    if (statusFilter !== 'ALL') {
      list = list.filter((r) => r.status === statusFilter);
    }
    if (typeFilter !== 'ALL') {
      list = list.filter((r) => r.leaveTypeName === typeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q) ||
          r.employeeName?.toLowerCase().includes(q) ||
          r.leaveTypeName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [requests, currentUser, isAdmin, statusFilter, typeFilter, searchQuery]);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this leave application?')) {
      await cancelLeave(id);
      setSelectedRequest(null);
    }
  };

  const statusTabs = [
    { key: 'ALL', label: 'All Requests' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'REJECTED', label: 'Rejected' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {isAdmin ? 'Global Leave Applications' : 'My Leave History'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail of all requested, approved, declined and cancelled time-off.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-sm">
            Total records: {filteredRequests.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-4">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {statusTabs.map((tab) => {
            const count = (isAdmin
              ? requests
              : requests.filter((r) => r.employeeId === currentUser?.employeeId)
            ).filter((r) => (tab.key === 'ALL' ? true : r.status === tab.key)).length;

            const isSelected = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Leave Type Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-slate-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, reason, or leave category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
            >
              <option value="ALL">All Categories</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Earned Leave">Earned Leave</option>
              <option value="Paternity / Maternity">Paternity / Maternity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Application ID</th>
                {isAdmin && <th className="py-3 px-4">Employee</th>}
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Date Range</th>
                <th className="py-3 px-4">Days</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Applied</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 9 : 8} className="py-12 text-center text-slate-400">
                    <AlertCircle className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-semibold text-slate-600">No leave applications found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try altering your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">{req.id}</td>
                    {isAdmin && (
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={req.employeeAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                            alt={req.employeeName}
                            className="h-6 w-6 rounded-full object-cover border border-slate-200"
                          />
                          <span className="font-semibold text-slate-900">{req.employeeName}</span>
                        </div>
                      </td>
                    )}
                    <td className="py-3 px-4">
                      <LeaveTypeBadge typeName={req.leaveTypeName} />
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {formatDateRange(req.startDate, req.endDate)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {req.daysCount}d
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-500" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={req.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {getRelativeTime(req.appliedAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          title="View Details"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {req.status === 'PENDING' && req.employeeId === currentUser?.employeeId && (
                          <button
                            onClick={() => handleCancel(req.id)}
                            title="Cancel Application"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Detail Modal */}
      <LeaveDetailModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
        onCancelRequest={handleCancel}
      />
    </div>
  );
}
