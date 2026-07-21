'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={twMerge(
        clsx('animate-pulse bg-neutral-800/60 rounded-xl border border-neutral-800/40', className)
      )}
    />
  );
};
