
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RotateCcw, ArrowRight } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import BottomNavigation from '@/components/BottomNavigation';
import { DailyPrompt as DailyPromptType } from '@/types';

const prompts: DailyPromptType[] = [
  {
    id: '1',
    category: 'gratitude',
    text: "What's one small thing that brought you comfort today?",
    followUp: "Even the smallest moments of comfort matter in healing."
  },
  {
    id: '2',
    category: 'self-compassion',
    text: "How would you comfort a dear friend going through what you're experiencing?",
    followUp: "You deserve the same kindness you'd give to others."
  },
  {
    id: '3',
    category: 'growth',
    text: "What's one way you've grown stronger since this journey began?",
    followUp: "Healing happens in ways we don't always immediately see."
  },
  {
    id: '4',
    category: 'reflection',
    text: "How are you feeling right now, without judgment?",
    followUp: "All feelings are valid and temporary."
  },
  {
    id: '5',
    category: 'hope',
    text: "What's one thing you're looking forward to, however small?",
    followUp: "Hope can be found in the smallest of moments."
  },
  {
    id: '6',
    category: 'processing',
    text: "What would you like to release or let go of today?",
    followUp: "Letting go is an act of courage, not giving up."
  },
  {
    id: '7',
    category: 'strength',
    text: "What's one thing you did today that took courage?",
    followUp: "Every small act of courage builds your strength."
  }
];

const DailyPrompt = () => {
  const navigate = useNavigate();
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [selectedPrompt, setSelectedPrompt] = useState<DailyPromptType>(prompts[0]);

  useEffect(() => {
    // Use day of year to get consistent daily prompt
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const dailyIndex = dayOfYear % prompts.length;
    setCurrentPromptIndex(dailyIndex);
    setSelectedPrompt(prompts[dailyIndex]);
  }, []);

  const handleSkip = () => {
    const nextIndex = (currentPromptIndex + 1) % prompts.length;
    setCurrentPromptIndex(nextIndex);
    setSelectedPrompt(prompts[nextIndex]);
  };

  const handleContinue = () => {
    // Store selected prompt for the journal session
    localStorage.setItem('healbit-current-prompt', JSON.stringify(selectedPrompt));
    navigate('/journal');
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">Today's Reflection</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <Card className="mb-6 border-primary/20 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-primary capitalize">
            {selectedPrompt.category.replace('-', ' ')}
          </CardTitle>
          <CardDescription>
            Take your time with this reflection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground font-medium text-lg leading-relaxed">
            "{selectedPrompt.text}"
          </p>
          {selectedPrompt.followUp && (
            <p className="text-muted-foreground text-sm italic">
              {selectedPrompt.followUp}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Button 
          onClick={handleContinue}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          Continue to Recording
        </Button>

        <Button 
          variant="outline" 
          onClick={handleSkip}
          className="w-full border-accent/30 text-accent-foreground h-12"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Try Different Prompt
        </Button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          💫 There's no right or wrong way to reflect
        </p>
      </div>

      <BottomNavigation />
    </PageContainer>
  );
};

export default DailyPrompt;
