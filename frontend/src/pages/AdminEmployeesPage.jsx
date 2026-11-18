import React, { useState, useMemo } from 'react';
import { Search, Users, Mail, Phone, Calendar, Filter, Sparkles, Eye } from 'lucide-react';
import { useLeave } from '../context/LeaveContext';
import { formatDate } from '../utils/dateUtils';
import LeaveTypeBadge from '../components/common/LeaveTypeBadge';
import Modal from '../components/common/Modal';

export default function AdminEmployeesPage() {
  const { employees, getBalancesForEmployee, requests } = useLeave();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [inspectingEmployee, setInspectingEmployee] = useState(null);

  const departments = ['ALL', 'Engineering', 'Product Design', 'Marketing', 'People & Culture'];

  const filteredEmployees = useMemo(() => {
    let list = employees;
    if (departmentFilter !== 'ALL') {
      list = list.filter((e) => e.department === departmentFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.employeeId.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.designation.toLowerCase().includes(q)
      );
    }
    return list;
  }, [employees, departmentFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Workforce Directory & Leave Balances
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor organizational leave allocations, usage metrics, and employee profiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-sm">
            Active Staff: {filteredEmployees.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID, title, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'ALL' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Department & Role</th>
                <th className="py-3.5 px-4">Casual Leave</th>
                <th className="py-3.5 px-4">Sick Leave</th>
                <th className="py-3.5 px-4">Earned Leave</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEmployees.map((emp) => {
                const bals = getBalancesForEmployee(emp.employeeId);
                const cl = bals.find((b) => b.leaveTypeId === 1);
                const sl = bals.find((b) => b.leaveTypeId === 2);
                const el = bals.find((b) => b.leaveTypeId === 3);

                return (
                  <tr key={emp.employeeId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="h-9 w-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{emp.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{emp.employeeId}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{emp.designation}</p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {emp.department}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs">
                        <span className="font-bold text-blue-600">{cl?.remaining ?? 0}</span>
                        <span className="text-slate-400"> / {cl?.total ?? 12}d</span>
                        <p className="text-[10px] text-slate-400">Used: {cl?.used ?? 0}d</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs">
                        <span className="font-bold text-amber-600">{sl?.remaining ?? 0}</span>
                        <span className="text-slate-400"> / {sl?.total ?? 10}d</span>
                        <p className="text-[10px] text-slate-400">Used: {sl?.used ?? 0}d</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs">
                        <span className="font-bold text-emerald-600">{el?.remaining ?? 0}</span>
                        <span className="text-slate-400"> / {el?.total ?? 15}d</span>
                        <p className="text-[10px] text-slate-400">Used: {el?.used ?? 0}d</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(emp.joiningDate)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setInspectingEmployee(emp)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Detail Modal */}
      {inspectingEmployee && (
        <Modal
          isOpen={!!inspectingEmployee}
          onClose={() => setInspectingEmployee(null)}
          title="Employee Profile & Time-Off Overview"
          subtitle={`Employee Code: ${inspectingEmployee.employeeId}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={inspectingEmployee.avatar}
                alt={inspectingEmployee.name}
                className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900">{inspectingEmployee.name}</h4>
                <p className="text-xs text-slate-500">{inspectingEmployee.designation} · {inspectingEmployee.department}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    {inspectingEmployee.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    {inspectingEmployee.phone}
                  </span>
                </div>
              </div>
            </div>

            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Leave Balance Status</h5>
            <div className="grid grid-cols-2 gap-2">
              {getBalancesForEmployee(inspectingEmployee.employeeId).map((bal) => (
                <div key={bal.leaveTypeId} className="p-3 bg-white border border-slate-200 rounded-xl">
                  <p className="text-xs font-semibold text-slate-800">{bal.leaveTypeName}</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {bal.remaining} <span className="text-xs font-normal text-slate-400">days left</span>
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Used: {bal.used}d · Total: {bal.total}d
                  </p>
                </div>
              ))}
            </div>

            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider pt-2">Recent Leave History</h5>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {requests
                .filter((r) => r.employeeId === inspectingEmployee.employeeId)
                .map((r) => (
                  <div key={r.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800">{r.leaveTypeName}</span>
                      <span className="text-slate-400"> · {r.daysCount}d</span>
                      <p className="text-[11px] text-slate-500">{r.startDate} to {r.endDate}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                      {r.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
