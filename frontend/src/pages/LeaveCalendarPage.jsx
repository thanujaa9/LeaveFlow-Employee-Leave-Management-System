import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Users,
  Clock,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { useLeave } from '../context/LeaveContext';
import { formatDate, formatDateRange } from '../utils/dateUtils';
import LeaveTypeBadge from '../components/common/LeaveTypeBadge';
import Modal from '../components/common/Modal';

export default function LeaveCalendarPage() {
  const { requests, leaveTypes } = useLeave();

  // Active viewing date: default to November 2026 (or current)
  const [currentDate, setCurrentDate] = useState(new Date('2026-11-01'));
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date('2026-11-01'));
  };

  // Build grid days
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  // Approved leaves filtered by category
  const approvedLeaves = requests.filter((r) => {
    if (r.status !== 'APPROVED') return false;
    if (selectedCategory !== 'ALL' && r.leaveTypeName !== selectedCategory) return false;
    return true;
  });

  // Helper to find leaves that cover a given ISO date (YYYY-MM-DD)
  const getLeavesForDate = (dateStr) => {
    return approvedLeaves.filter((r) => dateStr >= r.startDate && dateStr <= r.endDate);
  };

  const daysArray = [];
  // Prefix blanks from previous month
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    daysArray.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      dateStr: null,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const dateStr = `${year}-${mm}-${dd}`;
    daysArray.push({
      day,
      isCurrentMonth: true,
      dateStr,
      leaves: getLeavesForDate(dateStr),
    });
  }

  // Suffix blanks for next month to complete the row
  const remainingCells = 42 - daysArray.length;
  for (let i = 1; i <= (remainingCells % 7); i++) {
    daysArray.push({
      day: i,
      isCurrentMonth: false,
      dateStr: null,
    });
  }

  const todayStr = '2026-11-18'; // Matches local time or new Date()

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Team Leave Calendar</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualize scheduled time-offs and avoid team delivery bottlenecks.
          </p>
        </div>

        {/* Month Navigator & Today Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200/90 rounded-xl shadow-sm p-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-900 min-w-32 text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleToday}
            className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 rounded-xl shadow-sm transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Category Filter Pills & Legend */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Leaves
          </button>
          {leaveTypes.map((type) => {
            const isSelected = selectedCategory === type.name;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedCategory(type.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type.name}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span>Casual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Sick</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Earned</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 text-center bg-slate-50/80 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
          {daysArray.map((cell, idx) => {
            if (!cell.isCurrentMonth) {
              return (
                <div key={idx} className="min-h-24 sm:min-h-28 p-2 bg-slate-50/40 text-slate-300 text-xs">
                  <span>{cell.day}</span>
                </div>
              );
            }

            const isToday = cell.dateStr === todayStr;
            const hasLeaves = cell.leaves && cell.leaves.length > 0;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (hasLeaves) {
                    setSelectedDayEvents({
                      dateStr: cell.dateStr,
                      leaves: cell.leaves,
                    });
                  }
                }}
                className={`min-h-24 sm:min-h-28 p-2 text-xs flex flex-col justify-between transition-colors ${
                  hasLeaves ? 'cursor-pointer hover:bg-blue-50/30' : 'hover:bg-slate-50/50'
                } ${isToday ? 'bg-blue-50/20' : ''}`}
              >
                {/* Date Number Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`h-6 w-6 rounded-full flex items-center justify-center font-semibold text-xs ${
                      isToday
                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                        : 'text-slate-700'
                    }`}
                  >
                    {cell.day}
                  </span>

                  {hasLeaves && (
                    <span className="text-[10px] font-bold text-blue-600">
                      {cell.leaves.length} away
                    </span>
                  )}
                </div>

                {/* Event Tags */}
                <div className="mt-1 space-y-1">
                  {cell.leaves?.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium truncate flex items-center gap-1 shadow-2xs border bg-blue-50 border-blue-200/80 text-blue-800"
                    >
                      <img
                        src={item.employeeAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                        alt=""
                        className="h-3 w-3 rounded-full object-cover shrink-0"
                      />
                      <span className="truncate font-semibold">{item.employeeName.split(' ')[0]}</span>
                    </div>
                  ))}
                  {cell.leaves && cell.leaves.length > 2 && (
                    <p className="text-[9px] text-slate-400 font-semibold pl-1">
                      +{cell.leaves.length - 2} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Inspection Modal */}
      {selectedDayEvents && (
        <Modal
          isOpen={!!selectedDayEvents}
          onClose={() => setSelectedDayEvents(null)}
          title={`Team Absence on ${formatDate(selectedDayEvents.dateStr)}`}
          subtitle={`${selectedDayEvents.leaves.length} employee(s) approved on leave`}
          maxWidth="max-w-md"
        >
          <div className="space-y-3">
            {selectedDayEvents.leaves.map((item) => (
              <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.employeeAvatar}
                      alt={item.employeeName}
                      className="h-9 w-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.employeeName}</p>
                      <p className="text-[11px] text-slate-500">{item.department} · {item.employeeId}</p>
                    </div>
                  </div>
                  <LeaveTypeBadge typeName={item.leaveTypeName} />
                </div>
                <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-800">Date Range: </span>
                  {formatDateRange(item.startDate, item.endDate)} ({item.daysCount} days)
                  <p className="mt-1 italic text-slate-500">"{item.reason}"</p>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
