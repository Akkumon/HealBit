
import { useState, useCallback, useEffect } from 'react';

const DB_NAME = 'healbit-audio';
const DB_VERSION = 1;
const STORE_NAME = 'audio-entries';

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
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }, []);

  const saveAudio = useCallback(async (id: string, audioBlob: Blob): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
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
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
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
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
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

  return {
    isLoading,
    error,
    saveAudio,
    getAudio,
    deleteAudio
  };
};
