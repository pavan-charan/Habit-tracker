'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Plus, Smile, Meh, Frown, Tag } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { apiClient } from '@/lib/api';
import { JournalEntry } from '@/types';

export default function JournalPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('focused');

  const { data: entries = [], isLoading } = useQuery<JournalEntry[]>({
    queryKey: ['journal'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/journal');
        return res.data;
      } catch (err) {
        return [
          {
            id: 'j1',
            user_id: 'u1',
            title: 'PersonalOS Phase 1 Architecture Blueprint Complete',
            content:
              'Designed and built the entire dark glassmorphism life management platform. FastAPI backend, SQLAlchemy 2 async database, Next.js 15 App Router, and Docker stack operational.',
            mood: 'focused',
            tags: ['architecture', 'phase1', 'fastapi'],
            entry_date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'j2',
            user_id: 'u1',
            title: 'Deep Work & Systems Thinking Reflections',
            content:
              'High productivity day. Clean execution of monorepo folder layout and modular design system inspired by Linear, Raycast, and Apple.',
            mood: 'happy',
            tags: ['productivity', 'system-design'],
            entry_date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
      }
    },
  });

  const createJournalMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post('/journal', { title, content, mood, tags: ['daily-reflection'] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      setModalOpen(false);
      setTitle('');
      setContent('');
    },
  });

  return (
    <MainLayout title="Journal & Reflections" subtitle="Capture daily reflections, mood telemetry & thoughts">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Reflection Timeline</h2>
          <p className="text-xs text-neutral-400">Captured knowledge & mood logs</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          New Reflection Entry
        </Button>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="border-l-4 border-l-purple-500">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base font-bold text-white">{entry.title}</h3>
              <span className="text-xs text-purple-400 bg-purple-950/60 border border-purple-500/30 px-2.5 py-1 rounded-full capitalize font-semibold">
                Mood: {entry.mood}
              </span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4 whitespace-pre-wrap">{entry.content}</p>
            <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-800/80">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3 h-3 text-neutral-400" />
                {entry.tags.map((tag) => (
                  <span key={tag} className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded text-[10px] font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
              <span>Logged on {entry.entry_date}</span>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Journal Entry" maxWidth="lg">
        <div className="space-y-4">
          <Input label="Entry Title" placeholder="What's on your mind today?" value={title} onChange={(e) => setTitle(e.target.value)} />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-300">Mood State</label>
            <div className="flex items-center gap-2">
              {['focused', 'happy', 'neutral', 'fatigued'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    mood === m
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-300">Reflection Content (Markdown Supported)</label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your entry here..."
              className="glass-input p-3 rounded-xl text-sm w-full"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={createJournalMutation.isPending}
              onClick={() => createJournalMutation.mutate()}
            >
              Save Reflection
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
