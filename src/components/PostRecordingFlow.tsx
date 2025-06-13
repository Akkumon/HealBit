import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Save } from 'lucide-react';
import TranscriptDisplay from './TranscriptDisplay';
import EmotionTagSelector from './EmotionTagSelector';
import { MoodType } from '@/types';
import { cn } from '@/lib/utils';

interface PostRecordingFlowProps {
  transcript: string;
  confidence: number;
  isProcessing: boolean;
  mood: MoodType;
  emotions: string[];
  onUpdateTranscript: (transcript: string) => void;
  setEmotionTags: (tags: string[]) => void;
  onSave: () => void;
  onStartOver: () => void;
  className?: string;
}

const supportMessages = [
  "Thank you for sharing your thoughts with me. Your voice matters.",
  "I'm proud of you for taking time to reflect. That takes courage.",
  "Your feelings are valid, and you're not alone in this journey.",
  "Thank you for trusting this space with your emotions.",
  "Every reflection is a step forward in your healing journey.",
];

const PostRecordingFlow: React.FC<PostRecordingFlowProps> = ({
  transcript,
  confidence,
  isProcessing,
  mood,
  emotions,
  onUpdateTranscript,
  setEmotionTags,
  onSave,
  onStartOver,
  className
}) => {
  const [currentStep, setCurrentStep] = useState<'transcript' | 'emotions' | 'support'>('transcript');
  const [showSupportMessage, setShowSupportMessage] = useState(false);

  // Auto-advance steps
  useEffect(() => {
    if (!isProcessing && transcript && currentStep === 'transcript') {
      const timer = setTimeout(() => {
        setCurrentStep('emotions');
      }, 2000); // Show transcript for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isProcessing, transcript, currentStep]);

  const handleSave = () => {
    setCurrentStep('support');
    setShowSupportMessage(true);
    setTimeout(() => {
      onSave();
    }, 3000); // Show support message for 3 seconds
  };

  const supportMessage = supportMessages[Math.floor(Math.random() * supportMessages.length)];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Step 1: Transcript Display */}
      {(currentStep === 'transcript' || currentStep === 'emotions') && (
        <TranscriptDisplay
          transcript={transcript}
          confidence={confidence}
          isProcessing={isProcessing}
          onTranscriptChange={onUpdateTranscript}
          className="animate-fade-in"
        />
      )}

      {/* Step 2: Emotion Selection */}
      {currentStep === 'emotions' && !showSupportMessage && (
        <div className="space-y-4 animate-fade-in">
          <EmotionTagSelector
            mood={mood}
            selectedTags={emotions}
            onTagsChange={setEmotionTags}
          />
          
          <Button 
            onClick={handleSave}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
            disabled={emotions.length === 0}
          >
            <Save className="w-4 h-4 mr-2" />
            Save My Reflection
          </Button>
        </div>
      )}

      {/* Step 3: Support Message */}
      {currentStep === 'support' && showSupportMessage && (
        <Card className="animate-scale-in border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-medium text-foreground leading-relaxed">
              {supportMessage}
            </p>
            <div className="w-8 h-1 bg-primary/30 rounded-full mx-auto animate-pulse" />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PostRecordingFlow;
