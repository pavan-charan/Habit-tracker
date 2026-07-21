'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Moon,
  Droplets,
  Target,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Journal', href: '/journal', icon: BookOpen },
  { name: 'Habits', href: '/habits', icon: CheckSquare },
  { name: 'Sleep', href: '/sleep', icon: Moon },
  { name: 'Water', href: '/water', icon: Droplets },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen sticky top-0 bg-neutral-950/90 border-r border-neutral-800/80 backdrop-blur-xl flex flex-col justify-between z-30 shrink-0 select-none"
    >
      <div>
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-neutral-800/60">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-purple-900/30 shrink-0">
              P
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white leading-none">
                  Personal<span className="text-purple-400">OS</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mt-1">
                  v1.0 Phase 1
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors hidden sm:flex"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Search trigger */}
        {!collapsed && (
          <div className="px-4 pt-4">
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200 text-xs transition-all">
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5" />
                Quick Search...
              </span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-neutral-800 rounded border border-neutral-700 text-neutral-400 font-mono">
                ⌘K
              </kbd>
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavHighlight"
                    className="absolute inset-0 bg-neutral-800/90 rounded-xl border border-neutral-700/60 shadow-sm"
                    transition={{ type: 'spring', duration: 0.3 }}
                  />
                )}
                <Icon
                  className={`w-5 h-5 shrink-0 z-10 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-purple-400' : 'text-neutral-400'
                  }`}
                />
                {!collapsed && <span className="z-10 truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-neutral-800/60">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-200">
              AV
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-neutral-950" />
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-white truncate">Alex Vance</span>
              <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-purple-400 inline" /> Telemetry Online
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
