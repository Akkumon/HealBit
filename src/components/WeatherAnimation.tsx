import React from 'react';
import { EmotionScale } from '@/types/sentiment';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { MoodType } from '@/types';

interface WeatherAnimationProps {
  emotionScale: EmotionScale;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  mood?: MoodType;
}

const WeatherAnimation: React.FC<WeatherAnimationProps> = ({ 
  emotionScale, 
  size = 'md',
  className,
  mood
}) => {
  const { isDark } = useTheme();
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const weatherStates = {
    1: { // Storm (Anger/Extreme Sadness)
      icon: '⛈️',
      bgClass: isDark 
        ? 'from-gray-800 to-gray-900' 
        : 'from-gray-700 to-gray-900',
      animation: 'storm-flash',
      description: 'Weathering the storm together',
      particleEffect: 'rain',
      particleColor: isDark ? 'rgba(173,216,230,0.5)' : 'rgba(100,149,237,0.5)',
      particleCount: 50,
      particleSpeed: 1.5,
      hueShift: 0,
    },
    2: { // Heavy Rain (Sadness)
      icon: '🌧️',
      bgClass: isDark 
        ? 'from-blue-500 to-gray-700' 
        : 'from-blue-400 to-gray-600',
      animation: 'rain-drops',
      description: 'Processing through the rain',
      particleEffect: 'rain',
      particleColor: isDark ? 'rgba(173,216,230,0.7)' : 'rgba(100,149,237,0.7)',
      particleCount: 30,
      particleSpeed: 1,
      hueShift: 200,
    },
    3: { // Cloudy (Neutral)
      icon: '☁️',
      bgClass: isDark 
        ? 'from-gray-400 to-gray-600' 
        : 'from-gray-300 to-gray-500',
      animation: 'cloud-drift',
      description: 'Gentle clouds of reflection',
      particleEffect: 'none',
      particleColor: '',
      particleCount: 0,
      particleSpeed: 0,
      hueShift: 0,
    },
    4: { // Partly Sunny (Hope)
      icon: '⛅',
      bgClass: isDark 
        ? 'from-yellow-300 to-blue-400' 
        : 'from-yellow-200 to-blue-300',
      animation: 'sun-peek',
      description: 'Hope breaking through',
      particleEffect: 'sparkle',
      particleColor: isDark ? 'rgba(255,255,100,0.8)' : 'rgba(255,255,0,0.8)',
      particleCount: 15,
      particleSpeed: 0.8,
      hueShift: 60,
    },
    5: { // Sunny (Joy)
      icon: '☀️',
      bgClass: isDark 
        ? 'from-yellow-400 to-orange-400' 
        : 'from-yellow-300 to-orange-300',
      animation: 'sun-rays',
      description: 'Bright and beautiful',
      particleEffect: 'sparkle',
      particleColor: isDark ? 'rgba(255,223,0,0.9)' : 'rgba(255,215,0,0.9)',
      particleCount: 25,
      particleSpeed: 0.5,
      hueShift: 40,
    }
  } as const;

  const weather = weatherStates[emotionScale];

  const dynamicBgStyle = {};

  return (
    <div className={cn(
      'relative flex items-center justify-center rounded-full bg-gradient-to-br overflow-hidden transition-all duration-1000',
      sizeClasses[size],
      weather.bgClass,
      className
    )} style={dynamicBgStyle}>
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
      
      {/* Particle Effects (New) */}
      {weather.particleEffect === 'rain' && Array.from({ length: weather.particleCount }).map((_, i) => (
        <div 
          key={i}
          className="absolute w-0.5 h-3 bg-current animate-rain-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${1 + Math.random() * weather.particleSpeed}s`,
            animationDelay: `-${Math.random() * 2}s`,
            backgroundColor: weather.particleColor,
            transform: `scaleY(${0.5 + Math.random() * 1.5}) rotate(25deg)`
          }}
        />
      ))}

      {weather.particleEffect === 'sparkle' && Array.from({ length: weather.particleCount }).map((_, i) => (
        <div 
          key={i}
          className="absolute w-1 h-1 rounded-full bg-current animate-sparkle-fade"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${0.5 + Math.random() * weather.particleSpeed}s`,
            animationDelay: `-${Math.random() * 1}s`,
            backgroundColor: weather.particleColor,
            boxShadow: `0 0 4px ${weather.particleColor}`
          }}
        />
      ))}
      
      {/* Enhanced Animation Effects for Dark Mode */}
      {emotionScale === 1 && (
        <div className={cn(
          'absolute inset-0 storm-lightning',
          isDark ? 'opacity-40' : 'opacity-30'
        )} />
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