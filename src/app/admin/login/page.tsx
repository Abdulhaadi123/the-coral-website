'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-between items-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden select-none">
      
      {/* Subtle Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#78B249]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#00C0E8]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Link */}
      <div className="w-full max-w-md flex justify-start z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live Website</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-100 relative z-10 my-auto">
        
        {/* Top Decorative Brand Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#78B249] via-[#9FE66F] to-[#00C0E8]" />

        {/* Official Coral Room Logo */}
        <div className="flex flex-col items-center text-center mb-8 pt-2">
          <Link href="/" className="mb-4 inline-block">
            <Image
              src="/images/logo.png"
              alt="The Coral Room"
              width={160}
              height={50}
              style={{ width: 'auto', height: '40px' }}
              priority
              className="object-contain"
            />
          </Link>
          <h1 className="text-xl font-bold text-[#111827] tracking-tight">Admin CMS Portal</h1>
          <p className="text-xs text-gray-500 mt-1">Sign in to manage portfolio case studies &amp; reviews</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@thecoralroom.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] focus:border-transparent transition-all placeholder:text-gray-400 bg-gray-50/50 focus:bg-white"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] focus:border-transparent transition-all placeholder:text-gray-400 bg-gray-50/50 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-4 px-6 rounded-full font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
          >
            <span>{loading ? 'Authenticating Securely...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#78B249]" />
          <span>Protected by Encrypted JWT &amp; Supabase Database</span>
        </div>

      </div>

      {/* Copyright Footer */}
      <div className="text-xs text-gray-500 text-center z-10">
        © {new Date().getFullYear()} The Coral Room. All rights reserved.
      </div>
    </div>
  );
}
