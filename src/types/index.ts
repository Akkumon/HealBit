
export type MoodType = 'joy' | 'calm' | 'hope' | 'sadness' | 'anger' | 'neutral';

export interface DailyPrompt {
  id: string;
  category: 'gratitude' | 'self-compassion' | 'growth' | 'reflection' | 'hope' | 'processing' | 'strength';
  text: string;
  followUp?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  promptId: string;
  audioUrl?: string;
  transcript?: string;
  mood: MoodType;
  emotions: string[];
  duration: number;
}

export interface Affirmation {
  id: string;
  mood: MoodType;
  text: string;
  category: string;
}

export interface AvatarPreferences {
  primaryColor: string;
  animationStyle: 'gentle' | 'vibrant' | 'minimal';
  size: 'sm' | 'md' | 'lg';
}

export interface UserProfile {
  name?: string;
  avatar: AvatarPreferences;
  joinDate: string;
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
}

export interface HealingProgress {
  date: string;
  mood: MoodType;
  entryCount: number;
  notes?: string;
}
