'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Moon, Plus, Star, Clock } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { TelemetryChart } from '@/components/charts/TelemetryChart';
import { apiClient } from '@/lib/api';
import { SleepLog } from '@/types';

export default function SleepPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [quality, setQuality] = useState(4);
  const [notes, setNotes] = useState('');

  const { data: logs = [] } = useQuery<SleepLog[]>({
    queryKey: ['sleep'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/sleep');
        return res.data;
      } catch (err) {
        return [
          {
            id: 's1',
            user_id: 'u1',
            sleep_start: '2026-07-19T23:00:00Z',
            sleep_end: '2026-07-20T06:48:00Z',
            duration_minutes: 468,
            quality_rating: 4,
            notes: 'Restful 7.8 hours sleep cycle.',
            created_at: new Date().toISOString(),
          },
        ];
      }
    },
  });

  const createSleepMutation = useMutation({
    mutationFn: async () => {
      const now = new Date();
      const start = new Date(now.getTime() - 7.5 * 3600 * 1000);
      await apiClient.post('/sleep', {
        sleep_start: start.toISOString(),
        sleep_end: now.toISOString(),
        quality_rating: quality,
        notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep'] });
      setModalOpen(false);
    },
  });

  return (
    <MainLayout title="Sleep & Recovery Telemetry" subtitle="Monitor sleep duration, debt, and recovery quality">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Sleep Telemetry</h2>
          <p className="text-xs text-neutral-400">Nightly sleep logs & recovery stats</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Record Sleep Session
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase text-neutral-400">Average Duration</span>
          <div className="text-3xl font-extrabold text-white my-2">7.8 hrs</div>
          <span className="text-xs text-emerald-400 font-medium">+0.4h vs last week</span>
        </Card>
        <Card className="flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase text-neutral-400">Quality Index</span>
          <div className="text-3xl font-extrabold text-white my-2">4.2 / 5.0</div>
          <span className="text-xs text-purple-400 font-medium">Deep REM optimal</span>
        </Card>
        <Card className="flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase text-neutral-400">Sleep Debt</span>
          <div className="text-3xl font-extrabold text-white my-2">-15 mins</div>
          <span className="text-xs text-emerald-400 font-medium">Optimal balance</span>
        </Card>
      </div>

      <TelemetryChart
        title="7-Day Sleep Duration"
        subtitle="Hours of sleep per night"
        data={[7.2, 7.8, 6.9, 8.1, 7.5, 8.0, 7.8]}
        labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
        color="purple"
        unit="h"
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Record Sleep Log">
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-300">Sleep Quality Rating (1 to 5)</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuality(num)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border transition-all ${
                    quality === num
                      ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/40'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <Input label="Session Notes" placeholder="e.g. Slept deeply, no interruptions" value={notes} onChange={(e) => setNotes(e.target.value)} />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={createSleepMutation.isPending}
              onClick={() => createSleepMutation.mutate()}
            >
              Save Sleep Log
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
