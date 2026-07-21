'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HydrationRingProps {
  currentMl: number;
  targetMl: number;
  size?: number;
  strokeWidth?: number;
}

export const HydrationRing: React.FC<HydrationRingProps> = ({
  currentMl,
  targetMl,
  size = 180,
  strokeWidth = 14,
}) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((currentMl / targetMl) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Glowing Progress Arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#cyanGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold tracking-tight text-white">{currentMl}</span>
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">/ {targetMl} ml</span>
      </div>
    </div>
  );
};
