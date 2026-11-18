import React from 'react';
import { Calendar, Clock, User, CheckCircle2, XCircle, AlertCircle, Ban } from 'lucide-react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import LeaveTypeBadge from '../common/LeaveTypeBadge';
import { formatDateRange, formatDate, getRelativeTime } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';

export default function LeaveDetailModal({
  isOpen,
  onClose,
  request,
  onCancelRequest,
  onApproveRequest,
  onRejectRequest,
}) {
  const { currentUser, isAdmin } = useAuth();
  if (!request) return null;

  const isOwner = currentUser?.employeeId === request.employeeId;
  const isPending = request.status === 'PENDING';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Leave Application Details"
      subtitle={`Reference ID: ${request.id}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        {/* Top Status & Employee Banner */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={request.employeeAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
              alt={request.employeeName}
              className="h-11 w-11 rounded-full object-cover border border-slate-200 shadow-sm"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">{request.employeeName}</p>
              <p className="text-xs text-slate-500">{request.department} · {request.employeeId}</p>
            </div>
          </div>
          <StatusBadge status={request.status} />
        </div>

        {/* Leave Specifics Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">Leave Type</span>
            <div className="mt-1">
              <LeaveTypeBadge typeName={request.leaveTypeName} />
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">Duration</span>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {request.daysCount} {request.daysCount === 1 ? 'Working Day' : 'Working Days'}
            </p>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl col-span-2">
            <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">Date Range</span>
            <div className="mt-1 flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>{formatDateRange(request.startDate, request.endDate)}</span>
            </div>
          </div>
        </div>

        {/* Reason Section */}
        <div className="p-3.5 bg-slate-50/70 border border-slate-200/90 rounded-xl">
          <span className="text-slate-500 font-semibold block text-[11px] uppercase tracking-wider mb-1">
            Reason for Leave
          </span>
          <p className="text-xs text-slate-700 leading-relaxed italic">
            "{request.reason}"
          </p>
          <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Applied {getRelativeTime(request.appliedAt)} ({formatDate(request.appliedAt)})</span>
          </div>
        </div>

        {/* Approval or Rejection Log */}
        {request.status !== 'PENDING' && (
          <div
            className={`p-3.5 rounded-xl border ${
              request.status === 'APPROVED'
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                : request.status === 'REJECTED'
                ? 'bg-rose-50/60 border-rose-200 text-rose-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold mb-1">
              {request.status === 'APPROVED' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : request.status === 'REJECTED' ? (
                <XCircle className="h-4 w-4 text-rose-600" />
              ) : (
                <Ban className="h-4 w-4 text-slate-500" />
              )}
              <span>Decision Log: {request.status}</span>
            </div>
            {request.approvalComment && (
              <p className="text-xs text-slate-700 mt-1 pl-5">
                Note: {request.approvalComment}
              </p>
            )}
            {request.approverName && (
              <p className="text-[11px] text-slate-500 mt-1 pl-5">
                Reviewed by {request.approverName} · {getRelativeTime(request.actionedAt)}
              </p>
            )}
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {/* Cancel option for employee on pending request */}
            {isOwner && isPending && onCancelRequest && (
              <button
                type="button"
                onClick={() => onCancelRequest(request.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
              >
                <Ban className="h-3.5 w-3.5" />
                <span>Cancel Request</span>
              </button>
            )}

            {/* Admin quick actions */}
            {isAdmin && isPending && (
              <>
                <button
                  type="button"
                  onClick={() => onRejectRequest(request)}
                  className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => onApproveRequest(request.id)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                >
                  Approve Leave
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
