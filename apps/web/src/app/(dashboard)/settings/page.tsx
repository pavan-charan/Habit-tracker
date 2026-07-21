'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { User, Sliders, Bell, Shield, Check } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { apiClient } from '@/lib/api';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [savedMessage, setSavedMessage] = useState(false);

  // Profile fields state
  const [fullName, setFullName] = useState('Alex Vance');
  const [bio, setBio] = useState('Staff Engineer & Life Systems Architect');
  const [timezone, setTimezone] = useState('UTC');
  const [unitSystem, setUnitSystem] = useState('metric');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'preferences', label: 'Preferences', icon: <Sliders className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Privacy', icon: <Shield className="w-4 h-4" /> },
  ];

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <MainLayout title="Settings Center" subtitle="Manage account profile, preferences, and security">
      <div className="flex items-center justify-between mb-2">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        {savedMessage && (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-fade-in">
            <Check className="w-3.5 h-3.5" /> Settings Saved
          </span>
        )}
      </div>

      {activeTab === 'profile' && (
        <Card className="max-w-2xl">
          <h3 className="text-base font-bold text-white mb-4">Account Profile</h3>
          <div className="space-y-4">
            <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input label="Email Address" value="alex.vance@personalos.dev" disabled className="opacity-60 cursor-not-allowed" />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-neutral-300">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="glass-input p-3 rounded-xl text-sm w-full"
              />
            </div>
            <div className="pt-2">
              <Button variant="primary" size="sm" onClick={handleSave}>
                Save Profile Changes
              </Button>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'preferences' && (
        <Card className="max-w-2xl">
          <h3 className="text-base font-bold text-white mb-4">System Preferences</h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-neutral-300">Timezone</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="glass-input px-3.5 py-2.5 rounded-xl text-sm">
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-neutral-300">Measurement Unit System</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setUnitSystem('metric')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    unitSystem === 'metric' ? 'bg-purple-600 text-white border-purple-500' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  Metric (ml, km, kg)
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem('imperial')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    unitSystem === 'imperial' ? 'bg-purple-600 text-white border-purple-500' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  Imperial (oz, mi, lbs)
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="primary" size="sm" onClick={handleSave}>
                Save Preferences
              </Button>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card className="max-w-2xl">
          <h3 className="text-base font-bold text-white mb-4">Notification Telemetry Toggles</h3>
          <div className="space-y-3">
            {[
              { title: 'Daily Telemetry Summary', desc: 'Receive daily status digest at 08:00 AM' },
              { title: 'Hydration Intake Reminders', desc: 'Notify when water intake falls below 50%' },
              { title: 'Habit Streak Alerts', desc: 'Alert before day ends if active habit is uncompleted' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[11px] text-neutral-400">{item.desc}</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-purple-600 rounded cursor-pointer" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card className="max-w-2xl">
          <h3 className="text-base font-bold text-white mb-4">Security & Authentication Tokens</h3>
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <span className="text-neutral-400 block mb-1">JWT Security Protocol</span>
              <p className="text-white font-mono text-[11px]">HS256 Standard with 60-minute Access Token Expiry</p>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <span className="text-neutral-400 block mb-1">Active Session Tokens</span>
              <p className="text-white font-mono text-[11px]">Token ID: e7b2f0a... (Valid)</p>
            </div>
          </div>
        </Card>
      )}
    </MainLayout>
  );
}
