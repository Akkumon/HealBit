
import React from 'react';
import { cn } from '@/lib/utils';

interface RecordingIndicatorProps {
  isRecording: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RecordingIndicator: React.FC<RecordingIndicatorProps> = ({
  isRecording,
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  const pulseSize = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28', 
    lg: 'w-32 h-32'
  };

  if (!isRecording) return null;

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Outer pulse rings */}
      <div className={cn(
        'absolute rounded-full bg-primary/20 animate-ping',
        pulseSize[size]
      )} style={{ animationDelay: '0s' }} />
      <div className={cn(
        'absolute rounded-full bg-primary/15 animate-ping',
        pulseSize[size]
      )} style={{ animationDelay: '0.5s' }} />
      
      {/* Inner pulse */}
      <div className={cn(
        'absolute rounded-full bg-primary/30 animate-pulse',
        sizeClasses[size]
      )} />
      
      {/* Center dot */}
      <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
    </div>
  );
};

export default RecordingIndicator;
