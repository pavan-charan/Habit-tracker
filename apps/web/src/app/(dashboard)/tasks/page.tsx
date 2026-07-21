'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckSquare, Plus, Circle, CheckCircle2, Clock, AlertTriangle, Zap, Trash2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { apiClient } from '@/lib/api';
import { Task } from '@/types';

const PRIORITY_CONFIG = {
  urgent: { label: 'Urgent', color: 'text-red-400 bg-red-950/50 border-red-500/30', icon: <Zap className="w-3 h-3" /> },
  high: { label: 'High', color: 'text-orange-400 bg-orange-950/50 border-orange-500/30', icon: <AlertTriangle className="w-3 h-3" /> },
  medium: { label: 'Medium', color: 'text-amber-400 bg-amber-950/50 border-amber-500/30', icon: <Clock className="w-3 h-3" /> },
  low: { label: 'Low', color: 'text-neutral-400 bg-neutral-900/50 border-neutral-700/30', icon: <Circle className="w-3 h-3" /> },
};

const SEED_TASKS: Task[] = [
  { id: 't1', user_id: 'u1', title: 'Design AI Coach conversation flow', description: 'Sketch prompt templates and memory architecture.', is_completed: false, priority: 'urgent', category: 'engineering', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't2', user_id: 'u1', title: 'Set up Alembic migrations for Phase 2 models', is_completed: false, priority: 'high', category: 'engineering', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't3', user_id: 'u1', title: 'Write 2L of water today', is_completed: true, priority: 'medium', category: 'health', completed_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't4', user_id: 'u1', title: 'Read "Designing Data-Intensive Applications" Ch.4', is_completed: false, priority: 'low', category: 'learning', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export default function TasksPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [category, setCategory] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/tasks');
        return res.data;
      } catch {
        return SEED_TASKS;
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post('/tasks', { title, priority, category: category || undefined });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setModalOpen(false);
      setTitle('');
      setPriority('medium');
      setCategory('');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (task: Task) => {
      await apiClient.put(`/tasks/${task.id}`, { is_completed: !task.is_completed });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/tasks/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const filtered = tasks.filter((t) => {
    if (filter === 'active') return !t.is_completed;
    if (filter === 'completed') return t.is_completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.is_completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <MainLayout title="Tasks" subtitle="Capture, prioritize and track every action item">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: tasks.length },
          { label: 'Completed', value: completedCount },
          { label: 'Completion', value: `${completionRate}%` },
        ].map((stat) => (
          <Card key={stat.label} className="py-3 px-4 text-center">
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                filter === f ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          New Task
        </Button>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <Card className="py-12 text-center">
            <CheckSquare className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-400 text-sm">No tasks here. Add one above!</p>
          </Card>
        )}
        {filtered.map((task) => {
          const pc = PRIORITY_CONFIG[task.priority];
          return (
            <Card
              key={task.id}
              className={`flex items-center gap-4 group transition-all duration-200 ${task.is_completed ? 'opacity-50' : ''}`}
            >
              <button
                onClick={() => toggleMutation.mutate(task)}
                className="flex-shrink-0 transition-transform hover:scale-110"
              >
                {task.is_completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-neutral-600 hover:text-indigo-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${task.is_completed ? 'line-through text-neutral-500' : 'text-white'}`}>
                  {task.title}
                </p>
                {task.description && <p className="text-xs text-neutral-500 truncate mt-0.5">{task.description}</p>}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {task.category && (
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-400 border border-neutral-800">
                    {task.category}
                  </span>
                )}
                <span className={`flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${pc.color}`}>
                  {pc.icon} {pc.label}
                </span>
                <button
                  onClick={() => deleteMutation.mutate(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Task">
        <div className="space-y-4">
          <Input
            label="Task Title"
            placeholder="e.g. Review pull request for auth module"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">Priority</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(PRIORITY_CONFIG) as Task['priority'][]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-2 rounded-lg text-xs font-bold capitalize border transition-all ${
                    priority === p ? PRIORITY_CONFIG[p].color + ' ring-1 ring-current' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <Input
            label="Category (optional)"
            placeholder="e.g. engineering, health, learning"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" isLoading={createMutation.isPending} onClick={() => createMutation.mutate()}>
              Create Task
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
