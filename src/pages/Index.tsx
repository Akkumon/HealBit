import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Mic, TrendingUp, Settings } from 'lucide-react';
import HealingAvatar from '@/components/HealingAvatar';
import BottomNavigation from '@/components/BottomNavigation';
import PageContainer from '@/components/PageContainer';
import { MoodType } from '@/types';
import { cn } from '@/lib/utils';
import { copies, getUICopy } from '@/utils/copies';

const Index = () => {
  const navigate = useNavigate();
  const [currentMood, setCurrentMood] = useState<MoodType>('neutral');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // Load user preferences from localStorage
    const savedName = localStorage.getItem('healbit-user-name');
    const savedMood = localStorage.getItem('healbit-last-mood') as MoodType;
    
    if (savedName) setUserName(savedName);
    if (savedMood) setCurrentMood(savedMood);
  }, []);

  const dailyPrompts = [
    "What's one small thing that brought you comfort today?",
    "How are you feeling right now, without judgment?",
    "What would you tell a friend going through what you're experiencing?",
    "What's one thing you're grateful for in this moment?",
    "How has your heart grown stronger recently?"
  ];

  const todayPrompt = dailyPrompts[new Date().getDay() % dailyPrompts.length];

  const handleStartJournal = () => {
    navigate('/prompt');
  };

  const handleViewProgress = () => {
    navigate('/tracker');
  };

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
        <HealingAvatar mood={currentMood} size="lg" className="mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-foreground mb-3">
          {userName ? getUICopy('welcome', 'withName', userName) : getUICopy('welcome', 'firstTime')}
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
          {getUICopy('prompts', 'invitation').replace('If you\'d like to share what\'s in your heart today...', 'Start Voice Journal')}
        </Button>
      </div>

      {/* Daily Prompt Preview */}
      <Card className="mb-6 border-primary/20 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-primary">Today's Reflection</CardTitle>
          <CardDescription className="text-sm">
            {getUICopy('prompts', 'gentle')}
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
          className="bg-white/50 border-accent/30 cursor-pointer hover:bg-white/70 transition-colors"
          onClick={handleViewProgress}
        >
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-accent-foreground" />
            <p className="text-sm font-medium text-accent-foreground">View Progress</p>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-white/50 border-primary/30 cursor-pointer hover:bg-white/70 transition-colors"
          onClick={() => navigate('/profile')}
        >
          <CardContent className="p-4 text-center">
            <Heart className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium text-primary">Your Profile</p>
          </CardContent>
        </Card>
      </div>

      {/* Gentle Reminder */}
      <div className="bg-accent/10 rounded-lg p-4 text-center mb-6">
        <p className="text-sm text-accent-foreground">
          💝 Remember: Healing isn't linear. Every small step counts.
        </p>
      </div>

      {/* Mood Check-in */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-foreground mb-3 text-center">
          How are you feeling?
        </h3>
        <div className="flex justify-center space-x-3">
          {(['joy', 'calm', 'hope', 'neutral', 'sadness'] as const).map((mood) => (
            <button
              key={mood}
              onClick={() => {
                setCurrentMood(mood);
                localStorage.setItem('healbit-last-mood', mood);
              }}
              className={cn(
                'w-12 h-12 rounded-full transition-all duration-200',
                currentMood === mood ? 'scale-110 ring-2 ring-primary ring-offset-2' : 'hover:scale-105'
              )}
            >
              <HealingAvatar mood={mood} size="sm" />
            </button>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </PageContainer>
  );
};

export default Index;
