
import React from 'react';
import { cn } from '@/lib/utils';
import './WeatherTracker/weatherEffects.css';

type WeatherState = 'storm' | 'overcast' | 'clearing' | 'sunny';

interface WeatherBackgroundProps {
  weatherState: WeatherState;
  intensity?: number; // 0.1 to 1.0
  opacity?: number; // 0.1 to 0.5
  className?: string;
  disabled?: boolean; // for accessibility
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({
  weatherState,
  intensity = 0.5,
  opacity = 0.3,
  className,
  disabled = false
}) => {
  if (disabled) return null;

  const getWeatherConfig = (state: WeatherState) => {
    switch (state) {
      case 'storm':
        return {
          gradient: 'from-gray-800 via-gray-700 to-gray-900',
          particleCount: Math.floor(20 * intensity),
          particles: 'rain',
          effects: ['lightning', 'rain']
        };
      case 'overcast':
        return {
          gradient: 'from-gray-600 via-gray-500 to-gray-400',
          particleCount: Math.floor(12 * intensity),
          particles: 'clouds',
          effects: ['clouds', 'fog']
        };
      case 'clearing':
        return {
          gradient: 'from-gray-500 via-blue-400 to-blue-300',
          particleCount: Math.floor(15 * intensity),
          particles: 'mixed',
          effects: ['sunrays', 'clouds']
        };
      case 'sunny':
        return {
          gradient: 'from-blue-400 via-yellow-200 to-orange-200',
          particleCount: Math.floor(18 * intensity),
          particles: 'sparkles',
          effects: ['sunrays', 'sparkles']
        };
      default:
        return {
          gradient: 'from-gray-600 via-gray-500 to-gray-400',
          particleCount: 0,
          particles: 'none',
          effects: []
        };
    }
  };

  const config = getWeatherConfig(weatherState);

  return (
    <div 
      className={cn(
        'fixed inset-0 pointer-events-none transition-all duration-1000 ease-in-out weather-sky',
        className
      )}
      style={{ opacity, zIndex: -1 }}
    >
      {/* Base Sky Gradient */}
      <div 
        className={cn(
          'absolute inset-0 bg-gradient-to-br transition-all duration-1000',
          config.gradient
        )}
      />
      
      {/* Weather Effects Layer */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Storm Effects */}
        {weatherState === 'storm' && (
          <>
            <div className="storm-lightning absolute inset-0" />
            {Array.from({ length: config.particleCount }).map((_, i) => (
              <div
                key={`rain-${i}`}
                className="rain-drop absolute bg-white/60"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`
                }}
              />
            ))}
          </>
        )}
        
        {/* Overcast Effects */}
        {weatherState === 'overcast' && (
          <>
            {Array.from({ length: Math.min(config.particleCount, 8) }).map((_, i) => (
              <div
                key={`cloud-${i}`}
                className={cn('cloud absolute opacity-40', `cloud-${(i % 3) + 1}`)}
                style={{
                  top: `${10 + Math.random() * 30}%`,
                  left: `${Math.random() * 80}%`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            ))}
            {/* Fog overlay */}
            <div className="absolute inset-0 bg-gray-400/20 animate-pulse" 
                 style={{ animationDuration: '4s' }} />
          </>
        )}
        
        {/* Clearing Weather Effects */}
        {weatherState === 'clearing' && (
          <>
            {/* Fading clouds */}
            {Array.from({ length: Math.min(config.particleCount, 6) }).map((_, i) => (
              <div
                key={`clearing-cloud-${i}`}
                className={cn('cloud absolute opacity-30', `cloud-${(i % 3) + 1}`)}
                style={{
                  top: `${15 + Math.random() * 25}%`,
                  left: `${Math.random() * 70}%`,
                  animationDelay: `${i * 0.7}s`
                }}
              />
            ))}
            {/* Sun rays breaking through */}
            <div className="sun-rays absolute top-8 right-8 opacity-60" />
            <div className="sun-rays absolute top-16 right-20 opacity-40" 
                 style={{ animationDelay: '1s' }} />
          </>
        )}
        
        {/* Sunny Weather Effects */}
        {weatherState === 'sunny' && (
          <>
            {/* Multiple sun rays */}
            <div className="sun-rays absolute top-8 right-8" />
            <div className="sun-rays absolute top-12 right-16 opacity-70" 
                 style={{ animationDelay: '0.5s' }} />
            
            {/* Gentle clouds */}
            {Array.from({ length: Math.min(config.particleCount, 4) }).map((_, i) => (
              <div
                key={`sunny-cloud-${i}`}
                className={cn('cloud absolute opacity-20', `cloud-${(i % 3) + 1}`)}
                style={{
                  top: `${20 + Math.random() * 20}%`,
                  left: `${Math.random() * 60}%`,
                  animationDelay: `${i * 1.2}s`
                }}
              />
            ))}
            
            {/* Sparkles */}
            {Array.from({ length: Math.floor(config.particleCount * 0.8) }).map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="sparkle absolute bg-yellow-300/80 rounded-full w-1 h-1"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 40}%`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              />
            ))}
          </>
        )}
      </div>
      
      {/* Optional overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 dark:to-black/5" />
    </div>
  );
};

export default WeatherBackground;
