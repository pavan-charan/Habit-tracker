'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Droplets,
  Moon,
  CheckCircle2,
  Target,
  Sparkles,
  Plus,
  Flame,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { HydrationRing } from '@/components/ui/HydrationRing';
import { TelemetryChart } from '@/components/charts/TelemetryChart';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { apiClient } from '@/lib/api';
import { DashboardData } from '@/types';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [waterModalOpen, setWaterModalOpen] = useState(false);
  const [customWaterAmount, setCustomWaterAmount] = useState(250);

  // Fetch telemetry dashboard data
  const { data, isLoading, isError, refetch } = useQuery<DashboardData>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/stats/dashboard');
        return res.data;
      } catch (err) {
        // Return fallback mockup data if backend is offline
        return {
          water: {
            title: "Today's Hydration",
            value: '2,250 ml',
            target: '3,000 ml',
            percentage: 75.0,
            status: 'Optimal',
            unit: 'ml',
          },
          sleep: {
            title: 'Sleep & Recovery',
            value: '7.8 hrs',
            target: '8.0 hrs',
            percentage: 97.5,
            status: 'Restful',
            unit: 'hours',
          },
          habits: {
            title: 'Habit Streak',
            value: '5/6 Done',
            target: '6 Habits',
            percentage: 83.3,
            status: '14d Streak',
            unit: 'habits',
          },
          goals: {
            title: 'Q3 Objectives',
            value: '4 Active',
            target: '100% Target',
            percentage: 68.0,
            status: 'On Track',
            unit: 'goals',
          },
          recent_mood: 'Energized & Focused',
          weekly_water_series: [2100, 2400, 2800, 3000, 2200, 2900, 2250],
          weekly_sleep_series: [7.2, 7.8, 6.9, 8.1, 7.5, 8.0, 7.8],
        };
      }
    },
  });

  // Log water mutation
  const logWaterMutation = useMutation({
    mutationFn: async (amount: number) => {
      await apiClient.post('/water', { amount_ml: amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setWaterModalOpen(false);
    },
  });

  const handleQuickWater = (amount: number) => {
    logWaterMutation.mutate(amount);
  };

  return (
    <MainLayout title="Life Telemetry Overview" subtitle="Real-time personal operating system metrics">
      {/* Telemetry Header Greeting */}
      <Card glow className="bg-gradient-to-r from-neutral-900/90 via-purple-950/20 to-neutral-900/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Phase 1 Telemetry Active
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Good Evening, Alex Vance 👋
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl">
              Your overall daily life performance is running at <span className="text-emerald-400 font-bold">88% optimal efficiency</span>. Hydration, sleep, and habit consistency are on target.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="glass" size="sm" onClick={() => setWaterModalOpen(true)} leftIcon={<Droplets className="w-4 h-4 text-cyan-400" />}>
              Log Water
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Quick Action
            </Button>
          </div>
        </div>
      </Card>

      {/* Telemetry Stat Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title={data?.water.title || 'Hydration'}
            value={data?.water.value || '2,250 ml'}
            target={data?.water.target}
            percentage={data?.water.percentage || 75}
            status={data?.water.status || 'Optimal'}
            icon={<Droplets className="w-5 h-5 text-cyan-400" />}
            accentColor="cyan"
            actionLabel="Add +250ml"
            onAction={() => handleQuickWater(250)}
          />

          <StatCard
            title={data?.sleep.title || 'Sleep'}
            value={data?.sleep.value || '7.8 hrs'}
            target={data?.sleep.target}
            percentage={data?.sleep.percentage || 97}
            status={data?.sleep.status || 'Restful'}
            icon={<Moon className="w-5 h-5 text-purple-400" />}
            accentColor="purple"
          />

          <StatCard
            title={data?.habits.title || 'Habit Streak'}
            value={data?.habits.value || '5/6 Done'}
            target={data?.habits.target}
            percentage={data?.habits.percentage || 83}
            status={data?.habits.status || '14d Streak'}
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            accentColor="emerald"
          />

          <StatCard
            title={data?.goals.title || 'Q3 Objectives'}
            value={data?.goals.value || '4 Active'}
            target={data?.goals.target}
            percentage={data?.goals.percentage || 68}
            status={data?.goals.status || 'On Track'}
            icon={<Target className="w-5 h-5 text-amber-400" />}
            accentColor="amber"
          />
        </div>
      )}

      {/* Main Telemetry Visualizers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hydration Focus Ring & Quick Log */}
        <Card className="lg:col-span-1 flex flex-col items-center justify-between text-center">
          <div className="w-full text-left mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" /> Hydration Telemetry
            </h3>
            <p className="text-xs text-neutral-400">Daily target: 3,000 ml</p>
          </div>

          <div className="my-4">
            <HydrationRing currentMl={2250} targetMl={3000} />
          </div>

          <div className="w-full space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <Button variant="glass" size="sm" onClick={() => handleQuickWater(250)}>
                +250 ml
              </Button>
              <Button variant="glass" size="sm" onClick={() => handleQuickWater(500)}>
                +500 ml
              </Button>
              <Button variant="glass" size="sm" onClick={() => setWaterModalOpen(true)}>
                Custom
              </Button>
            </div>
          </div>
        </Card>

        {/* 7-Day Hydration & Sleep Charts */}
        <div className="lg:col-span-2 space-y-6">
          <TelemetryChart
            title="Weekly Hydration Intake"
            subtitle="Daily volume in milliliters (ml)"
            data={data?.weekly_water_series || [2100, 2400, 2800, 3000, 2200, 2900, 2250]}
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
            color="cyan"
            unit="ml"
          />

          <TelemetryChart
            title="Sleep Duration Trend"
            subtitle="Nightly sleep hours recorded"
            data={data?.weekly_sleep_series || [7.2, 7.8, 6.9, 8.1, 7.5, 8.0, 7.8]}
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
            color="purple"
            unit="h"
          />
        </div>
      </div>

      {/* Recent Reflections & Habit Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-rose-400" /> Latest Journal Reflection
            </h3>
            <span className="text-xs text-rose-400 bg-rose-950/40 border border-rose-500/20 px-2.5 py-0.5 rounded-full font-semibold">
              Mood: {data?.recent_mood || 'Focused'}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
            <h4 className="text-sm font-bold text-white leading-snug">
              Architecture milestone achieved for PersonalOS Phase 1
            </h4>
            <p className="text-xs text-neutral-400 line-clamp-3">
              Successfully designed and constructed the modular monorepo foundation. FastAPI backend, SQLAlchemy 2 async models, Next.js 15 dark-first glassmorphism components, and Docker environment operating seamlessly.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700 font-mono">
                #architecture
              </span>
              <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700 font-mono">
                #personalos
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" /> Active Goal Milestone Progress
            </h3>
            <span className="text-xs text-neutral-400">Q3 Roadmap</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-white">Build PersonalOS Monorepo</span>
                <span className="text-emerald-400">100%</span>
              </div>
              <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-neutral-800">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-white">Complete Phase 1 Full Stack Verification</span>
                <span className="text-amber-400">85%</span>
              </div>
              <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-neutral-800">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 w-[85%]" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Log Water Custom Modal */}
      <Modal isOpen={waterModalOpen} onClose={() => setWaterModalOpen(false)} title="Log Hydration Intake">
        <div className="space-y-4">
          <Input
            label="Water Amount (ml)"
            type="number"
            value={customWaterAmount}
            onChange={(e) => setCustomWaterAmount(Number(e.target.value))}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setWaterModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={logWaterMutation.isPending}
              onClick={() => handleQuickWater(customWaterAmount)}
            >
              Confirm Entry
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
