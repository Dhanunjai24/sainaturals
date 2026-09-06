import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate(redirect);
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsLoading(true);
    try {
      await login(demoEmail, demoPass);
      navigate(demoEmail.includes('admin') ? '/admin' : redirect);
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-brand-100 text-brand-800 rounded-2xl flex items-center justify-center mx-auto text-2xl">
          🌿
        </div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Sign In to Your Account</h1>
        <p className="text-xs text-stone-500">Access your orders, saved addresses, and natural groceries</p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Quick Demo Credentials */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2.5">
        <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Quick 1-Click Demo Login</span>
        </p>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin('customer@sainaturals.com', 'Customer@123')}
            className="px-3 py-2.5 bg-white hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 shadow-sm transition-colors text-center"
          >
            👤 Customer Login
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('admin@sainaturals.com', 'Admin@123')}
            className="px-3 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors text-center"
          >
            🛡️ Admin Login
          </button>
        </div>
      </div>

      {/* Standard Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="customer@sainaturals.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white"
            />
            <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white"
            />
            <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span>Signing In...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-stone-500 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-700 hover:underline">
            Register for free
          </Link>
        </p>
      </form>
    </div>
  );
};
