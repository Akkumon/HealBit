import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Mic, TrendingUp, Settings } from 'lucide-react';
import Orb from '../../journaling page/Orb/Orb';
import BottomNavigation from '@/components/BottomNavigation';
import PageContainer from '@/components/PageContainer';
import { MoodType, JournalEntry } from '@/types';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { cn } from '@/lib/utils';

const Homescreen = () => {
  const navigate = useNavigate();
  const [currentMood, setCurrentMood] = useState<MoodType>('neutral');
  const [userName, setUserName] = useState<string>('');
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { getJournalEntries } = useIndexedDB();

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Load user preferences from localStorage
        const savedName = localStorage.getItem('healbit-user-name');
        const savedMood = localStorage.getItem('healbit-last-mood') as MoodType;
        
        if (savedName) setUserName(savedName);
        if (savedMood) setCurrentMood(savedMood);

        // Load entry count from IndexedDB
        const entries = await getJournalEntries();
        setTotalEntries(entries.length);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [getJournalEntries]);

  const dailyPrompts = [
    "What's one small thing that brought you comfort today?",
    "How are you feeling right now, without judgment?",
    "What would you tell a friend going through what you're experiencing?",
    "What's one thing you're grateful for in this moment?",
    "How has your heart grown stronger recently?"
  ];

  const todayPrompt = dailyPrompts[new Date().getDay() % dailyPrompts.length];

  const handleStartJournal = () => {
    localStorage.setItem('healbit-session-mood', currentMood);
    navigate('/prompt');
  };

  const handleViewProgress = () => {
    navigate('/tracker');
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">HealBit</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-8">
        {/* <HealingAvatar mood={currentMood} size="lg" className="mx-auto mb-6" /> */}
        <div className="mx-auto mb-6 w-fit">
          <Orb 
            forceHoverState={false} 
            hue={currentMood === 'joy' ? 45 : currentMood === 'calm' ? 200 : currentMood === 'hope' ? 120 : currentMood === 'sadness' ? 210 : currentMood === 'anger' ? 0 : 0} 
            innerRadius={currentMood === 'joy' ? 0.7 : currentMood === 'calm' ? 0.6 : currentMood === 'hope' ? 0.65 : currentMood === 'sadness' ? 0.5 : currentMood === 'anger' ? 0.4 : 0.6}
            noiseScale={currentMood === 'joy' ? 0.5 : currentMood === 'calm' ? 0.7 : currentMood === 'hope' ? 0.6 : currentMood === 'sadness' ? 0.8 : currentMood === 'anger' ? 1.0 : 0.65}
          />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          {userName ? `Welcome back, ${userName}` : 'Begin Your Healing'}
        </h2>
        <p className="text-muted-foreground text-lg mb-6">
          A gentle space for reflection
        </p>
        
        <Button 
          onClick={handleStartJournal}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg h-14"
        >
          <Mic className="w-5 h-5 mr-3" />
          Start Voice Journal
        </Button>
      </div>

      {/* Daily Prompt Preview */}
      <Card className="mb-6 border-primary/20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-primary">Today's Reflection</CardTitle>
          <CardDescription className="text-sm">
            Take a moment to connect with yourself
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-foreground font-medium mb-4 leading-relaxed">
            "{todayPrompt}"
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card 
          className="bg-white/50 dark:bg-gray-800/50 border-accent/30 cursor-pointer hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors"
          onClick={handleViewProgress}
        >
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-accent-foreground" />
            <p className="text-sm font-medium text-accent-foreground">View Progress</p>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-white/50 dark:bg-gray-800/50 border-primary/30 cursor-pointer hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors"
          onClick={() => navigate('/profile')}
        >
          <CardContent className="p-4 text-center">
            <Heart className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium text-primary">Your Profile</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Display */}
      {totalEntries > 0 && (
        <Card className="mb-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{totalEntries}</div>
            <p className="text-sm text-muted-foreground">
              Reflection{totalEntries !== 1 ? 's' : ''} recorded
            </p>
          </CardContent>
        </Card>
      )}

      {/* Gentle Reminder */}
      <div className="bg-accent/10 dark:bg-accent/20 rounded-lg p-4 text-center mb-6">
        <p className="text-sm text-accent-foreground">
          💝 Remember: Healing isn't linear. Every small step counts.
        </p>
      </div>

      {/* Mood Check-in */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-foreground mb-3 text-center">
          How are you feeling?
        </h3>
        <div className="flex justify-center flex-wrap gap-4">
          {(['joy', 'calm', 'hope', 'neutral', 'sadness', 'anger'] as const).map((mood) => (
            <button
              key={mood}
              onClick={() => {
                setCurrentMood(mood);
                localStorage.setItem('healbit-last-mood', mood);
              }}
              className={cn(
                'w-24 h-24 rounded-lg transition-all duration-200 flex flex-col items-center justify-center space-y-1 p-2',
                currentMood === mood ? 'border-2 border-primary animate-pop-selection' : 'hover:scale-105'
              )}
            >
              <div className="w-16 h-16">
                <Orb 
                  forceHoverState={currentMood === mood} 
                  hue={mood === 'joy' ? 45 : mood === 'calm' ? 200 : mood === 'hope' ? 120 : mood === 'sadness' ? 210 : mood === 'anger' ? 0 : 0}
                  innerRadius={mood === 'joy' ? 0.7 : mood === 'calm' ? 0.6 : mood === 'hope' ? 0.65 : mood === 'sadness' ? 0.5 : mood === 'anger' ? 0.4 : 0.6}
                  noiseScale={mood === 'joy' ? 0.5 : mood === 'calm' ? 0.7 : mood === 'hope' ? 0.6 : mood === 'sadness' ? 0.8 : mood === 'anger' ? 1.0 : 0.65}
                />
              </div>
              <span className="text-xs font-medium capitalize text-foreground">
                {mood === 'joy' ? '😊 Joy' : mood === 'calm' ? '😌 Calm' : mood === 'hope' ? '🌟 Hope' : mood === 'sadness' ? '😢 Sad' : mood === 'anger' ? '😤 Angry' : '😐 Neutral'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </PageContainer>
  );
};

export default Homescreen;