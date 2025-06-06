
// HealBit Local Storage Utilities
// All data stays on device for privacy and security

export interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  audioBlob?: Blob;
  audioUrl?: string;
  transcription?: string;
  mood: 'joy' | 'calm' | 'hope' | 'sadness' | 'anger' | 'neutral';
  tags: string[];
  duration: number; // in seconds
}

export interface UserProfile {
  name?: string;
  joinDate: string;
  lastActive: string;
  preferences: {
    dailyReminders: boolean;
    reminderTime: string;
    privacyMode: boolean;
  };
}

export interface HealingProgress {
  date: string;
  mood: string;
  journalCount: number;
  reflectionScore: number; // 1-10 based on engagement
}

class HealBitStorage {
  private readonly STORAGE_KEYS = {
    PROFILE: 'healbit-profile',
    ENTRIES: 'healbit-entries',
    PROGRESS: 'healbit-progress',
    SETTINGS: 'healbit-settings'
  };

  // Profile Management
  getProfile(): UserProfile | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  }

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }

  // Journal Entries
  getEntries(): JournalEntry[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.ENTRIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading entries:', error);
      return [];
    }
  }

  saveEntry(entry: JournalEntry): void {
    try {
      const entries = this.getEntries();
      const existingIndex = entries.findIndex(e => e.id === entry.id);
      
      if (existingIndex >= 0) {
        entries[existingIndex] = entry;
      } else {
        entries.push(entry);
      }
      
      localStorage.setItem(this.STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  }

  deleteEntry(entryId: string): void {
    try {
      const entries = this.getEntries().filter(e => e.id !== entryId);
      localStorage.setItem(this.STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  }

  // Progress Tracking
  getProgress(): HealingProgress[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.PROGRESS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading progress:', error);
      return [];
    }
  }

  saveProgress(progress: HealingProgress): void {
    try {
      const progressData = this.getProgress();
      const existingIndex = progressData.findIndex(p => p.date === progress.date);
      
      if (existingIndex >= 0) {
        progressData[existingIndex] = progress;
      } else {
        progressData.push(progress);
      }
      
      localStorage.setItem(this.STORAGE_KEYS.PROGRESS, JSON.stringify(progressData));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  // Data Export/Import
  exportAllData(): string {
    try {
      const data = {
        profile: this.getProfile(),
        entries: this.getEntries(),
        progress: this.getProgress(),
        exportDate: new Date().toISOString()
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return '';
    }
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.profile) this.saveProfile(data.profile);
      if (data.entries) {
        localStorage.setItem(this.STORAGE_KEYS.ENTRIES, JSON.stringify(data.entries));
      }
      if (data.progress) {
        localStorage.setItem(this.STORAGE_KEYS.PROGRESS, JSON.stringify(data.progress));
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Complete data deletion
  purgeAllData(): void {
    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      // Also clear any temporary session data
      localStorage.removeItem('healbit-user-name');
      localStorage.removeItem('healbit-last-mood');
    } catch (error) {
      console.error('Error purging data:', error);
    }
  }

  // Storage usage info
  getStorageInfo(): { used: number; available: number } {
    try {
      let used = 0;
      Object.values(this.STORAGE_KEYS).forEach(key => {
        const item = localStorage.getItem(key);
        if (item) used += item.length;
      });
      
      // Rough estimate of available space (5MB typical localStorage limit)
      const available = (5 * 1024 * 1024) - used;
      
      return { used, available };
    } catch (error) {
      console.error('Error calculating storage info:', error);
      return { used: 0, available: 0 };
    }
  }
}

export const storage = new HealBitStorage();
