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
    <main className="min-h-screen w-full bg-[#0A0E1A] flex flex-col items-center justify-center p-4 sm:p-6 py-10 relative overflow-x-hidden">
      
      {/* Ambient Luxury Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-96 h-96 bg-[#78B249]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-96 h-96 bg-[#00C0E8]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Form Wrapper */}
      <div className="w-full max-w-md flex flex-col items-center z-10 my-auto">
        
        {/* Top Back Link */}
        <div className="w-full mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Live Website</span>
          </Link>
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">
            Coral Admin
          </span>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white rounded-3xl p-7 sm:p-9 shadow-2xl border border-white/20 relative overflow-hidden">
          
          {/* Top Brand Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#78B249] via-[#9FE66F] to-[#00C0E8]" />

          {/* Logo & Headline */}
          <div className="flex flex-col items-center text-center mb-7 pt-2">
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/images/logo.png"
                alt="The Coral Room"
                width={150}
                height={45}
                style={{ width: 'auto', height: '34px' }}
                priority
                className="object-contain"
              />
            </Link>
            <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight">Admin Portal</h1>
            <p className="text-xs text-gray-500 mt-1">Sign in to manage portfolio case studies &amp; reviews</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@thecoralroom.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] focus:bg-white bg-gray-50/50 transition-all placeholder:text-gray-400 font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] focus:bg-white bg-gray-50/50 transition-all placeholder:text-gray-400 font-medium"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword((prev) => !prev);
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors z-20 cursor-pointer flex items-center justify-center"
                >
                  {showPassword ? (
                    <Eye className="w-4 h-4 text-[#467923] pointer-events-none" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400 pointer-events-none" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 px-6 rounded-full font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
            >
              <span>{loading ? 'Authenticating Securely...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Security Footer Note */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-medium text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-[#78B249]" />
            <span>Protected by Encrypted JWT &amp; Supabase Database</span>
          </div>

        </div>

        {/* Copyright Footer */}
        <div className="mt-6 text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} The Coral Room. All rights reserved.
        </div>

      </div>
    </main>
  );
}
