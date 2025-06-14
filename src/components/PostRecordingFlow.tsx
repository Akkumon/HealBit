
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Play, Pause, RotateCcw } from 'lucide-react';
import EmotionTagSelector from './EmotionTagSelector';
import TranscriptDisplay from './TranscriptDisplay';
import { MoodType } from '@/types';
import { cn } from '@/lib/utils';

interface PostRecordingFlowProps {
  audioBlob: Blob | null;
  transcript: string;
  isTranscribing: boolean;
  onSave: (tags: string[], mood: MoodType) => void;
  onStartOver: () => void;
  className?: string;
}

const PostRecordingFlow: React.FC<PostRecordingFlowProps> = ({
  audioBlob,
  transcript,
  isTranscribing,
  onSave,
  className
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentMood, setCurrentMood] = useState<MoodType>('neutral');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [audioBlob]);

  const handlePlayback = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
      }
    }
  };

  const handleSave = () => {
    onSave(selectedTags, currentMood);
  };

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Your Recording
          </CardTitle>
          <CardDescription>
            Review your voice journal entry
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {audioUrl && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayback}
                className="flex items-center gap-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Play Recording'}
              </Button>
            </div>
          )}
          
          <TranscriptDisplay 
            transcript={transcript}
            isLoading={isTranscribing}
          />
        </CardContent>
      </Card>

      <EmotionTagSelector
        mood={currentMood}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
      />

      <div className="flex gap-3">
        <Button onClick={handleSave} className="flex-1">
          Save Entry
        </Button>
      </div>
    </div>
  );
};

export default PostRecordingFlow;
