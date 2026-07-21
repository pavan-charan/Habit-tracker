'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface TabOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabOption[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-neutral-900/80 rounded-xl border border-neutral-800 backdrop-blur-md">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors duration-200 z-10 ${
              isActive ? 'text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-neutral-800 rounded-lg shadow-sm -z-10 border border-neutral-700/50"
                transition={{ type: 'spring', duration: 0.3 }}
              />
            )}
            {tab.icon && <span className="inline-flex">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
