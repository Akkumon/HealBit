import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Zap, Heart } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import BottomNavigation from '@/components/BottomNavigation';
import SentimentMeter from '@/components/SentimentMeter';
import WeatherAnimation from '@/components/WeatherAnimation';
import { HealingProgress, MoodType, JournalEntry } from '@/types';
import { useSentimentAnalysis } from '@/hooks/useSentimentAnalysis';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

const HealingTracker = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [progress, setProgress] = useState<HealingProgress[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { sentimentData, moodToEmotionScale } = useSentimentAnalysis();
  const { getJournalEntries } = useIndexedDB();

  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true);
      try {
        const entries = await getJournalEntries();
        setTotalEntries(entries.length);

        // Group entries by date and calculate mood trends
        const progressData: HealingProgress[] = [];
        const entryDates = new Map();

        entries.forEach((entry: JournalEntry) => {
          const date = new Date(entry.date).toDateString();
          if (!entryDates.has(date)) {
            entryDates.set(date, []);
          }
          entryDates.get(date).push(entry);
        });

        // Convert to progress data
        Array.from(entryDates.entries()).forEach(([date, dayEntries]) => {
          const moods = dayEntries.map((e: JournalEntry) => e.mood);
          const dominantMood = moods.reduce((a: MoodType, b: MoodType) => 
            moods.filter((v: MoodType) => v === a).length >= moods.filter((v: MoodType) => v === b).length ? a : b
          );

          progressData.push({
            date,
            mood: dominantMood,
            entryCount: dayEntries.length
          });
        });

        progressData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setProgress(progressData);

        // Calculate streak
        let streak = 0;
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
        
        // Check if there's an entry today or yesterday to start the streak
        const hasRecentEntry = progressData.some(p => p.date === today || p.date === yesterday);
        
        if (hasRecentEntry) {
          for (let i = progressData.length - 1; i >= 0; i--) {
            const entryDate = new Date(progressData[i].date);
            const expectedDate = new Date(Date.now() - streak * 24 * 60 * 60 * 1000);
            
            if (entryDate.toDateString() === expectedDate.toDateString()) {
              streak++;
            } else {
              break;
            }
          }
        }
        
        setCurrentStreak(streak);
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [getJournalEntries]);

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
    if (totalEntries === 0) {
      return "Your healing journey begins with the first step. Every voice matters. 🌱";
    }
    
    if (currentStreak === 0) {
      return "Every storm passes. Your sunny days are coming. 🌈";
    }
    
    if (currentStreak === 1) {
      return "Beautiful! You've taken another step in your healing journey. 💝";
    }
    
    if (currentStreak < 7) {
      return `Amazing! You're on a ${currentStreak}-day journey of self-reflection. 🌟`;
    }
    
    return `Incredible! ${currentStreak} days of consistent healing. You're growing so beautifully. 🌸`;
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading your weather patterns...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">Healing Weather</h1>
        <div className="w-10" />
      </div>

      {/* Sentiment Overview */}
      <div className="mb-6">
        <SentimentMeter sentimentData={sentimentData} />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className={cn(
          'transition-all duration-300',
          isDark ? 'bg-gray-800/70 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm'
        )}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{totalEntries}</div>
            <p className="text-sm text-muted-foreground">Reflections</p>
          </CardContent>
        </Card>
        
        <Card className={cn(
          'transition-all duration-300',
          isDark ? 'bg-gray-800/70 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm'
        )}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent-foreground mb-1">{currentStreak}</div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
      </div>

      {/* Weather Timeline */}
      <Card className={cn(
        'mb-6 border-primary/20 transition-all duration-300',
        isDark ? 'bg-gray-800/70 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm'
      )}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Your Weather History
          </CardTitle>
          <CardDescription>
            See how your emotional climate has been changing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {progress.length === 0 ? (
            <div className="text-center py-8">
              <WeatherAnimation emotionScale={3} size="lg" className="mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Start journaling to see your weather patterns</p>
              <p className="text-sm text-muted-foreground">Every reflection helps you understand your emotional seasons</p>
            </div>
          ) : (
            <div className="space-y-3">
              {progress.slice(-7).reverse().map((day, index) => (
                <div 
                  key={day.date} 
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:scale-[1.02]',
                    isDark ? 'bg-gray-700/50' : 'bg-background/50'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <WeatherAnimation 
                      emotionScale={moodToEmotionScale(day.mood)} 
                      size="sm" 
                    />
                    <div>
                      <p className="font-medium text-foreground">
                        {getWeatherDescription(day.mood)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {day.entryCount} reflection{day.entryCount !== 1 ? 's' : ''}
                    </p>
                    {index === 0 && (
                      <p className="text-xs text-primary">Today</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Encouragement */}
      <Card className={cn(
        'border-primary/20 transition-all duration-300',
        isDark 
          ? 'bg-gradient-to-r from-primary/20 to-accent/20' 
          : 'bg-gradient-to-r from-primary/10 to-accent/10'
      )}>
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-3">
            {currentStreak > 0 ? (
              <Zap className="w-8 h-8 text-primary" />
            ) : (
              <Heart className="w-8 h-8 text-primary" />
            )}
          </div>
          <p className="text-foreground font-medium mb-2 leading-relaxed">
            {getEncouragementMessage()}
          </p>
          <p className="text-sm text-muted-foreground">
            Weather changes, and so do feelings. You're doing beautifully.
          </p>
        </CardContent>
      </Card>

      <BottomNavigation />
    </PageContainer>
  );
};

export default HealingTracker;