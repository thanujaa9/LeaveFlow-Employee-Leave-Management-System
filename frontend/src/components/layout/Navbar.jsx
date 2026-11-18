import React, { useState } from 'react';
import { Menu, Bell, Plus, Search, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLeave } from '../../context/LeaveContext';

export default function Navbar({ onOpenMobile, onOpenApplyModal }) {
  const { currentUser, isAdmin } = useAuth();
  const { requests } = useLeave();
  const [showNotifications, setShowNotifications] = useState(false);

  // Recent 3 notifications
  const recentActivities = requests.slice(0, 4);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile hamburger & search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leaves, teammates, policies..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Right: Quick Actions, Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick CTA to apply for leave */}
        <button
          onClick={onOpenApplyModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Apply Leave</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-modal border border-slate-200/90 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">Recent Notifications</span>
                <span className="text-[10px] text-blue-600 font-medium">All caught up</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {recentActivities.map((act) => (
                  <div key={act.id} className="p-3 hover:bg-slate-50 transition-colors flex gap-2.5 items-start">
                    {act.status === 'APPROVED' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    ) : act.status === 'PENDING' ? (
                      <Calendar className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="text-xs font-medium text-slate-800">
                        {act.employeeName} ({act.leaveTypeName})
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Status: <span className="font-medium">{act.status}</span> · {act.daysCount} day(s)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser?.name}
            className="h-8 w-8 rounded-full object-cover border border-slate-200"
          />
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">{currentUser?.name}</p>
            <p className="text-[10px] font-medium text-slate-400">
              {isAdmin ? 'System Admin' : currentUser?.department || 'Employee'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
