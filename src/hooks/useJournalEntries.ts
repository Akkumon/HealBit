import { useEffect, useState } from 'react';
import { JournalEntry } from '@/types'; // Assuming JournalEntry is defined in '@/types'
import { openDatabase, getJournalEntries } from '@/lib/indexedDB';

export function useJournalEntries() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const db = await openDatabase();
        const entries = await getJournalEntries(db);
        setJournalEntries(entries);
      } catch (err) {
        console.error('Failed to fetch journal entries:', err);
        setError(err as Event);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  return { journalEntries, loading, error };
} 