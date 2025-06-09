
import { JournalEntry, UserProfile } from '@/types';
import { useIndexedDB } from '@/hooks/useIndexedDB';

export interface StorageStats {
  totalEntries: number;
  totalAudioSize: number;
  oldestEntry?: string;
  newestEntry?: string;
  localStorageSize: number;
  indexedDBSize: number;
}

export interface DataExport {
  version: string;
  exportDate: string;
  profile: UserProfile | null;
  entries: JournalEntry[];
  metadata: {
    totalEntries: number;
    dateRange: string;
    exportType: 'full' | 'entries-only' | 'metadata-only';
  };
}

class DataManagerService {
  private indexedDB = useIndexedDB();

  // Journal Entry Management
  async saveEntry(entry: JournalEntry): Promise<void> {
    try {
      // Save to localStorage for quick access
      const entries = this.getEntriesFromStorage();
      const updatedEntries = [...entries.filter(e => e.id !== entry.id), entry];
      localStorage.setItem('healbit-journal-entries', JSON.stringify(updatedEntries));

      // Save audio to IndexedDB if present
      if (entry.audioBlob && entry.hasAudio) {
        await this.indexedDB.saveAudio(entry.id, entry.audioBlob);
      }

      console.log('Entry saved successfully:', entry.id);
    } catch (error) {
      console.error('Failed to save entry:', error);
      throw new Error('Unable to save your reflection right now');
    }
  }

  async getEntry(id: string): Promise<JournalEntry | null> {
    try {
      const entries = this.getEntriesFromStorage();
      const entry = entries.find(e => e.id === id);
      
      if (entry && entry.hasAudio) {
        // Fetch audio from IndexedDB
        const audioBlob = await this.indexedDB.getAudio(id);
        if (audioBlob) {
          entry.audioBlob = audioBlob;
          entry.audioUrl = URL.createObjectURL(audioBlob);
        }
      }
      
      return entry || null;
    } catch (error) {
      console.error('Failed to get entry:', error);
      return null;
    }
  }

  getAllEntries(): JournalEntry[] {
    return this.getEntriesFromStorage();
  }

  async deleteEntry(id: string): Promise<void> {
    try {
      // Remove from localStorage
      const entries = this.getEntriesFromStorage();
      const updatedEntries = entries.filter(e => e.id !== id);
      localStorage.setItem('healbit-journal-entries', JSON.stringify(updatedEntries));

      // Remove audio from IndexedDB
      await this.indexedDB.deleteAudio(id);
    } catch (error) {
      console.error('Failed to delete entry:', error);
      throw new Error('Unable to remove that reflection');
    }
  }

  // User Profile Management
  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem('healbit-user-profile', JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save profile:', error);
      throw new Error('Unable to save profile changes');
    }
  }

  getProfile(): UserProfile | null {
    try {
      const stored = localStorage.getItem('healbit-user-profile');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get profile:', error);
      return null;
    }
  }

  // Settings Management
  saveSetting(key: string, value: any): void {
    try {
      localStorage.setItem(`healbit-${key}`, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save setting:', error);
    }
  }

  getSetting(key: string): any {
    try {
      const stored = localStorage.getItem(`healbit-${key}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get setting:', error);
      return null;
    }
  }

  // Data Export
  async exportData(type: 'full' | 'entries-only' | 'metadata-only' = 'full'): Promise<DataExport> {
    try {
      const entries = this.getAllEntries();
      const profile = this.getProfile();
      
      const exportData: DataExport = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        profile: type === 'entries-only' ? null : profile,
        entries: type === 'metadata-only' ? [] : entries,
        metadata: {
          totalEntries: entries.length,
          dateRange: entries.length > 0 
            ? `${entries[entries.length - 1].date} to ${entries[0].date}`
            : 'No entries',
          exportType: type
        }
      };

      return exportData;
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error('Unable to prepare your data for export');
    }
  }

  // Storage Statistics
  async getStorageStats(): Promise<StorageStats> {
    try {
      const entries = this.getAllEntries();
      
      // Calculate localStorage size
      let localStorageSize = 0;
      for (let key in localStorage) {
        if (key.startsWith('healbit-')) {
          localStorageSize += localStorage[key].length;
        }
      }

      // Estimate IndexedDB size (simplified)
      const totalAudioSize = entries.filter(e => e.hasAudio).length * 50000; // Rough estimate

      return {
        totalEntries: entries.length,
        totalAudioSize,
        oldestEntry: entries.length > 0 ? entries[entries.length - 1].date : undefined,
        newestEntry: entries.length > 0 ? entries[0].date : undefined,
        localStorageSize: Math.round(localStorageSize / 1024), // KB
        indexedDBSize: Math.round(totalAudioSize / 1024) // KB
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return {
        totalEntries: 0,
        totalAudioSize: 0,
        localStorageSize: 0,
        indexedDBSize: 0
      };
    }
  }

  // Data Purging
  async purgeAllData(): Promise<void> {
    try {
      // Clear localStorage
      const keysToRemove = [];
      for (let key in localStorage) {
        if (key.startsWith('healbit-')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Clear IndexedDB
      const entries = this.getAllEntries();
      for (const entry of entries) {
        if (entry.hasAudio) {
          await this.indexedDB.deleteAudio(entry.id);
        }
      }

      console.log('All data purged successfully');
    } catch (error) {
      console.error('Failed to purge data:', error);
      throw new Error('Unable to clear all data');
    }
  }

  async purgeAudioOnly(): Promise<void> {
    try {
      const entries = this.getAllEntries();
      
      // Remove audio from IndexedDB and update entries
      for (const entry of entries) {
        if (entry.hasAudio) {
          await this.indexedDB.deleteAudio(entry.id);
          entry.hasAudio = false;
          entry.audioBlob = undefined;
          entry.audioUrl = undefined;
        }
      }

      // Update localStorage
      localStorage.setItem('healbit-journal-entries', JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to purge audio:', error);
      throw new Error('Unable to clear audio recordings');
    }
  }

  // Data Health & Migration
  async validateData(): Promise<boolean> {
    try {
      // Check localStorage accessibility
      localStorage.setItem('healbit-health-check', 'test');
      localStorage.removeItem('healbit-health-check');

      // Validate entry structure
      const entries = this.getAllEntries();
      for (const entry of entries) {
        if (!entry.id || !entry.date || !entry.mood) {
          console.warn('Invalid entry found:', entry.id);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Data validation failed:', error);
      return false;
    }
  }

  // Private helper methods
  private getEntriesFromStorage(): JournalEntry[] {
    try {
      const stored = localStorage.getItem('healbit-journal-entries');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to parse entries from storage:', error);
      return [];
    }
  }
}

// Export singleton instance
export const DataManager = new DataManagerService();
