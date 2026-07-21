export interface User {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  profile?: Profile;
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  timezone: string;
  units_preference: Record<string, any>;
  theme: string;
  language: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  frequency: string;
  color: string;
  icon: string;
  target_count: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  status: string;
  count: number;
  notes?: string;
  created_at: string;
}

export interface WaterLog {
  id: string;
  user_id: string;
  amount_ml: number;
  logged_at: string;
  target_ml: number;
  created_at: string;
}

export interface SleepLog {
  id: string;
  user_id: string;
  sleep_start: string;
  sleep_end: string;
  duration_minutes: number;
  quality_rating: number;
  notes?: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  entry_date: string;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  target_date?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'archived';
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: string;
  timezone: string;
  unit_system: string;
  language: string;
  notification_prefs: Record<string, boolean>;
  privacy_prefs: Record<string, boolean>;
}

export interface TelemetryStatCardData {
  title: string;
  value: string;
  target?: string;
  percentage: number;
  status: string;
  unit: string;
}

export interface DashboardData {
  water: TelemetryStatCardData;
  sleep: TelemetryStatCardData;
  habits: TelemetryStatCardData;
  goals: TelemetryStatCardData;
  recent_mood: string;
  weekly_water_series: number[];
  weekly_sleep_series: number[];
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  due_date?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}
