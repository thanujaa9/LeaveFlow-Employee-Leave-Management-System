import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-card border border-slate-200">
        <span className="text-6xl font-extrabold text-blue-600 block mb-2">404</span>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Page Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">
          The requested page could not be located on the LeaveFlow enterprise system.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
        >
          <Home className="h-4 w-4" />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
}
