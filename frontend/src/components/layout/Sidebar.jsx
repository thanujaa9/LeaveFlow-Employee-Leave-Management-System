import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarPlus,
  History,
  CalendarDays,
  Users,
  CheckSquare,
  LogOut,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLeave } from '../../context/LeaveContext';

export default function Sidebar({ onCloseMobile }) {
  const { currentUser, logout, isAdmin, loginAsDemo } = useAuth();
  const { requests } = useLeave();
  const navigate = useNavigate();

  const pendingApprovalsCount = requests.filter((r) => r.status === 'PENDING').length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;

  return (
    <aside className="w-64 bg-[#0B132B] text-slate-200 flex flex-col h-full border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight leading-none">LeaveFlow</h1>
            <p className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase mt-1">Enterprise HR</p>
          </div>
        </div>
      </div>

      {/* Role Switcher Pill (Quick Preview Helper) */}
      <div className="px-4 pt-4 pb-2">
        <div className="bg-slate-900/90 rounded-lg p-1.5 border border-slate-800 flex items-center text-xs">
          <button
            onClick={() => {
              loginAsDemo('EMPLOYEE');
              navigate('/dashboard');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`flex-1 py-1 px-2 rounded-md font-medium text-center transition-all ${
              !isAdmin ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Employee
          </button>
          <button
            onClick={() => {
              loginAsDemo('ADMIN');
              navigate('/admin');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`flex-1 py-1 px-2 rounded-md font-medium text-center transition-all flex items-center justify-center gap-1 ${
              isAdmin ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Admin</span>
            {pendingApprovalsCount > 0 && (
              <span className="h-4 min-w-4 px-1 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingApprovalsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-3 py-3 space-y-6 overflow-y-auto">
        {/* Main Section */}
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            {isAdmin ? 'Administration' : 'Self Service'}
          </p>
          <nav className="space-y-1">
            {!isAdmin ? (
              <>
                <NavLink to="/dashboard" className={navItemClass} onClick={onCloseMobile}>
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/apply" className={navItemClass} onClick={onCloseMobile}>
                  <CalendarPlus className="h-4 w-4" />
                  <span>Apply for Leave</span>
                </NavLink>
                <NavLink to="/history" className={navItemClass} onClick={onCloseMobile}>
                  <History className="h-4 w-4" />
                  <span>Leave History</span>
                </NavLink>
                <NavLink to="/calendar" className={navItemClass} onClick={onCloseMobile}>
                  <CalendarDays className="h-4 w-4" />
                  <span>Leave Calendar</span>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/admin" end className={navItemClass} onClick={onCloseMobile}>
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Admin Overview</span>
                </NavLink>
                <NavLink to="/admin/approvals" className={navItemClass} onClick={onCloseMobile}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <CheckSquare className="h-4 w-4" />
                      <span>Pending Approvals</span>
                    </div>
                    {pendingApprovalsCount > 0 && (
                      <span className="h-5 min-w-5 px-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center">
                        {pendingApprovalsCount}
                      </span>
                    )}
                  </div>
                </NavLink>
                <NavLink to="/calendar" className={navItemClass} onClick={onCloseMobile}>
                  <CalendarDays className="h-4 w-4" />
                  <span>Global Calendar</span>
                </NavLink>
                <NavLink to="/admin/employees" className={navItemClass} onClick={onCloseMobile}>
                  <Users className="h-4 w-4" />
                  <span>Employees & Balances</span>
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Quick Link to Other Role Section */}
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Switch View
          </p>
          <div className="space-y-1">
            {isAdmin ? (
              <NavLink to="/dashboard" className={navItemClass} onClick={onCloseMobile}>
                <UserCheck className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">My Employee Portal</span>
              </NavLink>
            ) : (
              <NavLink to="/admin" className={navItemClass} onClick={onCloseMobile}>
                <ShieldCheck className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">Admin Control Panel</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-3 p-2 rounded-lg">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser?.name}
            className="h-9 w-9 rounded-full object-cover border border-slate-700"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{currentUser?.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{currentUser?.designation || currentUser?.department}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
