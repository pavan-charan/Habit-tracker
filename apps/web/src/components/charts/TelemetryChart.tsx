'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TelemetryChartProps {
  title: string;
  subtitle?: string;
  data: number[];
  labels: string[];
  color?: 'cyan' | 'purple' | 'emerald';
  unit?: string;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({
  title,
  subtitle,
  data,
  labels,
  color = 'cyan',
  unit = '',
}) => {
  const maxValue = Math.max(...data, 1);
  const chartHeight = 140;

  const colorMap = {
    cyan: {
      bar: 'from-cyan-500 to-blue-600',
      glow: 'rgba(6, 182, 212, 0.3)',
      text: 'text-cyan-400',
    },
    purple: {
      bar: 'from-purple-500 to-indigo-600',
      glow: 'rgba(139, 92, 246, 0.3)',
      text: 'text-purple-400',
    },
    emerald: {
      bar: 'from-emerald-500 to-teal-600',
      glow: 'rgba(16, 185, 129, 0.3)',
      text: 'text-emerald-400',
    },
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-neutral-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 ${colorMap[color].text}`}>
          7-Day Trend
        </span>
      </div>

      {/* Bar Chart Visualizer */}
      <div className="flex items-end justify-between gap-3 h-[140px] px-2 pt-4">
        {data.map((val, idx) => {
          const heightPercent = Math.min((val / maxValue) * 100, 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="text-[10px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                {val}{unit}
              </div>
              <div className="w-full bg-neutral-900/80 rounded-lg h-full max-h-[100px] flex items-end p-0.5 overflow-hidden border border-neutral-800/60">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className={`w-full rounded-md bg-gradient-to-t ${colorMap[color].bar} group-hover:brightness-125 transition-all`}
                />
              </div>
              <span className="text-[11px] font-semibold text-neutral-400">{labels[idx]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
