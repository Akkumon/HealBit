
export type MoodType = 'joy' | 'sadness' | 'anger' | 'neutral' | 'calm' | 'hope';

export interface JournalEntry {
  id: string;
  timestamp: Date;
  audioBlob?: Blob;
  transcript: string;
  mood: MoodType;
  tags: string[];
  sentiment?: {
    score: number;
    confidence: number;
  };
}

export interface UserProfile {
  name: string;
  joinDate: Date;
  avatarSettings: {
    primaryColor: string;
    secondaryColor: string;
    style: string;
  };
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  microphonePermission: boolean;
  dataRetentionDays: number;
}
