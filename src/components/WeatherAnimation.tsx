
import React from 'react';
import { EmotionScale } from '@/types/sentiment';
import { cn } from '@/lib/utils';

interface WeatherAnimationProps {
  emotionScale: EmotionScale;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const WeatherAnimation: React.FC<WeatherAnimationProps> = ({ 
  emotionScale, 
  size = 'md',
  className 
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const weatherStates = {
    1: { // Storm
      icon: '⛈️',
      bgClass: 'from-gray-700 to-gray-900',
      animation: 'storm-flash'
    },
    2: { // Heavy Rain
      icon: '🌧️',
      bgClass: 'from-blue-400 to-gray-600',
      animation: 'rain-drops'
    },
    3: { // Cloudy
      icon: '☁️',
      bgClass: 'from-gray-300 to-gray-500',
      animation: 'cloud-drift'
    },
    4: { // Partly Sunny
      icon: '⛅',
      bgClass: 'from-yellow-200 to-blue-300',
      animation: 'sun-peek'
    },
    5: { // Sunny
      icon: '☀️',
      bgClass: 'from-yellow-300 to-orange-300',
      animation: 'sun-rays'
    }
  } as const;

  const weather = weatherStates[emotionScale];

  return (
    <div className={cn(
      'relative flex items-center justify-center rounded-full bg-gradient-to-br overflow-hidden',
      sizeClasses[size],
      weather.bgClass,
      className
    )}>
      {/* Weather Icon */}
      <span className="text-2xl relative z-10 weather-icon" data-animation={weather.animation}>
        {weather.icon}
      </span>
      
      {/* Animation Effects */}
      {emotionScale === 1 && (
        <div className="absolute inset-0 storm-lightning opacity-30" />
      )}
      
      {emotionScale === 2 && (
        <>
          <div className="absolute top-0 left-1/4 w-px h-full bg-blue-200 rain-drop delay-0" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-blue-200 rain-drop delay-100" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-blue-200 rain-drop delay-200" />
        </>
      )}
      
      {emotionScale === 5 && (
        <div className="absolute inset-0 sun-glow opacity-40" />
      )}
    </div>
  );
};

export default WeatherAnimation;
