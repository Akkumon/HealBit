
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Zap } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import BottomNavigation from '@/components/BottomNavigation';
import SentimentMeter from '@/components/SentimentMeter';
import WeatherAnimation from '@/components/WeatherAnimation';
import { HealingProgress, MoodType } from '@/types';
import { useSentimentAnalysis } from '@/hooks/useSentimentAnalysis';

const HealingTracker = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<HealingProgress[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const { sentimentData, moodToEmotionScale } = useSentimentAnalysis();

  useEffect(() => {
    // Load journal entries and calculate progress
    const entries = JSON.parse(localStorage.getItem('healbit-journal-entries') || '[]');
    setTotalEntries(entries.length);

    // Group entries by date and calculate mood trends
    const progressData: HealingProgress[] = [];
    const entryDates = new Map();

    entries.forEach((entry: any) => {
      const date = new Date(entry.date).toDateString();
      if (!entryDates.has(date)) {
        entryDates.set(date, []);
      }
      entryDates.get(date).push(entry);
    });

    // Convert to progress data
    Array.from(entryDates.entries()).forEach(([date, dayEntries]) => {
      const moods = dayEntries.map((e: any) => e.mood);
      const dominantMood = moods.reduce((a: any, b: any) => 
        moods.filter((v: any) => v === a).length >= moods.filter((v: any) => v === b).length ? a : b
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
    for (let i = progressData.length - 1; i >= 0; i--) {
      if (progressData[i].date === today || streak > 0) {
        streak++;
      } else {
        break;
      }
    }
    setCurrentStreak(streak);
  }, []);

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
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalEntries}</div>
            <p className="text-sm text-muted-foreground">Journal Entries</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent-foreground">{currentStreak}</div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
      </div>

      {/* Weather Timeline */}
      <Card className="mb-6 border-primary/20 bg-white/70 backdrop-blur-sm">
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
              <p className="text-muted-foreground">Start journaling to see your weather patterns</p>
            </div>
          ) : (
            <div className="space-y-3">
              {progress.slice(-7).reverse().map((day, index) => (
                <div key={day.date} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
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
                        {new Date(day.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{day.entryCount} entries</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Encouragement */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6 text-center">
          <Zap className="w-8 h-8 mx-auto mb-3 text-primary" />
          <p className="text-foreground font-medium mb-2">
            {currentStreak > 0 
              ? `Amazing! You're on a ${currentStreak}-day journey!`
              : 'Every storm passes. Your sunny days are coming.'
            }
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
