
export type MoodType = 'joy' | 'sadness' | 'anger' | 'neutral' | 'calm' | 'hope';

export interface JournalEntry {
  id: string;
  date: string;
  transcript: string;
  audioBlob?: Blob;
  mood: MoodType;
  tags: string[];
  prompt?: string;
}

export interface AvatarState {
  level: number;
  experience: number;
  mood: MoodType;
  accessories: string[];
}
