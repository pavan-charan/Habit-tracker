'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StickyNote, Plus, Search, Tag, Trash2, Edit3, X } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { apiClient } from '@/lib/api';
import { Note } from '@/types';

const SEED_NOTES: Note[] = [
  {
    id: 'n1', user_id: 'u1',
    title: 'PersonalOS Architecture Notes',
    content: '## System Design\n\n- FastAPI backend with async SQLAlchemy\n- Next.js 15 with React 19 RC\n- Redis for caching and background queues\n- PostgreSQL with soft-delete pattern\n\n## Next Steps\n\n1. Implement RAG pipeline\n2. Build AI Coach module\n3. Integrate wearable data sources',
    tags: ['architecture', 'engineering', 'ai'],
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'n2', user_id: 'u1',
    title: 'Sleep Optimization Research',
    content: '## Key Findings\n\n- 7-9 hours optimal for cognitive performance\n- Consistent sleep/wake times matter more than total hours\n- Blue light exposure 2hrs before sleep disrupts melatonin\n\n## My Protocol\n\n- 10:30 PM lights off\n- Phone in another room\n- 18°C room temperature',
    tags: ['health', 'sleep', 'research'],
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'n3', user_id: 'u1',
    title: 'Flutter Architecture Decisions',
    content: '## State Management: Riverpod\n\nChosen over Bloc and Provider for:\n- Compile-time safety\n- No BuildContext dependency\n- Easier testing\n\n## Navigation: GoRouter\n\nSupports deep linking needed for:\n- Push notifications\n- Wearable integrations',
    tags: ['flutter', 'mobile', 'architecture'],
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
];

const TAG_COLORS = [
  'bg-indigo-950/60 text-indigo-400 border-indigo-500/30',
  'bg-emerald-950/60 text-emerald-400 border-emerald-500/30',
  'bg-amber-950/60 text-amber-400 border-amber-500/30',
  'bg-purple-950/60 text-purple-400 border-purple-500/30',
  'bg-rose-950/60 text-rose-400 border-rose-500/30',
];

export default function NotesPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [viewNote, setViewNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const { data: notes = [] } = useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: async () => {
      try {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (activeTag) params.tag = activeTag;
        const res = await apiClient.get('/notes', { params });
        return res.data;
      } catch {
        return SEED_NOTES;
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
      await apiClient.post('/notes', { title, content, tags });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setModalOpen(false);
      setTitle('');
      setContent('');
      setTagsInput('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/notes/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });

  // Collect all unique tags
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));
  const filtered = notes.filter((n) => {
    const matchesSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag = !activeTag || n.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <MainLayout title="Notes" subtitle="Your personal knowledge base — markdown supported">
      {/* Search & filter */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          New Note
        </Button>
      </div>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setActiveTag(null)}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
              !activeTag ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            All
          </button>
          {allTags.map((tag, i) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                activeTag === tag ? TAG_COLORS[i % TAG_COLORS.length] + ' ring-1 ring-current' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Tag className="w-3 h-3" /> {tag}
            </button>
          ))}
        </div>
      )}

      {/* Notes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <Card className="col-span-full py-12 text-center">
            <StickyNote className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-400 text-sm">No notes yet. Start capturing your thoughts!</p>
          </Card>
        )}
        {filtered.map((note, i) => (
          <Card
            key={note.id}
            className="flex flex-col justify-between cursor-pointer hover:border-indigo-500/40 transition-all group"
            onClick={() => setViewNote(note)}
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-bold text-white flex-1 mr-2 line-clamp-2">{note.title}</h3>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(note.id); }}
                  className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-400 transition-all flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-neutral-500 line-clamp-3 mb-3">
                {note.content.replace(/#+\s/g, '').replace(/\*\*/g, '').trim()}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {note.tags.slice(0, 3).map((tag, ti) => (
                  <span key={tag} className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${TAG_COLORS[ti % TAG_COLORS.length]}`}>
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-neutral-600">{formatDate(note.updated_at)}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* View Note Modal */}
      {viewNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setViewNote(null)}>
          <div
            className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">{viewNote.title}</h2>
              <button onClick={() => setViewNote(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1 mb-4">
              {viewNote.tags.map((tag, i) => (
                <span key={tag} className={`text-xs font-bold px-2 py-0.5 rounded-full border ${TAG_COLORS[i % TAG_COLORS.length]}`}>{tag}</span>
              ))}
            </div>
            <pre className="text-sm text-neutral-300 whitespace-pre-wrap font-mono leading-relaxed">{viewNote.content}</pre>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Note">
        <div className="space-y-4">
          <Input label="Title" placeholder="e.g. System Design Notes" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">Content (Markdown supported)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder="# Heading&#10;&#10;Write your note here..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono resize-none"
            />
          </div>
          <Input label="Tags (comma separated)" placeholder="e.g. engineering, research, ideas" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" isLoading={createMutation.isPending} onClick={() => createMutation.mutate()}>
              Save Note
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
