
import React, { useEffect, useState } from 'react';
import { EmotionScale } from '@/types/sentiment';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface WeatherAnimationProps {
  sentiment: {
    emotion: EmotionScale;
    score: number;
    magnitude: number;
    confidence: number;
  };
  className?: string;
}

const WeatherAnimation: React.FC<WeatherAnimationProps> = ({
  sentiment,
  className
}) => {
  const { isDark } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 3000);
    return () => clearTimeout(timer);
  }, [sentiment]);

  // Weather states based on emotion scale
  const weatherStates = {
    1: {
      icon: '⛈️',
      bgClass: isDark ? 'from-gray-800 to-gray-900' : 'from-gray-700 to-gray-900',
      animation: 'storm-flash',
      description: 'Weathering the storm together',
      particles: '💧',
      particleCount: 20,
      hueShift: 0
    },
    2: {
      icon: '🌧️',
      bgClass: isDark ? 'from-blue-800 to-gray-800' : 'from-blue-600 to-gray-700',
      animation: 'gentle-rain',
      description: 'Gentle rain brings renewal',
      particles: '💧',
      particleCount: 15,
      hueShift: 210
    },
    3: {
      icon: '⛅',
      bgClass: isDark ? 'from-gray-600 to-blue-700' : 'from-gray-400 to-blue-500',
      animation: 'partly-cloudy',
      description: 'Clouds are starting to part',
      particles: '☁️',
      particleCount: 8,
      hueShift: 180
    },
    4: {
      icon: '🌤️',
      bgClass: isDark ? 'from-blue-500 to-yellow-600' : 'from-blue-400 to-yellow-500',
      animation: 'sun-peek',
      description: 'Sunshine beginning to emerge',
      particles: '✨',
      particleCount: 12,
      hueShift: 120
    },
    5: {
      icon: '☀️',
      bgClass: isDark ? 'from-yellow-500 to-orange-500' : 'from-yellow-400 to-orange-400',
      animation: 'bright-sunshine',
      description: 'Beautiful clear skies ahead',
      particles: '✨',
      particleCount: 25,
      hueShift: 60
    }
  } as const;

  const currentWeather = weatherStates[sentiment.emotion];

  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl p-8 text-center text-white transition-all duration-1000',
      `bg-gradient-to-br ${currentWeather.bgClass}`,
      isAnimating && 'scale-105',
      className
    )}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: currentWeather.particleCount }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'absolute animate-bounce opacity-60',
              currentWeather.animation
            )}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          >
            {currentWeather.particles}
          </div>
        ))}
      </div>

      {/* Main weather icon */}
      <div className="relative z-10 space-y-4">
        <div className={cn(
          'text-6xl transition-transform duration-500',
          isAnimating && 'scale-110 rotate-12'
        )}>
          {currentWeather.icon}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">
            {currentWeather.description}
          </h3>
          <p className="text-sm opacity-90">
            Emotional intensity: {sentiment.emotion}/5
          </p>
          <div className="flex justify-center space-x-4 text-xs opacity-75">
            <span>Sentiment: {(sentiment.score * 100).toFixed(0)}%</span>
            <span>Confidence: {(sentiment.confidence * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Weather overlay effects */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `linear-gradient(45deg, 
            hsla(${currentWeather.hueShift}, 70%, 60%, 0.3), 
            hsla(${currentWeather.hueShift + 30}, 70%, 70%, 0.1))`
        }}
      />
    </div>
  );
};

export default WeatherAnimation;
