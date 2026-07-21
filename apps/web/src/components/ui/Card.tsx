'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glow = false,
  hoverEffect = true,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hoverEffect ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={twMerge(
        clsx(
          'glass-panel rounded-2xl p-5 relative overflow-hidden transition-all duration-300',
          glow && 'border-purple-500/30 shadow-[0_0_25px_-5px_rgba(139,92,246,0.2)]',
          hoverEffect && 'hover:border-neutral-700/80 hover:bg-neutral-900/70',
          className
        )
      )}
      {...props}
    >
      {glow && (
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      )}
      {children}
    </motion.div>
  );
};
