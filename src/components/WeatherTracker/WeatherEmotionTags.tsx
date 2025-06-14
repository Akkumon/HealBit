
import React from 'react';
import { MoodType } from '@/types';
import { cn } from '@/lib/utils';

interface WeatherEmotionTagsProps {
  selectedMood: MoodType;
  onMoodSelect?: (mood: MoodType) => void;
  className?: string;
}

const WeatherEmotionTags: React.FC<WeatherEmotionTagsProps> = ({
  selectedMood,
  onMoodSelect,
  className
}) => {
  const weatherEmotions = [
    { mood: 'joy' as MoodType, label: 'Sunny', icon: '☀️', bgColor: 'bg-yellow-400/80' },
    { mood: 'calm' as MoodType, label: 'Clear', icon: '🌤️', bgColor: 'bg-blue-400/80' },
    { mood: 'hope' as MoodType, label: 'Bright', icon: '⛅', bgColor: 'bg-green-400/80' },
    { mood: 'neutral' as MoodType, label: 'Cloudy', icon: '☁️', bgColor: 'bg-gray-400/80' },
    { mood: 'sadness' as MoodType, label: 'Rainy', icon: '🌧️', bgColor: 'bg-blue-500/80' },
    { mood: 'anger' as MoodType, label: 'Stormy', icon: '⛈️', bgColor: 'bg-gray-700/80' },
  ];

  return (
    <div className={cn('flex flex-wrap gap-2 justify-center', className)}>
      {weatherEmotions.map(({ mood, label, icon, bgColor }) => (
        <button
          key={mood}
          onClick={() => onMoodSelect?.(mood)}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm font-medium text-white/90 transition-all duration-200 hover:scale-105 active:scale-95',
            bgColor,
            selectedMood === mood 
              ? 'ring-2 ring-white/50 shadow-lg' 
              : 'hover:shadow-md'
          )}
        >
          <span className="mr-1">{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
};

export default WeatherEmotionTags;
