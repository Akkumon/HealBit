
import React from 'react';
import { cn } from '@/lib/utils';
import { MoodType } from '@/types';
import AnimatedSky from './AnimatedSky';
import NimbusCompanion from './NimbusCompanion';
import WeatherEmotionTags from './WeatherEmotionTags';

interface WeatherTrackerProps {
  mood?: MoodType;
  onMoodChange?: (mood: MoodType) => void;
  className?: string;
  compact?: boolean;
}

const WeatherTracker: React.FC<WeatherTrackerProps> = ({
  mood = 'neutral',
  onMoodChange,
  className,
  compact = false
}) => {
  const getWeatherState = (mood: MoodType) => {
    switch (mood) {
      case 'anger':
        return 'storm';
      case 'sadness':
        return 'rainy';
      case 'neutral':
        return 'cloudy';
      case 'calm':
      case 'hope':
        return 'partlySunny';
      case 'joy':
        return 'sunny';
      default:
        return 'cloudy';
    }
  };

  const weatherState = getWeatherState(mood);

  return (
    <div className={cn(
      'relative rounded-xl overflow-hidden border border-border/20 backdrop-blur-sm',
      compact ? 'h-48' : 'h-64 md:h-80',
      className
    )}>
      {/* Animated Sky Background */}
      <AnimatedSky weatherState={weatherState} />
      
      {/* Nimbus Cloud Companion */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
        <NimbusCompanion mood={mood} weatherState={weatherState} />
      </div>
      
      {/* Weather Title */}
      <div className="absolute top-4 left-4 text-white/90 z-10">
        <h3 className="text-lg font-semibold">Inner Forecast</h3>
        <p className="text-sm opacity-80 capitalize">{weatherState.replace(/([A-Z])/g, ' $1').trim()}</p>
      </div>
      
      {/* Emotion Tags Interface */}
      {!compact && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <WeatherEmotionTags
            selectedMood={mood}
            onMoodSelect={onMoodChange}
          />
        </div>
      )}
    </div>
  );
};

export default WeatherTracker;
