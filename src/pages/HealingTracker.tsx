
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn, getMoodColorClass } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, PlusCircle } from 'lucide-react';
import ThreeDWeatherScene from '@/components/ThreeDWeatherScene';
import WeatherTracker from '@/components/WeatherTracker/WeatherTracker';
import { getDailyStreaks, getMoodFrequency } from '@/lib/moodAnalysis';
import PageContainer from '@/components/PageContainer';
import BottomNavigation from '@/components/BottomNavigation';
import { MoodType, JournalEntry } from '@/types';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { EmotionScale } from '@/types/sentiment';

const HealingTracker = () => {
  const navigate = useNavigate();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const { getJournalEntries } = useIndexedDB();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const fetchEntries = async () => {
      const entries = await getJournalEntries();
      setJournalEntries(entries);
    };
    fetchEntries();
  }, [getJournalEntries]);

  // Calculate streaks and mood frequency
  const streaks = useMemo(() => getDailyStreaks(journalEntries), [journalEntries]);
  const moodFrequency = useMemo(() => getMoodFrequency(journalEntries), [journalEntries]);

  // Determine dominant mood for the landscape
  const dominantMoodForLandscape = useMemo(() => {
    const totalEntriesCount = Object.values(moodFrequency).reduce((sum, count) => (sum as number) + (count as number), 0);
    if (totalEntriesCount === 0) return 'neutral';

    const sortedMoods = Object.entries(moodFrequency).sort(([, countA], [, countB]) => (countB as number) - (countA as number));
    const mostFrequentMood = sortedMoods[0][0] as MoodType;

    return mostFrequentMood;
  }, [moodFrequency]);

  // Map MoodType to EmotionScale for ThreeDWeatherScene (1-5)
  const moodToEmotionScaleMap: Record<MoodType, EmotionScale> = {
    anger: 1,
    sadness: 2,
    neutral: 3,
    calm: 4,
    hope: 4,
    joy: 5
  };

  const currentEmotionScale: EmotionScale = moodToEmotionScaleMap[dominantMoodForLandscape] || 3;

  const handleDayClick = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const entriesForDay = journalEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getDate() === date.getDate() &&
               entryDate.getMonth() === date.getMonth() &&
               entryDate.getFullYear() === date.getFullYear();
      });
      console.log('Entries for selected day:', entriesForDay);
    }
  };

  const getEncouragementMessage = () => {
    if (journalEntries.length === 0) {
      return "Your healing journey begins with the first step. Every voice matters. 🌱";
    }
    
    if (streaks === 0) {
      return "Every storm passes. Your sunny days are coming. 🌈";
    }
    
    if (streaks === 1) {
      return "Beautiful! You've taken another step in your healing journey. 💝";
    }
    
    if (streaks < 7) {
      return `Amazing! You're on a ${streaks}-day journey of self-reflection. 🌟`;
    }
    
    return `Incredible! ${streaks} days of consistent healing. You're growing so beautifully. 🌸`;
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">Healing Weather</h1>
        <div className="w-10" />
      </div>

      {/* New Inner Forecast Weather Tracker */}
      <WeatherTracker 
        mood={dominantMoodForLandscape} 
        className="mb-6"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{journalEntries.length}</div>
            <p className="text-sm text-muted-foreground">Reflections</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent-foreground mb-1">{streaks}</div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
      </div>

      {/* Mood Summary */}
      <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Emotional Patterns</CardTitle>
          <CardDescription>Your most frequent emotional states</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.entries(moodFrequency).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {Object.entries(moodFrequency)
                .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
                .slice(0, 5)
                .map(([mood, count]) => (
                  <div
                    key={mood}
                    className={cn(
                      'flex items-center space-x-1 px-3 py-1 rounded-full text-sm',
                      getMoodColorClass(mood as MoodType)
                    )}
                  >
                    <span className="font-medium capitalize">{mood}</span>
                    <span className="text-xs opacity-70">({count})</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Start journaling to see your emotional patterns
            </p>
          )}
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Journal History</CardTitle>
          <CardDescription>Browse your past reflections</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDayClick}
            className="rounded-md border bg-background text-foreground"
          />
          {selectedDate && (
            <div className="mt-4 text-center text-sm">
              Selected: <span className="font-medium">{selectedDate.toDateString()}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center mb-6">
        <Button
          onClick={() => navigate('/prompt')}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Start New Reflection
        </Button>
      </div>

      {/* Encouragement */}
      <div className="bg-accent/10 dark:bg-accent/20 rounded-lg p-4 text-center mb-6">
        <p className="text-sm text-accent-foreground">
          {getEncouragementMessage()}
        </p>
      </div>

      <BottomNavigation />
    </PageContainer>
  );
};

export default HealingTracker;
