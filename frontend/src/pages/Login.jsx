import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // If user is already logged in, redirect
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      // Fire and forget navigation; AuthProvider will update context
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101726] flex flex-col items-center justify-center px-2">
      {/* Logo and heading */}
      <div className="mb-8 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <img src="/vite.svg" alt="GigCampus" className="h-8 w-8" />
          <span className="text-2xl font-bold text-cyan-400">GigCampus</span>
        </div>
        <div className="text-neutral-300 text-lg font-medium">Welcome back to your campus marketplace</div>
      </div>
      {/* Card */}
      <div className="bg-[#181f2e] rounded-2xl shadow-lg px-8 py-8 w-full max-w-md flex flex-col items-center">
        {/* Tabs */}
        <div className="flex w-full mb-6">
          <button
            className="flex-1 py-2 rounded-l-xl text-base font-semibold bg-cyan-400 text-black"
            disabled
          >
            Sign In
          </button>
          <button
            className="flex-1 py-2 rounded-r-xl text-base font-semibold bg-[#232b3d] text-neutral-400"
            onClick={() => navigate("/register")}
            type="button"
          >
            Sign Up
          </button>
        </div>
        {/* Welcome */}
        <div className="w-full text-center mb-4">
          <h2 className="text-2xl font-bold text-white mb-1">Welcome back!</h2>
          <p className="text-neutral-400 text-sm">Enter your credentials to access your account</p>
        </div>
        {/* Form */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Your university email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-[#232b3d] border border-[#232b3d] rounded-lg py-3 pl-10 pr-3 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M4 4h16v16H4V4zm0 0l8 8 8-8"/></svg>
            </span>
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-[#232b3d] border border-[#232b3d] rounded-lg py-3 pl-10 pr-3 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 17v-1m0-4a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 0v1m0 4v1"/></svg>
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-neutral-400">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-cyan-400" disabled />
              Remember me
            </label>
            <button type="button" className="text-cyan-400 hover:underline" tabIndex={-1}>
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-400 text-black font-bold py-3 rounded-lg hover:bg-cyan-300 transition-colors duration-200"
          >
            {loading ? 'Signing in...' : (
              <span className="flex items-center justify-center gap-2">
                Sign In
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </span>
            )}
          </button>
        </form>
        <div className="mt-4 text-center text-neutral-400 text-sm">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-cyan-400 underline hover:text-cyan-300"
            onClick={() => navigate("/register")}
          >
            Sign up for free
          </button>
        </div>
      </div>
      {/* Footer */}
      <div className="mt-8 text-neutral-600 text-xs text-center">
        Secure authentication &bull; University email verification &bull; Free to join
      </div>
      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
