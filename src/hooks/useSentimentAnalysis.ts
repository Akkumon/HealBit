import { useState, useEffect, useCallback } from 'react';
import { MoodType, JournalEntry } from '@/types';
import { EmotionScale, SentimentData } from '@/types/sentiment';
import { useIndexedDB } from './useIndexedDB';

export const useSentimentAnalysis = () => {
  const [sentimentData, setSentimentData] = useState<SentimentData>({
    score: 3,
    trend: 'stable',
    weeklyAverage: 3,
    message: 'Finding your rhythm in the weather of emotions'
  });

  const { getJournalEntries } = useIndexedDB();

  const moodToEmotionScale = useCallback((mood: MoodType): EmotionScale => {
    const moodMap: Record<MoodType, EmotionScale> = {
      anger: 1,
      sadness: 2,
      neutral: 3,
      calm: 4,
      hope: 4,
      joy: 5
    };
    return moodMap[mood] || 3;
  }, []);

  const calculateSentiment = useCallback(async () => {
    try {
      const entries: JournalEntry[] = await getJournalEntries();
      
      if (entries.length === 0) {
        setSentimentData({
          score: 3,
          trend: 'stable',
          weeklyAverage: 3,
          message: 'Your journey begins with the first step'
        });
        return;
      }

      // Get entries from last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentEntries = entries.filter(entry => 
        new Date(entry.date) >= sevenDaysAgo
      );

      // Calculate scores
      const scores = recentEntries.map(entry => moodToEmotionScale(entry.mood));
      const weeklyAverage = scores.length > 0 
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
        : 3;

      // Calculate trend (compare recent vs older entries)
      const olderEntries = entries.filter(entry => 
        new Date(entry.date) < sevenDaysAgo && 
        new Date(entry.date) >= new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000)
      );
      
      let trend: 'improving' | 'stable' | 'declining' = 'stable';
      if (olderEntries.length > 0) {
        const olderAverage = olderEntries.reduce((sum, entry) => 
          sum + moodToEmotionScale(entry.mood), 0) / olderEntries.length;
        const difference = weeklyAverage - olderAverage;
        
        if (difference > 0.3) trend = 'improving';
        else if (difference < -0.3) trend = 'declining';
      }

      // Generate contextual message
      const messages = {
        improving: [
          'Your skies are clearing beautifully',
          'Sunshine is breaking through the clouds',
          'What a wonderful shift in your weather'
        ],
        stable: [
          'Steady as she goes through your emotional weather',
          'Finding your rhythm in the gentle seasons',
          'Consistent and growing, day by day'
        ],
        declining: [
          'Weathering the storm together, you\'re not alone',
          'Even storms pass, and you\'re so brave',
          'Gentle rains help things grow too'
        ]
      };

      const trendMessages = messages[trend];
      const message = trendMessages[Math.floor(Math.random() * trendMessages.length)];

      setSentimentData({
        score: Math.round(weeklyAverage) as EmotionScale,
        trend,
        weeklyAverage,
        message
      });
    } catch (error) {
      console.error('Error calculating sentiment:', error);
      setSentimentData({
        score: 3,
        trend: 'stable',
        weeklyAverage: 3,
        message: 'Finding your rhythm in the weather of emotions'
      });
    }
  }, [moodToEmotionScale, getJournalEntries]);

  useEffect(() => {
    calculateSentiment();
  }, [calculateSentiment]);

  return {
    sentimentData,
    refreshSentiment: calculateSentiment,
    moodToEmotionScale
  };
};