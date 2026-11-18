import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, AlertCircle, Clock, Send, CheckCircle2, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useLeave } from '../context/LeaveContext';
import { useAuth } from '../context/AuthContext';
import { calculateWorkingDays } from '../utils/dateUtils';
import LeaveTypeBadge from '../components/common/LeaveTypeBadge';

export default function ApplyLeavePage() {
  const { currentUser } = useAuth();
  const { leaveTypes, getBalancesForEmployee, applyLeave, checkOverlap } = useLeave();
  const navigate = useNavigate();

  const [leaveTypeId, setLeaveTypeId] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const isoTomorrow = tomorrow.toISOString().split('T')[0];
    setStartDate(isoTomorrow);
    setEndDate(isoTomorrow);
  }, []);

  const balances = getBalancesForEmployee(currentUser?.employeeId);
  const selectedBalance = balances.find((b) => b.leaveTypeId === Number(leaveTypeId));
  const selectedLeaveType = leaveTypes.find((lt) => lt.id === Number(leaveTypeId));

  const calculatedDays = calculateWorkingDays(startDate, endDate);

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
      setSuccessMsg('Leave request submitted successfully! Redirecting to Leave History...');
      setTimeout(() => {
        navigate('/history');
      }, 1500);
    } catch (err) {
      setFormError(err.message || 'Failed to submit leave application.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Apply for Leave</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit your time-off request with automatic balance deduction and conflict detection.
          </p>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: The Application Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span className="font-semibold">{successMsg}</span>
              </div>
            )}

            {formError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-800">
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                <span className="font-semibold">{formError}</span>
              </div>
            )}

            {/* Leave Type Select Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                1. Select Leave Category
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {leaveTypes.map((type) => {
                  const bal = balances.find((b) => b.leaveTypeId === type.id);
                  const isSelected = Number(leaveTypeId) === type.id;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setLeaveTypeId(type.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{type.name}</span>
                        <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          {bal?.remaining ?? 0}d left
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{type.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dates Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                2. Select Date Duration
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Working Days Metric */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-slate-600 font-medium">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Calculated Working Days:</span>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-slate-900">
                  {calculatedDays} {calculatedDays === 1 ? 'Day' : 'Days'}
                </span>
                <span className="text-[11px] text-slate-400 block">(excluding Sat & Sun)</span>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                3. Reason / Notes
              </label>
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain the purpose of your leave request for your manager's review..."
                required
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 resize-none"
              />
            </div>

            {/* Submit Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || isInsufficient || overlapCheck.hasOverlap || calculatedDays <= 0}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="h-4 w-4" />
                <span>{submitting ? 'Submitting Application...' : 'Submit Application'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Balance Card & Policy Guidelines */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Your Leave Balances
            </h3>
            <div className="space-y-3">
              {balances.map((b) => (
                <div key={b.leaveTypeId} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                    <span>{b.leaveTypeName}</span>
                    <span className="text-blue-600 font-bold">{b.remaining} days left</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Used: {b.used}d</span>
                    <span>Total: {b.total}d</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50/70 rounded-2xl border border-blue-200/70 p-5">
            <div className="flex items-center gap-2 text-blue-900 text-xs font-bold mb-2">
              <ShieldAlert className="h-4 w-4 text-blue-600" />
              <span>Company Leave Policy</span>
            </div>
            <ul className="text-xs text-blue-800 space-y-1.5 list-disc pl-4">
              <li>Submit requests at least 48 hours in advance when possible.</li>
              <li>Sick leaves extending over 3 consecutive days may require a medical certificate.</li>
              <li>Weekend days are automatically excluded from leave deductions.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
