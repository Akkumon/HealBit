
import React from 'react';
import { MoodType } from '@/types';
import { cn } from '@/lib/utils';

type WeatherState = 'storm' | 'rainy' | 'cloudy' | 'partlySunny' | 'sunny';

interface NimbusCompanionProps {
  mood: MoodType;
  weatherState: WeatherState;
  className?: string;
}

const NimbusCompanion: React.FC<NimbusCompanionProps> = ({ 
  mood, 
  weatherState, 
  className 
}) => {
  const getCloudExpression = (mood: MoodType) => {
    switch (mood) {
      case 'joy':
        return { eyes: '◡ ◡', mouth: '‿', color: 'text-yellow-100' };
      case 'calm':
        return { eyes: '◡ ◡', mouth: '⌒', color: 'text-blue-100' };
      case 'hope':
        return { eyes: '◡ ◡', mouth: '○', color: 'text-green-100' };
      case 'neutral':
        return { eyes: '◦ ◦', mouth: '⌐', color: 'text-gray-100' };
      case 'sadness':
        return { eyes: '╥ ╥', mouth: '︶', color: 'text-blue-200' };
      case 'anger':
        return { eyes: '◢ ◣', mouth: '︿', color: 'text-red-200' };
      default:
        return { eyes: '◦ ◦', mouth: '⌐', color: 'text-gray-100' };
    }
  };

  const expression = getCloudExpression(mood);

  return (
    <div className={cn(
      'relative w-24 h-16 transition-all duration-500 hover:scale-110 cursor-pointer nimbus-companion',
      className
    )}>
      {/* Cloud Body SVG */}
      <svg
        viewBox="0 0 100 60"
        className="w-full h-full drop-shadow-lg"
        fill="currentColor"
      >
        <defs>
          <filter id="cloud-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Cloud Shape */}
        <path
          d="M25,45 Q15,35 25,25 Q35,15 50,20 Q65,15 75,25 Q85,35 75,45 Z"
          className={cn('transition-colors duration-500', expression.color)}
          filter="url(#cloud-glow)"
        />
        
        {/* Smaller cloud puffs */}
        <circle cx="30" cy="35" r="8" className={cn('transition-colors duration-500', expression.color)} opacity="0.8" />
        <circle cx="70" cy="35" r="6" className={cn('transition-colors duration-500', expression.color)} opacity="0.6" />
      </svg>
      
      {/* Facial Expression */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-800">
        <div className="text-xs font-mono leading-none mb-1">
          {expression.eyes}
        </div>
        <div className="text-xs font-mono leading-none">
          {expression.mouth}
        </div>
      </div>
      
      {/* Weather-specific effects */}
      {weatherState === 'storm' && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-yellow-300 text-xs animate-ping">
          ⚡
        </div>
      )}
      
      {weatherState === 'sunny' && (
        <div className="absolute -top-1 -right-1 text-yellow-400 text-xs animate-pulse">
          ✨
        </div>
      )}
    </div>
  );
};

export default NimbusCompanion;
