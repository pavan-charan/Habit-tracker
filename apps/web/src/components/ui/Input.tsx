'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-xs font-medium text-neutral-300">{label}</label>}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <span className="absolute left-3 text-neutral-400 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={twMerge(
              clsx(
                'w-full glass-input px-3.5 py-2.5 rounded-xl text-sm placeholder:text-neutral-500 transition-all duration-200',
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                error && 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20',
                className
              )
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-neutral-400 pointer-events-none flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <span className="text-xs font-medium text-rose-400">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
