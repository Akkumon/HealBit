
import React from 'react';
import { cn } from '@/lib/utils';
import './weatherEffects.css';

type WeatherState = 'storm' | 'rainy' | 'cloudy' | 'partlySunny' | 'sunny';

interface AnimatedSkyProps {
  weatherState: WeatherState;
  className?: string;
}

const AnimatedSky: React.FC<AnimatedSkyProps> = ({ weatherState, className }) => {
  const getSkyGradient = (state: WeatherState) => {
    switch (state) {
      case 'storm':
        return 'from-gray-800 via-gray-700 to-gray-900';
      case 'rainy':
        return 'from-blue-400 via-gray-500 to-gray-700';
      case 'cloudy':
        return 'from-gray-300 via-gray-400 to-gray-600';
      case 'partlySunny':
        return 'from-blue-300 via-blue-200 to-yellow-200';
      case 'sunny':
        return 'from-yellow-200 via-orange-200 to-blue-300';
      default:
        return 'from-gray-300 via-gray-400 to-gray-600';
    }
  };

  return (
    <div className={cn('absolute inset-0 weather-sky', className)}>
      {/* Base Sky Gradient */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-b transition-all duration-1000 ease-in-out',
        getSkyGradient(weatherState)
      )} />
      
      {/* Weather Effects Layer */}
      <div className="absolute inset-0">
        {/* Storm Effects */}
        {weatherState === 'storm' && (
          <>
            <div className="storm-lightning absolute inset-0" />
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
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
        
        {/* Rain Effects */}
        {weatherState === 'rainy' && (
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="rain-drop absolute bg-blue-300/70"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${0.8 + Math.random() * 0.7}s`
                }}
              />
            ))}
          </>
        )}
        
        {/* Floating Clouds */}
        {(weatherState === 'cloudy' || weatherState === 'partlySunny') && (
          <>
            <div className="cloud cloud-1 absolute top-8 opacity-60" />
            <div className="cloud cloud-2 absolute top-16 right-8 opacity-40" />
            <div className="cloud cloud-3 absolute top-12 left-16 opacity-50" />
          </>
        )}
        
        {/* Sunshine Effects */}
        {(weatherState === 'sunny' || weatherState === 'partlySunny') && (
          <>
            <div className="sun-rays absolute top-8 right-8" />
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="sparkle absolute bg-yellow-300/80 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 40}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  width: '3px',
                  height: '3px'
                }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default AnimatedSky;
