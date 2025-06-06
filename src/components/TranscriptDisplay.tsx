
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TranscriptDisplayProps {
  transcript: string;
  confidence: number;
  isProcessing: boolean;
  onTranscriptChange: (transcript: string) => void;
  className?: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  transcript,
  confidence,
  isProcessing,
  onTranscriptChange,
  className
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(transcript);
  const [displayedText, setDisplayedText] = useState('');

  // Typewriter effect for transcript reveal
  useEffect(() => {
    if (!transcript || isEditing) return;
    
    setDisplayedText('');
    let index = 0;
    const timer = setInterval(() => {
      setDisplayedText(transcript.slice(0, index + 1));
      index++;
      if (index >= transcript.length) {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [transcript, isEditing]);

  const handleEdit = () => {
    setEditValue(transcript);
    setIsEditing(true);
  };

  const handleSave = () => {
    onTranscriptChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(transcript);
    setIsEditing(false);
  };

  if (isProcessing) {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse mr-2" />
            Processing your voice...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full animate-pulse" />
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!transcript) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Your Reflection</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              {Math.round(confidence * 100)}% confidence
            </span>
            {!isEditing && (
              <Button variant="ghost" size="sm" onClick={handleEdit}>
                <Edit3 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full min-h-[100px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Edit your transcript..."
            />
            <div className="flex space-x-2">
              <Button onClick={handleSave} size="sm">
                <Check className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-foreground leading-relaxed">
            "{displayedText}"
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default TranscriptDisplay;
