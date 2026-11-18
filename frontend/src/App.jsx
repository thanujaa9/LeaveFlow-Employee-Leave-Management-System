import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LeaveProvider } from './context/LeaveContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ApplyLeavePage from './pages/ApplyLeavePage';
import LeaveHistoryPage from './pages/LeaveHistoryPage';
import LeaveCalendarPage from './pages/LeaveCalendarPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminEmployeesPage from './pages/AdminEmployeesPage';
import NotFound from './pages/NotFound';

function RootRedirect() {
  const { currentUser, isAdmin } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LeaveProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<AppLayout />}>
              <Route index element={<RootRedirect />} />
              <Route path="dashboard" element={<EmployeeDashboard />} />
              <Route path="apply" element={<ApplyLeavePage />} />
              <Route path="history" element={<LeaveHistoryPage />} />
              <Route path="calendar" element={<LeaveCalendarPage />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/approvals" element={<AdminDashboard />} />
              <Route path="admin/employees" element={<AdminEmployeesPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </LeaveProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
