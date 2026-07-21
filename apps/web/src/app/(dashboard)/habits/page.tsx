'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckSquare, Plus, Flame, Check } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { HabitGrid } from '@/components/ui/HabitGrid';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { apiClient } from '@/lib/api';
import { Habit } from '@/types';

export default function HabitsPage() {
  const queryClient = useQueryClient();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('health');

  const { data: habits = [], isLoading } = useQuery<Habit[]>({
    queryKey: ['habits'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/habits');
        return res.data;
      } catch (err) {
        return [
          {
            id: '1',
            user_id: 'u1',
            title: 'Morning Hydration 500ml',
            description: 'Drink 500ml water immediately upon waking',
            category: 'health',
            frequency: 'daily',
            color: '#06b6d4',
            icon: 'droplets',
            target_count: 1,
            is_archived: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '2',
            user_id: 'u1',
            title: '90m Deep Focus Coding',
            description: 'Uninterrupted deep work session',
            category: 'productivity',
            color: '#8b5cf6',
            frequency: 'daily',
            icon: 'code',
            target_count: 1,
            is_archived: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '3',
            user_id: 'u1',
            title: 'Read 20 Pages Technical Documentation',
            description: 'Continuous learning habit',
            category: 'learning',
            color: '#10b981',
            frequency: 'daily',
            icon: 'book',
            target_count: 1,
            is_archived: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
      }
    },
  });

  const createHabitMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post('/habits', { title, category });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      setCreateModalOpen(false);
      setTitle('');
    },
  });

  return (
    <MainLayout title="Habit Consistency Engine" subtitle="Track habits, maintain daily check-in streaks">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Active Habits</h2>
          <p className="text-xs text-neutral-400">Consistency matrix & daily log</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setCreateModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create New Habit
        </Button>
      </div>

      <Card>
        <HabitGrid habits={habits} onToggle={(id) => console.log('Toggled', id)} />
      </Card>

      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Add New Habit">
        <div className="space-y-4">
          <Input label="Habit Title" placeholder="e.g. Morning Hydration" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-300">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="glass-input px-3.5 py-2.5 rounded-xl text-sm"
            >
              <option value="health">Health & Vitality</option>
              <option value="productivity">Productivity & Deep Work</option>
              <option value="learning">Learning & Knowledge</option>
              <option value="mindfulness">Mindfulness & Mental Health</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={createHabitMutation.isPending}
              onClick={() => createHabitMutation.mutate()}
            >
              Save Habit
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
