import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle, Info, CheckCircle2, Clock, Send } from 'lucide-react';
import Modal from '../common/Modal';
import { useLeave } from '../../context/LeaveContext';
import { useAuth } from '../../context/AuthContext';
import { calculateWorkingDays, formatDate } from '../../utils/dateUtils';

export default function ApplyLeaveModal({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const { leaveTypes, getBalancesForEmployee, applyLeave, checkOverlap } = useLeave();

  const [leaveTypeId, setLeaveTypeId] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Default dates helper
  useEffect(() => {
    if (isOpen) {
      setFormError('');
      setSuccessMsg('');
      const today = new Date();
      // Set tomorrow as default start date
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const isoTomorrow = tomorrow.toISOString().split('T')[0];
      setStartDate(isoTomorrow);
      setEndDate(isoTomorrow);
      setReason('');
    }
  }, [isOpen]);

  const balances = getBalancesForEmployee(currentUser?.employeeId);
  const selectedBalance = balances.find((b) => b.leaveTypeId === Number(leaveTypeId));
  const selectedLeaveType = leaveTypes.find((lt) => lt.id === Number(leaveTypeId));

  const calculatedDays = calculateWorkingDays(startDate, endDate);

  // Real-time validation checks
  const overlapCheck = startDate && endDate && currentUser
    ? checkOverlap(currentUser.employeeId, startDate, endDate)
    : { hasOverlap: false };

  const isInsufficient = selectedBalance && calculatedDays > selectedBalance.remaining;
  const isInvalidDateRange = startDate && endDate && new Date(startDate) > new Date(endDate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!startDate || !endDate) {
      setFormError('Please select both start and end dates.');
      return;
    }
    if (isInvalidDateRange) {
      setFormError('Start date cannot be after end date.');
      return;
    }
    if (calculatedDays <= 0) {
      setFormError('Requested duration must contain at least 1 working day (excluding weekends).');
      return;
    }
    if (overlapCheck.hasOverlap) {
      setFormError(
        `Dates overlap with existing ${overlapCheck.conflictingRequest.status.toLowerCase()} leave (${overlapCheck.conflictingRequest.startDate} to ${overlapCheck.conflictingRequest.endDate}).`
      );
      return;
    }
    if (isInsufficient) {
      setFormError(
        `Insufficient balance. You only have ${selectedBalance.remaining} day(s) remaining for ${selectedLeaveType?.name}.`
      );
      return;
    }
    if (!reason.trim()) {
      setFormError('Please provide a reason for your leave request.');
      return;
    }

    try {
      setSubmitting(true);
      await applyLeave({
        leaveTypeId,
        startDate,
        endDate,
        reason: reason.trim(),
      });
      setSuccessMsg('Leave application submitted successfully for review!');
      setTimeout(() => {
        setSubmitting(false);
        onClose();
      }, 1200);
    } catch (err) {
      setFormError(err.message || 'Failed to submit leave application.');
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Leave"
      subtitle="Submit a formal time-off request to HR and your reporting manager."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {formError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span className="font-medium">{formError}</span>
          </div>
        )}

        {/* Leave Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Leave Type
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {leaveTypes.map((type) => {
              const bal = balances.find((b) => b.leaveTypeId === type.id);
              const isSelected = Number(leaveTypeId) === type.id;
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => setLeaveTypeId(type.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <p className="text-xs font-semibold text-slate-900 truncate">{type.name}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    <span className="font-bold text-blue-600">{bal?.remaining ?? 0}</span> days left
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              End Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Calculation Summary Pill */}
        <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="h-4 w-4 text-slate-400" />
            <span>Calculated Working Days:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">
              {calculatedDays} {calculatedDays === 1 ? 'Working Day' : 'Working Days'}
            </span>
            <span className="text-[11px] text-slate-400">(excl. weekends)</span>
          </div>
        </div>

        {/* Balance Warning */}
        {isInsufficient && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Requested duration exceeds your available balance ({selectedBalance?.remaining} days).</span>
          </div>
        )}

        {/* Overlap Warning */}
        {overlapCheck.hasOverlap && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-800">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>Selected dates overlap with an existing {overlapCheck.conflictingRequest.status.toLowerCase()} request.</span>
          </div>
        )}

        {/* Reason Textarea */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Reason / Notes
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please detail the reason for your time-off request..."
            required
            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || isInsufficient || overlapCheck.hasOverlap || calculatedDays <= 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{submitting ? 'Submitting...' : 'Submit Request'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
