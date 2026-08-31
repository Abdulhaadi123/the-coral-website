'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { User, Mail, Phone, Lock, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

interface PortfolioGateModalProps {
  onUnlock: () => void;
}

export const PortfolioGateModal: React.FC<PortfolioGateModalProps> = ({ onUnlock }) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if previously unlocked in this browser
    const unlocked = localStorage.getItem('coral_portfolio_unlocked');
    if (unlocked === 'true') {
      setIsUnlocked(true);
      onUnlock();
    } else {
      setIsUnlocked(false);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [onUnlock]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in your name, email, and phone number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          source: 'portfolio_gate',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit request');

      // Success
      setSuccess(true);
      localStorage.setItem('coral_portfolio_unlocked', 'true');
      
      setTimeout(() => {
        document.body.style.overflow = '';
        setIsUnlocked(true);
        onUnlock();
      }, 700);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // While checking localStorage, or if already unlocked, render nothing
  if (isUnlocked === null || isUnlocked === true) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Heavy Blur Backdrop */}
      <div className="fixed inset-0 bg-[#0A0E1A]/85 backdrop-blur-xl transition-opacity duration-500 animate-fadeIn" />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-7 sm:p-10 shadow-2xl border border-white/20 z-10 my-auto overflow-hidden animate-scaleIn">
        
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#78B249] via-[#9FE66F] to-[#00C0E8]" />

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-6 pt-2">
          {/* Logo */}
          <div className="mb-4">
            <Image
              src="/images/logo.png"
              alt="The Coral Room"
              width={140}
              height={44}
              style={{ width: 'auto', height: '34px' }}
              priority
              className="object-contain"
            />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#78B249]/15 text-[#305c14] border border-[#78B249]/30 text-[11px] font-bold uppercase tracking-wider mb-3">
            <Lock className="w-3 h-3 text-[#467923]" />
            <span>Private Showcase Access</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight leading-tight">
            Unlock Full Portfolio
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">
            Enter your contact details to gain instant access to all 32+ case studies, branding mockups, and client work.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] bg-gray-50/50 focus:bg-white transition-all placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Work / Personal Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@company.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] bg-gray-50/50 focus:bg-white transition-all placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Phone Number / WhatsApp *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000 / +92 300 1234567"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] bg-gray-50/50 focus:bg-white transition-all placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="mt-2 w-full py-4 px-6 rounded-full font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
          >
            {success ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Access Granted! Unlocking...</span>
              </>
            ) : loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Validating &amp; Unlocking...</span>
              </>
            ) : (
              <>
                <span>Unlock Showcase Now</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Badge */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#78B249]" />
          <span>Your information is strictly protected. Instant access.</span>
        </div>

      </div>
    </div>
  );
};
