import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield, User, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('rohan.sharma@leaveflow.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const user = loginAsDemo(role);
    if (user?.role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Icon & Heading */}
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Sparkles className="h-7 w-7" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-extrabold tracking-tight text-slate-900">
          LeaveFlow
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Modern Enterprise Leave Management & Attendance System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-card border border-slate-200/90 rounded-2xl sm:px-10">
          {/* Quick Demo Switcher Banner */}
          <div className="mb-6 p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-900 text-center mb-2">
              ⚡ Instant 1-Click Demo Logins
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('EMPLOYEE')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 shadow-sm transition-all"
              >
                <User className="h-3.5 w-3.5" />
                <span>Employee Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('ADMIN')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>HR Admin Demo</span>
              </button>
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-slate-400">or sign in with credentials</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-slate-600">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <span className="ml-2">Remember this device</span>
              </label>
              <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">Forgot password?</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to LeaveFlow'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Test Accounts Reference Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            <p className="font-semibold text-slate-500 mb-1">Pre-configured Demo Accounts:</p>
            <ul className="space-y-0.5">
              <li>• <span className="font-medium text-slate-600">rohan.sharma@leaveflow.com</span> (Employee: Rohan Sharma)</li>
              <li>• <span className="font-medium text-slate-600">priya.nair@leaveflow.com</span> (Admin: Priya Nair)</li>
              <li className="text-slate-400 italic">Password: password123</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
