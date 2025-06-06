
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Mic, Square, Play, Pause, RotateCcw } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import BottomNavigation from '@/components/BottomNavigation';
import HealingAvatar from '@/components/HealingAvatar';
import RecordingIndicator from '@/components/RecordingIndicator';
import PostRecordingFlow from '@/components/PostRecordingFlow';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { useTranscription } from '@/hooks/useTranscription';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { DailyPrompt, MoodType, JournalEntry } from '@/types';
import { cn } from '@/lib/utils';

const VoiceJournal = () => {
  const navigate = useNavigate();
  const [currentPrompt, setCurrentPrompt] = useState<DailyPrompt | null>(null);
  const [selectedMood, setSelectedMood] = useState<MoodType>('neutral');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPostRecording, setIsPostRecording] = useState(false);
  
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

  const {
    transcript,
    confidence,
    isProcessing,
    generateTranscript,
    updateTranscript,
    clearTranscript
  } = useTranscription();

  const { saveAudio } = useIndexedDB();

  useEffect(() => {
    // Load the selected prompt from DailyPrompt page
    const savedPrompt = localStorage.getItem('healbit-current-prompt');
    if (savedPrompt) {
      setCurrentPrompt(JSON.parse(savedPrompt));
    }
  }, []);

  const handleStopRecording = async () => {
    stopRecording();
    setIsPostRecording(true);
    
    // Generate transcript after recording stops
    if (duration > 0) {
      try {
        await generateTranscript(duration);
      } catch (error) {
        console.error('Failed to generate transcript:', error);
      }
    }
  };

  const handleSave = async () => {
    if (audioUrl) {
      try {
        const entryId = Date.now().toString();
        
        // Convert audio URL to blob for IndexedDB storage
        const response = await fetch(audioUrl);
        const audioBlob = await response.blob();
        
        // Save audio to IndexedDB
        await saveAudio(entryId, audioBlob);
        
        // Save journal entry to localStorage
        const entry: JournalEntry = {
          id: entryId,
          date: new Date().toISOString(),
          promptId: currentPrompt?.id || '',
          audioUrl, // Keep for immediate playback
          transcript,
          transcriptConfidence: confidence,
          mood: selectedMood,
          emotions: selectedTags,
          duration,
          processingComplete: true,
          hasAudio: true
        };

        const savedEntries = JSON.parse(localStorage.getItem('healbit-journal-entries') || '[]');
        savedEntries.push(entry);
        localStorage.setItem('healbit-journal-entries', JSON.stringify(savedEntries));
        
        // Store current mood and navigate to affirmation
        localStorage.setItem('healbit-session-mood', selectedMood);
        localStorage.setItem('healbit-session-emotions', JSON.stringify(selectedTags));
        navigate('/affirmation');
      } catch (error) {
        console.error('Failed to save entry:', error);
      }
    }
  };

  const handleStartOver = () => {
    clearRecording();
    clearTranscript();
    setSelectedTags([]);
    setIsPostRecording(false);
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

      {!isPostRecording ? (
        <>
          {/* Recording Interface */}
          <div className="text-center mb-6 space-y-6">
            <div className="relative">
              <HealingAvatar mood={selectedMood} size="lg" className="mx-auto" />
              {isRecording && (
                <RecordingIndicator
                  isRecording={isRecording}
                  size="lg"
                  className="absolute inset-0"
                />
              )}
            </div>
            
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
                  className="rounded-full w-20 h-20 bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                >
                  <Mic className="w-8 h-8" />
                </Button>
              )}

              {isRecording && (
                <Button
                  onClick={handleStopRecording}
                  size="lg"
                  variant="destructive"
                  className="rounded-full w-20 h-20 animate-pulse"
                >
                  <Square className="w-8 h-8" />
                </Button>
              )}

              {audioUrl && !isRecording && (
                <>
                  <Button
                    onClick={isPlaying ? stopPlaying : playRecording}
                    size="lg"
                    variant="outline"
                    className="rounded-full w-16 h-16"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>
                  
                  <Button
                    onClick={handleStartOver}
                    size="lg"
                    variant="outline"
                    className="rounded-full w-16 h-16"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </Button>
                </>
              )}
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                {error}
              </p>
            )}
          </div>

          {/* Mood Selection */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-3">How are you feeling?</h3>
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
        </>
      ) : (
        <PostRecordingFlow
          transcript={transcript}
          confidence={confidence}
          isProcessing={isProcessing}
          mood={selectedMood}
          selectedTags={selectedTags}
          onTranscriptChange={updateTranscript}
          onTagsChange={setSelectedTags}
          onSave={handleSave}
          className="mb-6"
        />
      )}

      <BottomNavigation />
    </PageContainer>
  );
};

export default VoiceJournal;
