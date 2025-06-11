import React from 'react';
import { EmotionScale } from '@/types/sentiment';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

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
  const { isDark } = useTheme();
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const weatherStates = {
    1: { // Storm
      icon: '⛈️',
      bgClass: isDark 
        ? 'from-gray-800 to-gray-900' 
        : 'from-gray-700 to-gray-900',
      animation: 'storm-flash',
      description: 'Weathering the storm together'
    },
    2: { // Heavy Rain
      icon: '🌧️',
      bgClass: isDark 
        ? 'from-blue-500 to-gray-700' 
        : 'from-blue-400 to-gray-600',
      animation: 'rain-drops',
      description: 'Processing through the rain'
    },
    3: { // Cloudy
      icon: '☁️',
      bgClass: isDark 
        ? 'from-gray-400 to-gray-600' 
        : 'from-gray-300 to-gray-500',
      animation: 'cloud-drift',
      description: 'Gentle clouds of reflection'
    },
    4: { // Partly Sunny
      icon: '⛅',
      bgClass: isDark 
        ? 'from-yellow-300 to-blue-400' 
        : 'from-yellow-200 to-blue-300',
      animation: 'sun-peek',
      description: 'Hope breaking through'
    },
    5: { // Sunny
      icon: '☀️',
      bgClass: isDark 
        ? 'from-yellow-400 to-orange-400' 
        : 'from-yellow-300 to-orange-300',
      animation: 'sun-rays',
      description: 'Bright and beautiful'
    }
  } as const;

  const weather = weatherStates[emotionScale];

  return (
    <div className={cn(
      'relative flex items-center justify-center rounded-full bg-gradient-to-br overflow-hidden transition-all duration-1000',
      sizeClasses[size],
      weather.bgClass,
      className
    )}>
      {/* Weather Icon */}
      <span 
        className={cn(
          'text-2xl relative z-10 weather-icon transition-all duration-500',
          isDark && 'filter brightness-110'
        )} 
        data-animation={weather.animation}
      >
        {weather.icon}
      </span>
      
      {/* Enhanced Animation Effects for Dark Mode */}
      {emotionScale === 1 && (
        <div className={cn(
          'absolute inset-0 storm-lightning',
          isDark ? 'opacity-40' : 'opacity-30'
        )} />
      )}
      
      {emotionScale === 2 && (
        <>
          <div className={cn(
            'absolute top-0 left-1/4 w-px h-full rain-drop delay-0',
            isDark ? 'bg-blue-300' : 'bg-blue-200'
          )} />
          <div className={cn(
            'absolute top-0 left-1/2 w-px h-full rain-drop delay-100',
            isDark ? 'bg-blue-300' : 'bg-blue-200'
          )} />
          <div className={cn(
            'absolute top-0 left-3/4 w-px h-full rain-drop delay-200',
            isDark ? 'bg-blue-300' : 'bg-blue-200'
          )} />
        </>
      )}
      
      {emotionScale === 5 && (
        <div className={cn(
          'absolute inset-0 sun-glow',
          isDark ? 'opacity-50' : 'opacity-40'
        )} />
      )}

      {/* Gentle outer glow for dark mode */}
      {isDark && (
        <div 
          className="absolute inset-0 rounded-full transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, ${
              emotionScale >= 4 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'
            } 0%, transparent 70%)`,
            filter: 'blur(4px)'
          }}
        />
      )}
    </div>
  );
};

export default WeatherAnimation;