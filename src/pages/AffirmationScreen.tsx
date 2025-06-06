
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Home, TrendingUp } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import HealingAvatar from '@/components/HealingAvatar';
import { MoodType, Affirmation } from '@/types';

const affirmations: Affirmation[] = [
  {
    id: '1',
    mood: 'joy',
    text: "Your joy is returning, and it's beautiful to witness. This feeling is yours to keep.",
    category: 'celebration'
  },
  {
    id: '2',
    mood: 'calm',
    text: "In this moment of peace, you're exactly where you need to be. Trust this feeling.",
    category: 'presence'
  },
  {
    id: '3',
    mood: 'hope',
    text: "Hope is your inner light growing brighter. You're moving toward something beautiful.",
    category: 'future'
  },
  {
    id: '4',
    mood: 'neutral',
    text: "Feeling neutral is also healing. You're giving yourself space to just be.",
    category: 'acceptance'
  },
  {
    id: '5',
    mood: 'sadness',
    text: "Your tears water the seeds of your strength. This sadness will transform into wisdom.",
    category: 'transformation'
  },
  {
    id: '6',
    mood: 'anger',
    text: "Your anger shows how much you value yourself. Channel this energy into your healing.",
    category: 'empowerment'
  }
];

const AffirmationScreen = () => {
  const navigate = useNavigate();
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);
  const [sessionMood, setSessionMood] = useState<MoodType>('neutral');

  useEffect(() => {
    // Get the mood from the journal session
    const mood = localStorage.getItem('healbit-session-mood') as MoodType || 'neutral';
    setSessionMood(mood);
    
    // Find matching affirmation
    const matchingAffirmation = affirmations.find(a => a.mood === mood);
    setCurrentAffirmation(matchingAffirmation || affirmations[3]); // fallback to neutral
  }, []);

  if (!currentAffirmation) {
    return null;
  }

  return (
    <PageContainer showNavigation={false}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
        <HealingAvatar mood={sessionMood} size="lg" className="animate-scale-in" />
        
        <Card className="border-primary/20 bg-white/80 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-8 space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            
            <p className="text-lg font-medium text-foreground leading-relaxed">
              {currentAffirmation.text}
            </p>
            
            <p className="text-sm text-muted-foreground italic">
              — A gentle reminder for your healing journey
            </p>
          </CardContent>
        </Card>

        <div className="space-y-3 w-full max-w-sm">
          <Button 
            onClick={() => navigate('/tracker')}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Your Progress
          </Button>
          
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full h-12"
          >
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-8">
          Take a moment to let this settle in your heart 💝
        </p>
      </div>
    </PageContainer>
  );
};

export default AffirmationScreen;
