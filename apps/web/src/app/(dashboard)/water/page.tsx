'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Droplets, Plus } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { HydrationRing } from '@/components/ui/HydrationRing';
import { TelemetryChart } from '@/components/charts/TelemetryChart';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { apiClient } from '@/lib/api';

export default function WaterPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState(250);

  const { data } = useQuery({
    queryKey: ['water-today'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/water/today');
        return res.data;
      } catch (err) {
        return {
          total_ml: 2250,
          target_ml: 3000,
          percentage: 75.0,
          log_count: 5,
        };
      }
    },
  });

  const logWaterMutation = useMutation({
    mutationFn: async (val: number) => {
      await apiClient.post('/water', { amount_ml: val });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['water-today'] });
      setModalOpen(false);
    },
  });

  return (
    <MainLayout title="Hydration Telemetry" subtitle="Track daily water intake and hydration goals">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Hydration Overview</h2>
          <p className="text-xs text-neutral-400">Daily intake progress ring</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Log Water Entry
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 flex flex-col items-center justify-center text-center p-6">
          <HydrationRing currentMl={data?.total_ml || 2250} targetMl={data?.target_ml || 3000} size={200} />
          <div className="mt-6 flex items-center gap-2">
            <Button variant="glass" size="sm" onClick={() => logWaterMutation.mutate(250)}>
              +250 ml
            </Button>
            <Button variant="glass" size="sm" onClick={() => logWaterMutation.mutate(500)}>
              +500 ml
            </Button>
          </div>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <TelemetryChart
            title="Weekly Hydration Intake"
            subtitle="Volume in milliliters"
            data={[2100, 2400, 2800, 3000, 2200, 2900, data?.total_ml || 2250]}
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
            color="cyan"
            unit="ml"
          />

          <Card>
            <h3 className="text-sm font-bold text-white mb-3">Hydration Telemetry Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <span className="text-neutral-400 block mb-1">Today&apos;s Total</span>
                <span className="text-lg font-bold text-cyan-400">{data?.total_ml || 2250} ml</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <span className="text-neutral-400 block mb-1">Target Goal</span>
                <span className="text-lg font-bold text-white">{data?.target_ml || 3000} ml</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <span className="text-neutral-400 block mb-1">Logs Today</span>
                <span className="text-lg font-bold text-white">{data?.log_count || 5} Entries</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Custom Water Intake">
        <div className="space-y-4">
          <Input
            label="Amount (ml)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={logWaterMutation.isPending}
              onClick={() => logWaterMutation.mutate(amount)}
            >
              Add Water Log
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
