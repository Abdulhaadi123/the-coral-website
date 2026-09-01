'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, Lock, ArrowRight, Loader2, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface PortfolioInlineGateProps {
  onUnlock: () => void;
}

export const PortfolioInlineGate: React.FC<PortfolioInlineGateProps> = ({ onUnlock }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
    <div className="relative w-full my-8 sm:my-12 z-20">
      <div className="w-full max-w-3xl mx-auto bg-[#111827] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-gray-800 relative overflow-hidden">
        
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#78B249]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#00C0E8]/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#78B249] via-[#9FE66F] to-[#00C0E8]" />

        {/* Content Header */}
        <div className="text-center max-w-xl mx-auto mb-8 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#78B249]/20 text-[#A7F176] text-[11px] font-bold uppercase tracking-wider mb-3 border border-[#78B249]/30">
            <Lock className="w-3.5 h-3.5" />
            <span>Exclusive Agency Showcase</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Get Portfolio Access
          </h2>
          
          <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
            Share your details to view a curated selection of The Coral Room’s work across branding, websites, ecommerce, campaigns, and digital growth.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-900/30 border border-red-500/50 text-red-300 text-xs font-medium text-center relative z-10">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10 max-w-xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-700 bg-gray-900/80 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#78B249] focus:border-transparent placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@company.com"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-700 bg-gray-900/80 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#78B249] focus:border-transparent placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Phone / WhatsApp *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-700 bg-gray-900/80 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#78B249] focus:border-transparent placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="mt-2 w-full py-3.5 px-6 rounded-full font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
          >
            {success ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Showcase Unlocked! Revealing projects...</span>
              </>
            ) : loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Unlocking Full Showcase...</span>
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
        <div className="mt-6 pt-4 border-t border-gray-800/80 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-[#78B249]" />
          <span>Your details stay private and are only used to share access.</span>
        </div>

      </div>
    </div>
  );
};
