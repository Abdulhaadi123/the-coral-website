'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquareQuote,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sparkles,
  Users,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Don't render admin sidebar/nav on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoggingOut(false);
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Portfolio Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
    { label: 'Portfolio Leads', href: '/admin/leads', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col md:flex-row antialiased">
      {/* ── Mobile Top Bar ── */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Image
            src="/images/logo.png"
            alt="The Coral Room"
            width={120}
            height={40}
            style={{ width: 'auto', height: '28px' }}
            priority
            className="object-contain"
          />
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#78B249]/15 text-[#467923] border border-[#78B249]/30 uppercase tracking-wider">
            Admin
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Sidebar (Desktop & Mobile Drawer) ── */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen w-64 bg-white border-r border-gray-200/80 flex flex-col justify-between transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header with Real Logo */}
          <div className="p-6 border-b border-gray-100 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Link href="/admin" className="block">
                <Image
                  src="/images/logo.png"
                  alt="The Coral Room"
                  width={140}
                  height={44}
                  style={{ width: 'auto', height: '32px' }}
                  priority
                  className="object-contain"
                />
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-[#78B249] animate-pulse" />
              <span className="text-[10px] text-gray-500 font-bold tracking-wider uppercase">
                Content Management
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#111827] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#9FE66F]' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors border border-gray-200"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#78B249]" />
              View Live Website
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </Link>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? 'Logging out...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* ── Main Content Area ── */}
      <main className="flex-1 min-h-screen p-6 sm:p-10 max-w-[1600px] mx-auto w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
