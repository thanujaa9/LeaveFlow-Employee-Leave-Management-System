import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  colorScheme = 'blue',
  progress,
}) {
  const colorMap = {
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      bar: 'bg-blue-600',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      bar: 'bg-emerald-600',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      bar: 'bg-amber-500',
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      bar: 'bg-purple-600',
    },
    slate: {
      iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
      bar: 'bg-slate-600',
    },
  };

  const scheme = colorMap[colorScheme] || colorMap.blue;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
            {subtitle && <span className="text-xs text-slate-400 font-medium">{subtitle}</span>}
          </div>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg border ${scheme.iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {progress !== undefined && (
        <div className="mt-4">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${scheme.bar}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span className="font-semibold text-emerald-600">{trend}</span>
          <span className="text-slate-400">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
