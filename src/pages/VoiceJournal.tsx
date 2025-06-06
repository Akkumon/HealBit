
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mic, Square, Play, Pause, Save, RotateCcw } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import BottomNavigation from '@/components/BottomNavigation';
import HealingAvatar from '@/components/HealingAvatar';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { DailyPrompt, MoodType } from '@/types';
import { cn } from '@/lib/utils';

const VoiceJournal = () => {
  const navigate = useNavigate();
  const [currentPrompt, setCurrentPrompt] = useState<DailyPrompt | null>(null);
  const [selectedMood, setSelectedMood] = useState<MoodType>('neutral');
  const [transcript, setTranscript] = useState('');
  
  const {
    isRecording,
    isPlaying,
    audioUrl,
    duration,
    error,
    startRecording,
    stopRecording,
    playRecording,
    stopPlaying,
    clearRecording,
    formatDuration
  } = useAudioRecording();

  useEffect(() => {
    // Load the selected prompt from DailyPrompt page
    const savedPrompt = localStorage.getItem('healbit-current-prompt');
    if (savedPrompt) {
      setCurrentPrompt(JSON.parse(savedPrompt));
    }
  }, []);

  const handleSave = () => {
    if (audioUrl) {
      // Save journal entry to localStorage
      const entry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        promptId: currentPrompt?.id || '',
        audioUrl,
        transcript,
        mood: selectedMood,
        emotions: [],
        duration
      };

      const savedEntries = JSON.parse(localStorage.getItem('healbit-journal-entries') || '[]');
      savedEntries.push(entry);
      localStorage.setItem('healbit-journal-entries', JSON.stringify(savedEntries));
      
      // Store current mood and navigate to affirmation
      localStorage.setItem('healbit-session-mood', selectedMood);
      navigate('/affirmation');
    }
  };

  const moods: { mood: MoodType; label: string; emoji: string }[] = [
    { mood: 'joy', label: 'Joyful', emoji: '😊' },
    { mood: 'calm', label: 'Calm', emoji: '😌' },
    { mood: 'hope', label: 'Hopeful', emoji: '🌟' },
    { mood: 'neutral', label: 'Neutral', emoji: '😐' },
    { mood: 'sadness', label: 'Sad', emoji: '😢' },
    { mood: 'anger', label: 'Angry', emoji: '😤' },
  ];

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/prompt')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">Voice Journal</h1>
        <div className="w-10" />
      </div>

      {currentPrompt && (
        <Card className="mb-6 border-primary/20 bg-white/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <p className="text-foreground font-medium leading-relaxed">
              "{currentPrompt.text}"
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recording Interface */}
      <div className="text-center mb-6 space-y-4">
        <HealingAvatar mood={selectedMood} size="lg" className="mx-auto" />
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {isRecording ? 'Recording...' : 'Ready to record'}
          </p>
          <p className="text-lg font-mono text-foreground">
            {formatDuration(duration)}
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          {!isRecording && !audioUrl && (
            <Button
              onClick={startRecording}
              size="lg"
              className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90"
            >
              <Mic className="w-6 h-6" />
            </Button>
          )}

          {isRecording && (
            <Button
              onClick={stopRecording}
              size="lg"
              variant="destructive"
              className="rounded-full w-16 h-16"
            >
              <Square className="w-6 h-6" />
            </Button>
          )}

          {audioUrl && !isRecording && (
            <>
              <Button
                onClick={isPlaying ? stopPlaying : playRecording}
                size="lg"
                variant="outline"
                className="rounded-full w-12 h-12"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              
              <Button
                onClick={clearRecording}
                size="lg"
                variant="outline"
                className="rounded-full w-12 h-12"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>

      {/* Mood Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">How are you feeling?</CardTitle>
          <CardDescription>Select your current mood</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {moods.map(({ mood, label, emoji }) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={cn(
                  'p-3 rounded-lg border-2 transition-all flex flex-col items-center space-y-1',
                  selectedMood === mood
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <span className="text-lg">{emoji}</span>
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      {audioUrl && (
        <Button 
          onClick={handleSave}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
        >
          <Save className="w-4 h-4 mr-2" />
          Save & Continue
        </Button>
      )}

      <BottomNavigation />
    </PageContainer>
  );
};

export default VoiceJournal;
