
// Core types for HealBit application
export type MoodType = 'joy' | 'sadness' | 'anger' | 'neutral' | 'calm' | 'hope';

export interface JournalEntry {
  id: string;
  date: string;
  mood: MoodType;
  transcript?: string;
  audioBlob?: Blob;
  sentiment?: number;
  tags?: string[];
  affirmation?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  name?: string;
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    privacy: 'private' | 'anonymous';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  dataRetention: number; // days
  audioQuality: 'low' | 'medium' | 'high';
  notifications: boolean;
}
