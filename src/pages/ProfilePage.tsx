import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Settings, Heart, Calendar, TrendingUp } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import BottomNavigation from '@/components/BottomNavigation';
import AvatarRenderer from '@/components/AvatarRenderer';
import { MoodType, UserProfile, JournalEntry } from '@/types';
import { useAvatarEvolution } from '@/hooks/useAvatarEvolution';
import { useIndexedDB } from '@/hooks/useIndexedDB';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { evolution } = useAvatarEvolution();
  const { getJournalEntries } = useIndexedDB();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    avatar: {
      primaryColor: '#6D83F2',
      animationStyle: 'gentle',
      size: 'md'
    },
    joinDate: new Date().toISOString(),
    totalEntries: 0,
    currentStreak: 0,
    longestStreak: 0
  });
  const [avatarMood, setAvatarMood] = useState<MoodType>('calm');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        // Load profile data
        const savedProfile = localStorage.getItem('healbit-user-profile');
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }

        // Load stats from IndexedDB
        const entries = await getJournalEntries();
        const lastMood = localStorage.getItem('healbit-last-mood') as MoodType;
        
        setProfile(prev => ({
          ...prev,
          totalEntries: entries.length
        }));

        if (lastMood) {
          setAvatarMood(lastMood);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [getJournalEntries]);

  const handleNameChange = (name: string) => {
    const updatedProfile = { ...profile, name };
    setProfile(updatedProfile);
    localStorage.setItem('healbit-user-profile', JSON.stringify(updatedProfile));
    localStorage.setItem('healbit-user-name', name);
  };

  const moodStats = async () => {
    try {
      const entries = await getJournalEntries();
      const moodCounts: Record<MoodType, number> = {
        joy: 0, calm: 0, hope: 0, neutral: 0, sadness: 0, anger: 0
      };

      entries.forEach((entry: JournalEntry) => {
        if (entry.mood) {
          moodCounts[entry.mood]++;
        }
      });

      return moodCounts;
    } catch (error) {
      console.error('Error calculating mood stats:', error);
      return { joy: 0, calm: 0, hope: 0, neutral: 0, sadness: 0, anger: 0 };
    }
  };

  const [stats, setStats] = useState<Record<MoodType, number>>({
    joy: 0, calm: 0, hope: 0, neutral: 0, sadness: 0, anger: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      const moodData = await moodStats();
      setStats(moodData);
    };
    loadStats();
  }, []);

  const totalMoodEntries = Object.values(stats).reduce((a, b) => a + b, 0);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading your profile...</p>
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
        <h1 className="text-xl font-semibold text-foreground">Your Profile</h1>
        <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Avatar & Name */}
      <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-center">
        <CardContent className="pt-6 space-y-4">
          <AvatarRenderer 
            mood={avatarMood} 
            evolution={evolution}
            size="lg" 
            className="mx-auto" 
          />
          
          <div>
            <input
              type="text"
              placeholder="Enter your name"
              value={profile.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="text-xl font-semibold text-center bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              maxLength={20}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Healing since {new Date(profile.joinDate).toLocaleDateString()}
            </p>
          </div>

          {/* Evolution Stats */}
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">
                {Math.round(evolution.complexity * 100)}%
              </div>
              <p className="text-muted-foreground">Growth</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-accent-foreground">
                {Math.round(evolution.glowIntensity * 100)}%
              </div>
              <p className="text-muted-foreground">Consistency</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journey Stats */}
      <Card className="mb-6 border-primary/20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Your Journey
          </CardTitle>
          <CardDescription>Every step counts in your healing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{profile.totalEntries}</div>
              <p className="text-xs text-muted-foreground">Entries</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent-foreground">{profile.currentStreak}</div>
              <p className="text-xs text-muted-foreground">Current Streak</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-hope">{profile.longestStreak}</div>
              <p className="text-xs text-muted-foreground">Best Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mood Patterns */}
      <Card className="mb-6 border-accent/20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Emotion Patterns
          </CardTitle>
          <CardDescription>How you've been feeling lately</CardDescription>
        </CardHeader>
        <CardContent>
          {totalMoodEntries === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Start journaling to see your patterns
            </p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats).map(([mood, count]) => {
                const percentage = totalMoodEntries > 0 ? (count / totalMoodEntries) * 100 : 0;
                if (percentage === 0) return null;
                
                return (
                  <div key={mood} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{mood}</span>
                      <span>{count} times</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Avatar Mood Selector */}
      <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Avatar Mood</CardTitle>
          <CardDescription>How is your avatar feeling today?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-3 flex-wrap gap-2">
            {(['joy', 'calm', 'hope', 'neutral', 'sadness'] as const).map((mood) => (
              <button
                key={mood}
                onClick={() => setAvatarMood(mood)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  avatarMood === mood ? 'scale-110 ring-2 ring-primary ring-offset-2' : 'hover:scale-105'
                }`}
              >
                <AvatarRenderer 
                  mood={mood} 
                  evolution={evolution}
                  size="sm" 
                />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <BottomNavigation />
    </PageContainer>
  );
};

export default ProfilePage;