import { useState, useEffect, useCallback } from 'react';
import { JournalEntry, MoodType } from '@/types';
import { AvatarEvolution } from '@/types/sentiment';
import { useIndexedDB } from './useIndexedDB';

export const useAvatarEvolution = () => {
  const [evolution, setEvolution] = useState<AvatarEvolution>({
    complexity: 0,
    emotionalState: 0.5,
    openness: 0.5,
    glowIntensity: 0.3
  });

  const { getJournalEntries } = useIndexedDB();

  const calculateEvolution = useCallback(async () => {
    try {
      const entries: JournalEntry[] = await getJournalEntries();
      const totalEntries = entries.length;

      // Complexity based on entry count (0-1 scale)
      const complexity = Math.min(totalEntries / 50, 1); // Max at 50 entries

      // Calculate emotional state average
      const moodValues: Record<MoodType, number> = {
        anger: 0.1,
        sadness: 0.3,
        neutral: 0.5,
        calm: 0.7,
        hope: 0.8,
        joy: 1.0
      };

      const emotionalState = totalEntries > 0
        ? entries.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / totalEntries
        : 0.5;

      // Openness based on recent trend (last 7 days vs previous 7)
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const recentEntries = entries.filter(e => new Date(e.date) >= sevenDaysAgo);
      const previousEntries = entries.filter(e => 
        new Date(e.date) >= fourteenDaysAgo && new Date(e.date) < sevenDaysAgo
      );

      let openness = 0.5;
      if (recentEntries.length > 0 && previousEntries.length > 0) {
        const recentAvg = recentEntries.reduce((sum, e) => sum + moodValues[e.mood], 0) / recentEntries.length;
        const previousAvg = previousEntries.reduce((sum, e) => sum + moodValues[e.mood], 0) / previousEntries.length;
        openness = Math.max(0, Math.min(1, 0.5 + (recentAvg - previousAvg)));
      }

      // Glow intensity based on consistency (entries in last 7 days)
      const glowIntensity = Math.min(recentEntries.length / 7, 1);

      setEvolution({
        complexity,
        emotionalState,
        openness,
        glowIntensity
      });
    } catch (error) {
      console.error('Error calculating avatar evolution:', error);
      setEvolution({
        complexity: 0,
        emotionalState: 0.5,
        openness: 0.5,
        glowIntensity: 0.3
      });
    }
  }, [getJournalEntries]);

  useEffect(() => {
    calculateEvolution();
  }, [calculateEvolution]);

  return {
    evolution,
    refreshEvolution: calculateEvolution
  };
};