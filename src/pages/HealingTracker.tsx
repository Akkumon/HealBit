import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn, getMoodColorClass } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlusCircle } from 'lucide-react';
import WeatherAnimation from '@/components/WeatherAnimation';
import { getDailyStreaks, getMoodFrequency } from '@/lib/moodAnalysis';
import PageContainer from '@/components/PageContainer';
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
    const mostFrequentMood = sortedMoods[0][0];

    // Map to specific moods for the landscape
    if (mostFrequentMood === 'happy' || mostFrequentMood === 'excited') return 'joy';
    if (mostFrequentMood === 'calm' || mostFrequentMood === 'peaceful') return 'calm';
    if (mostFrequentMood === 'hopeful' || mostFrequentMood === 'grateful') return 'hope';
    if (mostFrequentMood === 'sad' || mostFrequentMood === 'lonely') return 'sadness';
    if (mostFrequentMood === 'angry' || mostFrequentMood === 'frustrated') return 'anger';
    return 'neutral';
  }, [moodFrequency]);

  // Map MoodType to EmotionScale for WeatherAnimation (1-5)
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
      // TODO: Display entries for the selected day or navigate to a daily summary
      console.log('Entries for selected day:', entriesForDay);
    }
  };

  const getWeatherDescription = (mood: MoodType) => {
    const descriptions = {
      joy: 'Sunny & Bright',
      calm: 'Peaceful Clear',
      hope: 'Partly Sunny',
      neutral: 'Cloudy',
      sadness: 'Light Rain',
      anger: 'Stormy'
    };
    return descriptions[mood] || 'Cloudy';
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
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
        <h1 className="text-4xl font-extrabold text-primary-foreground text-center animate-fade-in-up">
          Your Healing Journey
        </h1>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Streaks Card */}
          <Card className="bg-card/70 backdrop-blur-sm text-card-foreground shadow-lg animate-fade-in-left">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Healing Streaks</CardTitle>
              <CardDescription>Consistency is key to healing.</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-5xl font-extrabold text-primary">
              {streaks}
              <span className="text-xl text-card-foreground ml-2">days</span>
            </CardContent>
          </Card>

          {/* Mood Summary Card */}
          <Card className="bg-card/70 backdrop-blur-sm text-card-foreground shadow-lg animate-fade-in-right">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Mood Summary</CardTitle>
              <CardDescription>Your emotional landscape over time.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap justify-center gap-2">
              {Object.entries(moodFrequency).length > 0 ? (
                Object.entries(moodFrequency)
                  .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
                  .map(([mood, count]) => (
                    <div
                      key={mood}
                      className={`flex items-center space-x-1 p-2 rounded-lg ${getMoodColorClass(mood)}`}
                    >
                      <span className="font-medium capitalize">{mood}</span>
                      <span className="text-sm opacity-70">({count})</span>
                    </div>
                  ))
              ) : (
                <p className="text-muted-foreground">No entries yet. Start journaling to see your moods!</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Interactive Emotional Landscape */}
        <Card className="w-full max-w-4xl bg-card/70 backdrop-blur-sm text-card-foreground shadow-lg animate-fade-in-up">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Your Emotional Weather</CardTitle>
            <CardDescription>Visualize your current emotional state.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 sm:h-80 md:h-96 w-full flex items-center justify-center p-0">
            <WeatherAnimation mood={dominantMoodForLandscape} emotionScale={currentEmotionScale} />
          </CardContent>
        </Card>

        {/* Calendar Card */}
        <Card className="w-full max-w-4xl bg-card/70 backdrop-blur-sm text-card-foreground shadow-lg animate-fade-in-down">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Journal History</CardTitle>
            <CardDescription>Browse your past reflections.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDayClick}
              className="rounded-md border bg-background text-foreground"
            />
            {selectedDate && (
              <div className="mt-4 text-center text-lg">
                You selected: <span className="font-bold">{selectedDate.toDateString()}</span>
              </div>
            )}
            <Separator className="my-4 w-full" />
            <Button onClick={() => navigate('/journal')} className="w-full">
              View All Journal Entries
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Call to Action for New Entry */}
        <div className="w-full max-w-md text-center animate-fade-in-up">
          <Button
            onClick={() => navigate('/journal-prompt')}
            className="w-full text-lg py-3 px-6 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <PlusCircle className="mr-3 h-6 w-6" />
            Start a New Journal Entry
          </Button>
        </div>

        <p className="text-center text-muted-foreground mt-8 text-sm max-w-md">
          {getEncouragementMessage()}
        </p>
      </div>
    </PageContainer>
  );
};

export default HealingTracker;
