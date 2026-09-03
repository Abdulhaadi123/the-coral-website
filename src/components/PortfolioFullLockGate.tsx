'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, Lock, ArrowRight, Loader2, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface PortfolioFullLockGateProps {
  onUnlock: () => void;
  totalProjects: number;
}

/** Entering this in all three fields unlocks the gate without submitting a lead. */
const BYPASS_VALUE = '111';

export const PortfolioFullLockGate: React.FC<PortfolioFullLockGateProps> = ({ onUnlock, totalProjects }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const em = email.trim();
    const ph = phone.trim();

    if (!n || !em || !ph) {
      setError('Please fill in your name, email, and phone number.');
      return;
    }

    // Internal shortcut: 111 in all three fields unlocks without creating a lead.
    // Client-side only, so treat it as a convenience for demos and QA rather than
    // a secret — anyone reading the bundle can find it.
    if (n === BYPASS_VALUE && em === BYPASS_VALUE && ph === BYPASS_VALUE) {
      setSuccess(true);
      localStorage.setItem('coral_portfolio_unlocked', 'true');
      setTimeout(onUnlock, 500);
      return;
    }

    // The form is noValidate (so the shortcut can reach this handler), so the
    // email format is checked here instead of by the browser.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: n,
          email: em,
          phone: ph,
          source: 'portfolio_gate',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit request');

      setSuccess(true);
      localStorage.setItem('coral_portfolio_unlocked', 'true');

      setTimeout(() => {
        onUnlock();
      }, 500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8 sm:my-14 relative z-20">
      <div className="bg-white rounded-3xl p-7 sm:p-12 shadow-xl border border-gray-200/80 relative overflow-hidden">
        
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#78B249] via-[#9FE66F] to-[#00C0E8]" />

        {/* Content Header */}
        <div className="text-center max-w-md mx-auto mb-8 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#78B249]/15 text-[#325f16] text-xs font-bold uppercase tracking-wider mb-4 border border-[#78B249]/30">
            <Lock className="w-3.5 h-3.5 text-[#467923]" />
            <span>Private Agency Showcase</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827] leading-tight">
            Get Portfolio Access
          </h2>
          
          <p className="text-xs sm:text-sm text-gray-500 mt-2.5 leading-relaxed">
            Share your details to view a curated selection of The Coral Room’s work across branding, websites, ecommerce, campaigns, and digital growth.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
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
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] focus:bg-white transition-all placeholder:text-gray-400 font-medium"
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
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] focus:bg-white transition-all placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Phone / WhatsApp Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000 / +92 300 1234567"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] focus:bg-white transition-all placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="mt-2 w-full py-4 px-6 rounded-full font-bold text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all duration-300 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
          >
            {success ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Access Granted! Opening Portfolio...</span>
              </>
            ) : loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Validating &amp; Opening...</span>
              </>
            ) : (
              <>
                <span>View Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-[#78B249]" />
          <span>Your details stay private and are only used to share access.</span>
        </div>

      </div>
    </div>
  );
};
