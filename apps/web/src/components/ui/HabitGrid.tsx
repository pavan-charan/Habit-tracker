'use client';

import React from 'react';
import { Check, Flame } from 'lucide-react';
import { Habit } from '@/types';

interface HabitGridProps {
  habits: Habit[];
  onToggle: (habitId: string) => void;
}

export const HabitGrid: React.FC<HabitGridProps> = ({ habits, onToggle }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="grid grid-cols-12 gap-2 text-xs font-semibold uppercase text-neutral-400 border-b border-neutral-800/60 pb-3 mb-3 px-3">
          <div className="col-span-5">Habit Title</div>
          <div className="col-span-2 text-center">Streak</div>
          <div className="col-span-5 grid grid-cols-7 text-center">
            {days.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="grid grid-cols-12 gap-2 items-center p-3 glass-panel rounded-xl hover:bg-neutral-800/40 transition-colors"
            >
              <div className="col-span-5 flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: habit.color || '#10b981' }}
                />
                <div>
                  <h4 className="text-sm font-semibold text-white leading-tight">{habit.title}</h4>
                  <span className="text-xs text-neutral-400 capitalize">{habit.frequency}</span>
                </div>
              </div>

              <div className="col-span-2 flex items-center justify-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/20 py-1 px-2.5 rounded-lg border border-amber-500/20">
                <Flame className="w-3.5 h-3.5" />
                <span>12d</span>
              </div>

              <div className="col-span-5 grid grid-cols-7 gap-1">
                {[...Array(7)].map((_, idx) => {
                  const isChecked = idx < 5; // mock visual state
                  return (
                    <button
                      key={idx}
                      onClick={() => onToggle(habit.id)}
                      className={`h-7 rounded-lg flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-emerald-600/80 text-white shadow-sm border border-emerald-500/40'
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-600 hover:border-neutral-700'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
