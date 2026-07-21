'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Target, Plus, TrendingUp, CheckCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { apiClient } from '@/lib/api';
import { Goal } from '@/types';

export default function GoalsPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('engineering');

  const { data: goals = [] } = useQuery<Goal[]>({
    queryKey: ['goals'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/goals');
        return res.data;
      } catch (err) {
        return [
          {
            id: 'g1',
            user_id: 'u1',
            title: 'Build PersonalOS Monorepo Foundation',
            description: 'Establish enterprise Next.js 15, FastAPI, PostgreSQL architecture.',
            category: 'engineering',
            status: 'completed',
            progress_percentage: 100,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'g2',
            user_id: 'u1',
            title: 'Phase 1 Production Verification & Documentation',
            description: 'Run automated tests, TypeScript type checks, and Docker stack.',
            category: 'engineering',
            status: 'in_progress',
            progress_percentage: 85,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'g3',
            user_id: 'u1',
            title: 'Q3 Physical Health & Hydration Target',
            description: 'Maintain 3,000ml water daily for 90 consecutive days.',
            category: 'health',
            status: 'in_progress',
            progress_percentage: 65,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
      }
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post('/goals', { title, category });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setModalOpen(false);
      setTitle('');
    },
  });

  return (
    <MainLayout title="Goals & Objectives Roadmap" subtitle="Track high-level personal, career & health OKRs">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Active Roadmap</h2>
          <p className="text-xs text-neutral-400">Target milestones & progress bars</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Add New Objective
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-neutral-900 text-neutral-400 border border-neutral-800">
                  {goal.category}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                    goal.status === 'completed'
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {goal.status.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{goal.title}</h3>
              {goal.description && <p className="text-xs text-neutral-400 mb-4">{goal.description}</p>}
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-neutral-400">Progress Milestone</span>
                <span className="text-white font-mono">{goal.progress_percentage}%</span>
              </div>
              <div className="w-full bg-neutral-900 rounded-full h-2.5 overflow-hidden border border-neutral-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500 rounded-full"
                  style={{ width: `${goal.progress_percentage}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Objective">
        <div className="space-y-4">
          <Input label="Goal Title" placeholder="e.g. Master Next.js 15 & FastAPI" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={createGoalMutation.isPending}
              onClick={() => createGoalMutation.mutate()}
            >
              Save Goal
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
