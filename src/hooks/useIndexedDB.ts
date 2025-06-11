import { useState, useCallback, useEffect } from 'react';
import { JournalEntry } from '@/types';

const DB_NAME = 'healbit-storage';
const DB_VERSION = 2;
const AUDIO_STORE_NAME = 'audio-entries';
const JOURNAL_STORE_NAME = 'journal-entries';

export interface AudioEntry {
  id: string;
  audioBlob: Blob;
  timestamp: number;
}

export const useIndexedDB = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDB = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create audio store if it doesn't exist
        if (!db.objectStoreNames.contains(AUDIO_STORE_NAME)) {
          db.createObjectStore(AUDIO_STORE_NAME, { keyPath: 'id' });
        }
        
        // Create journal entries store if it doesn't exist
        if (!db.objectStoreNames.contains(JOURNAL_STORE_NAME)) {
          const journalStore = db.createObjectStore(JOURNAL_STORE_NAME, { keyPath: 'id' });
          journalStore.createIndex('date', 'date', { unique: false });
          journalStore.createIndex('mood', 'mood', { unique: false });
        }
      };
    });
  }, []);

  // Audio methods (existing)
  const saveAudio = useCallback(async (id: string, audioBlob: Blob): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const db = await openDB();
      const transaction = db.transaction([AUDIO_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(AUDIO_STORE_NAME);
      
      const audioEntry: AudioEntry = {
        id,
        audioBlob,
        timestamp: Date.now()
      };
      
      await new Promise((resolve, reject) => {
        const request = store.put(audioEntry);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      db.close();
    } catch (err) {
      console.error('Error saving audio:', err);
      setError('Failed to save audio');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [openDB]);

  const getAudio = useCallback(async (id: string): Promise<Blob | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const db = await openDB();
      const transaction = db.transaction([AUDIO_STORE_NAME], 'readonly');
      const store = transaction.objectStore(AUDIO_STORE_NAME);
      
      const result = await new Promise<AudioEntry | undefined>((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      db.close();
      return result?.audioBlob || null;
    } catch (err) {
      console.error('Error getting audio:', err);
      setError('Failed to retrieve audio');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [openDB]);

  const deleteAudio = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const db = await openDB();
      const transaction = db.transaction([AUDIO_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(AUDIO_STORE_NAME);
      
      await new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      db.close();
    } catch (err) {
      console.error('Error deleting audio:', err);
      setError('Failed to delete audio');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [openDB]);

  // Journal entry methods (new)
  const saveJournalEntry = useCallback(async (entry: JournalEntry): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const db = await openDB();
      const transaction = db.transaction([JOURNAL_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(JOURNAL_STORE_NAME);
      
      await new Promise((resolve, reject) => {
        const request = store.put(entry);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      db.close();
    } catch (err) {
      console.error('Error saving journal entry:', err);
      setError('Failed to save journal entry');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [openDB]);

  const getJournalEntries = useCallback(async (): Promise<JournalEntry[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const db = await openDB();
      const transaction = db.transaction([JOURNAL_STORE_NAME], 'readonly');
      const store = transaction.objectStore(JOURNAL_STORE_NAME);
      
      const result = await new Promise<JournalEntry[]>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
      
      db.close();
      return result;
    } catch (err) {
      console.error('Error getting journal entries:', err);
      setError('Failed to retrieve journal entries');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [openDB]);

  const deleteJournalEntry = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const db = await openDB();
      const transaction = db.transaction([JOURNAL_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(JOURNAL_STORE_NAME);
      
      await new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      db.close();
    } catch (err) {
      console.error('Error deleting journal entry:', err);
      setError('Failed to delete journal entry');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [openDB]);

  const clearAllData = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const db = await openDB();
      const transaction = db.transaction([AUDIO_STORE_NAME, JOURNAL_STORE_NAME], 'readwrite');
      
      const audioStore = transaction.objectStore(AUDIO_STORE_NAME);
      const journalStore = transaction.objectStore(JOURNAL_STORE_NAME);
      
      await Promise.all([
        new Promise((resolve, reject) => {
          const request = audioStore.clear();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        }),
        new Promise((resolve, reject) => {
          const request = journalStore.clear();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        })
      ]);
      
      db.close();
    } catch (err) {
      console.error('Error clearing all data:', err);
      setError('Failed to clear all data');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [openDB]);

  return {
    isLoading,
    error,
    // Audio methods
    saveAudio,
    getAudio,
    deleteAudio,
    // Journal entry methods
    saveJournalEntry,
    getJournalEntries,
    deleteJournalEntry,
    clearAllData
  };
};