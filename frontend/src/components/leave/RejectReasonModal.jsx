import React, { useState } from 'react';
import { AlertCircle, XCircle } from 'lucide-react';
import Modal from '../common/Modal';

export default function RejectReasonModal({ isOpen, onClose, request, onConfirmReject }) {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!request) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide a reason for declining this request.');
      return;
    }
    try {
      setLoading(true);
      await onConfirmReject(request.id, comment.trim());
      setLoading(false);
      setComment('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to reject request.');
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Decline Leave Request"
      subtitle={`Applicant: ${request.employeeName} (${request.leaveTypeName})`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-800">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Reason for Rejection / HR Feedback
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="e.g., Critical sprint release scheduled on these dates; team capacity limit reached..."
            required
            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-800 placeholder-slate-400 resize-none"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            This explanation will be permanently recorded in the leave history and visible to the applicant.
          </p>
        </div>

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
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm disabled:opacity-50 transition-colors"
          >
            <XCircle className="h-3.5 w-3.5" />
            <span>{loading ? 'Processing...' : 'Confirm Rejection'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
