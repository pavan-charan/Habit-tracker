'use client';

import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string;
  target?: string;
  percentage: number;
  status: string;
  icon: React.ReactNode;
  accentColor?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';
  onAction?: () => void;
  actionLabel?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  target,
  percentage,
  status,
  icon,
  accentColor = 'cyan',
  onAction,
  actionLabel,
}) => {
  const accentGradients = {
    cyan: 'from-cyan-500 to-blue-600',
    purple: 'from-purple-500 to-indigo-600',
    emerald: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
    rose: 'from-rose-500 to-pink-600',
  };

  const accentBorders = {
    cyan: 'border-cyan-500/20 text-cyan-400',
    purple: 'border-purple-500/20 text-purple-400',
    emerald: 'border-emerald-500/20 text-emerald-400',
    amber: 'border-amber-500/20 text-amber-400',
    rose: 'border-rose-500/20 text-rose-400',
  };

  return (
    <Card className="flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2.5 rounded-xl bg-neutral-900/80 border ${accentBorders[accentColor]}`}>
            {icon}
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-900/90 text-neutral-300 border border-neutral-800">
            {status}
          </span>
        </div>

        <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-1">{title}</h3>
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
          {target && <span className="text-xs text-neutral-500 font-medium">Goal: {target}</span>}
        </div>
      </div>

      <div>
        <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden mb-2 border border-neutral-800">
          <div
            className={`h-full bg-gradient-to-r ${accentGradients[accentColor]} transition-all duration-500 rounded-full`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-400">{percentage}% achieved</span>
          {onAction && actionLabel && (
            <button
              onClick={onAction}
              className="text-neutral-300 hover:text-white font-medium underline-offset-4 hover:underline transition-colors"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};
