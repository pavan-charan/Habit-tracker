import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const habitSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  category: z.string().default('health'),
  frequency: z.string().default('daily'),
  color: z.string().default('#10b981'),
  icon: z.string().default('check-circle'),
  target_count: z.number().min(1).default(1),
});

export const journalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content cannot be empty'),
  mood: z.string().default('neutral'),
  tags: z.array(z.string()).default([]),
});

export const sleepSchema = z.object({
  sleep_start: z.string().min(1, 'Start time required'),
  sleep_end: z.string().min(1, 'End time required'),
  quality_rating: z.number().min(1).max(5).default(3),
  notes: z.string().optional(),
});

export const waterSchema = z.object({
  amount_ml: z.number().min(50, 'Minimum 50ml').max(3000, 'Maximum 3000ml per entry'),
});

export const goalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().default('personal'),
  target_date: z.string().optional(),
  progress_percentage: z.number().min(0).max(100).default(0),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type HabitFormData = z.infer<typeof habitSchema>;
export type JournalFormData = z.infer<typeof journalSchema>;
export type SleepFormData = z.infer<typeof sleepSchema>;
export type WaterFormData = z.infer<typeof waterSchema>;
export type GoalFormData = z.infer<typeof goalSchema>;
