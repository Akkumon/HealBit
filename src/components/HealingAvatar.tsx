import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

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
  const { isDark } = useTheme();
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  // Theme-aware mood colors
  const moodColors = {
    light: {
      joy: 'from-yellow-300 to-orange-300',
      calm: 'from-blue-300 to-cyan-300',
      hope: 'from-green-300 to-teal-300',
      sadness: 'from-blue-400 to-indigo-400',
      anger: 'from-red-300 to-pink-300',
      neutral: 'from-gray-300 to-gray-400'
    },
    dark: {
      joy: 'from-yellow-400 to-orange-400',
      calm: 'from-blue-400 to-cyan-400',
      hope: 'from-green-400 to-teal-400',
      sadness: 'from-blue-500 to-indigo-500',
      anger: 'from-red-400 to-pink-400',
      neutral: 'from-gray-400 to-gray-500'
    }
  };

  const currentMoodColors = moodColors[isDark ? 'dark' : 'light'];

  return (
    <div className={cn(
      'relative flex items-center justify-center',
      sizeClasses[size],
      className
    )}>
      {/* Avatar body */}
      <div className={cn(
        'rounded-full bg-gradient-to-br transition-all duration-1000 ease-in-out breathe',
        currentMoodColors[mood],
        sizeClasses[size]
      )}>
        {/* Avatar face */}
        <div className="absolute inset-4 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
          {/* Eyes */}
          <div className="flex space-x-2">
            <div className={cn(
              'w-2 h-2 rounded-full opacity-80',
              isDark ? 'bg-gray-100' : 'bg-white'
            )}></div>
            <div className={cn(
              'w-2 h-2 rounded-full opacity-80',
              isDark ? 'bg-gray-100' : 'bg-white'
            )}></div>
          </div>
        </div>
      </div>
      
      {/* Healing aura - Enhanced for dark mode */}
      <div className={cn(
        'absolute inset-0 rounded-full bg-gradient-to-br gentle-pulse',
        currentMoodColors[mood],
        isDark ? 'opacity-40' : 'opacity-30'
      )} style={{ 
        filter: `blur(8px) ${isDark ? 'brightness(1.2)' : ''}` 
      }}></div>
    </div>
  );
};

export default HealingAvatar;