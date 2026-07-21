'use client';

import React, { useState } from 'react';
import { Bell, Search, Sun, Moon, User, LogOut, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = 'Dashboard', subtitle }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="h-16 px-6 border-b border-neutral-800/80 bg-neutral-950/60 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Global Search Button */}
        <button className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors hidden sm:flex items-center justify-center">
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Trigger */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl p-4 shadow-2xl border border-neutral-800 bg-neutral-900/95 z-50">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h3>
                <span className="text-[10px] bg-purple-950/80 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30">
                  2 New
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-neutral-800/40 border border-neutral-800">
                  <p className="font-semibold text-white">Daily Hydration Milestone</p>
                  <p className="text-neutral-400 text-[11px]">Reached 75% of your 3,000ml goal today.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-800/40 border border-neutral-800">
                  <p className="font-semibold text-white">Sleep Quality Logged</p>
                  <p className="text-neutral-400 text-[11px]">Recorded 7.8 hrs restful sleep.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-neutral-800/60 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
              AV
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl p-2 shadow-2xl border border-neutral-800 bg-neutral-900/95 z-50 text-xs">
              <div className="p-2.5 border-b border-neutral-800 mb-1">
                <p className="font-bold text-white">Alex Vance</p>
                <p className="text-neutral-400 text-[11px] truncate">alex.vance@personalos.dev</p>
              </div>
              <Link
                href="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-colors"
              >
                <User className="w-4 h-4 text-neutral-400" /> Account Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-neutral-400" /> Security & Tokens
              </Link>
              <div className="border-t border-neutral-800 my-1" />
              <Link
                href="/login"
                onClick={() => {
                  localStorage.removeItem('personalos_access_token');
                  setShowProfileMenu(false);
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/30 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
