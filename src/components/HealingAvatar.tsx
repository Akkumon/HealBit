
import React from 'react';
import { cn } from '@/lib/utils';

interface HealingAvatarProps {
  mood?: 'joy' | 'calm' | 'hope' | 'sadness' | 'anger' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const HealingAvatar: React.FC<HealingAvatarProps> = ({ 
  mood = 'neutral', 
  size = 'md',
  className 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const moodColors = {
    joy: 'from-yellow-300 to-orange-300',
    calm: 'from-blue-300 to-cyan-300',
    hope: 'from-green-300 to-teal-300',
    sadness: 'from-blue-400 to-indigo-400',
    anger: 'from-red-300 to-pink-300',
    neutral: 'from-gray-300 to-gray-400'
  };

  return (
    <div className={cn(
      'relative flex items-center justify-center',
      sizeClasses[size],
      className
    )}>
      {/* Avatar body */}
      <div className={cn(
        'rounded-full bg-gradient-to-br transition-all duration-1000 ease-in-out breathe',
        moodColors[mood],
        sizeClasses[size]
      )}>
        {/* Avatar face */}
        <div className="absolute inset-4 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
          {/* Eyes */}
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
            <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
          </div>
        </div>
      </div>
      
      {/* Healing aura */}
      <div className={cn(
        'absolute inset-0 rounded-full bg-gradient-to-br opacity-30 gentle-pulse',
        moodColors[mood]
      )} style={{ filter: 'blur(8px)' }}></div>
    </div>
  );
};

export default HealingAvatar;
