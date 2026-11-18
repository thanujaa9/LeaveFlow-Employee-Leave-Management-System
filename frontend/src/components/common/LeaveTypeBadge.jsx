import React from 'react';

export default function LeaveTypeBadge({ typeName }) {
  const getStyle = () => {
    switch (typeName) {
      case 'Casual Leave':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'Sick Leave':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Earned Leave':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Paternity / Maternity':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStyle()}`}
    >
      {typeName}
    </span>
  );
}
