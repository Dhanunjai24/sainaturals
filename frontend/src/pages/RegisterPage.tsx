import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(name, email, phone, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
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
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Create Customer Account</h1>
        <p className="text-xs text-stone-500">Join Sri Sai Natural Foods for fresh deliveries & special coupons</p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white"
            />
            <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="ramesh@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white"
            />
            <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
          <div className="relative">
            <input
              type="tel"
              required
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white"
            />
            <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
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
          {isLoading ? <span>Registering...</span> : <span>Create Account</span>}
        </button>

        <p className="text-center text-xs text-stone-500 pt-2">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-700 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};
