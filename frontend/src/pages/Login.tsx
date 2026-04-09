import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import type { ApiResponse, User } from '../types';

interface LoginResponseData {
  user: User;
  token: string;
}

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post<ApiResponse<LoginResponseData>>('/api/auth/login', {
        email,
        password,
      });
      const data = res.data;
      if (data.success && data.data) {
        login(data.data.user, data.data.token);
        navigate('/dashboard/shop', { replace: true });
      } else {
        setError(data.error?.message ?? 'Login failed.');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = (err.response?.data as ApiResponse<never>)?.error?.message;
        setError(msg ?? 'An unexpected error occurred.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex items-center mb-8">
          <span className="text-2xl font-extrabold text-gray-900">WE</span>
          <span className="ml-1 bg-green-600 text-white text-2xl font-extrabold px-2 py-0.5 rounded-md">
            BUY
          </span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-green-600 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
