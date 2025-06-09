
import { useState, useCallback } from 'react';
import { DataManager, StorageStats, DataExport } from '@/services/DataManager';
import { JournalEntry, UserProfile } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { copies } from '@/utils/copies';

export const useDataManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const saveEntry = useCallback(async (entry: JournalEntry): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await DataManager.saveEntry(entry);
      toast({
        title: copies.ui.saving.complete,
        description: "Your reflection has been saved securely on your device.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : copies.ui.errors.storage;
      setError(errorMessage);
      toast({
        title: copies.ui.errors.gentle,
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getEntry = useCallback(async (id: string): Promise<JournalEntry | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await DataManager.getEntry(id);
    } catch (err) {
      const errorMessage = "Unable to retrieve that reflection";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteEntry = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await DataManager.deleteEntry(id);
      toast({
        title: "Reflection removed",
        description: "That entry has been gently removed from your journal.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unable to remove that reflection";
      setError(errorMessage);
      toast({
        title: copies.ui.errors.gentle,
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const exportData = useCallback(async (type: 'full' | 'entries-only' | 'metadata-only' = 'full'): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      toast({
        title: copies.contextual.exportPreparing,
        description: "This may take a moment...",
      });

      const exportData = await DataManager.exportData(type);
      
      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `healbit-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: copies.contextual.exportReady,
        description: "Your data has been downloaded safely to your device.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unable to export your data";
      setError(errorMessage);
      toast({
        title: copies.ui.errors.gentle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const purgeAllData = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await DataManager.purgeAllData();
      toast({
        title: copies.contextual.dataCleared,
        description: "All your data has been permanently removed from this device.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unable to clear all data";
      setError(errorMessage);
      toast({
        title: copies.ui.errors.gentle,
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getStorageStats = useCallback(async (): Promise<StorageStats> => {
    try {
      return await DataManager.getStorageStats();
    } catch (err) {
      console.error('Failed to get storage stats:', err);
      return {
        totalEntries: 0,
        totalAudioSize: 0,
        localStorageSize: 0,
        indexedDBSize: 0
      };
    }
  }, []);

  return {
    isLoading,
    error,
    saveEntry,
    getEntry,
    deleteEntry,
    getAllEntries: DataManager.getAllEntries.bind(DataManager),
    saveProfile: DataManager.saveProfile.bind(DataManager),
    getProfile: DataManager.getProfile.bind(DataManager),
    exportData,
    purgeAllData,
    getStorageStats,
    clearError: () => setError(null)
  };
};
