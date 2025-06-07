
import React from 'react';
import { cn } from '@/lib/utils';
import { AvatarEvolution } from '@/types/sentiment';
import { MoodType } from '@/types';

interface AvatarRendererProps {
  mood?: MoodType;
  evolution: AvatarEvolution;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AvatarRenderer: React.FC<AvatarRendererProps> = ({ 
  mood = 'neutral', 
  evolution,
  size = 'md',
  className 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const sizePx = {
    sm: 64,
    md: 96,
    lg: 128
  };

  const currentSize = sizePx[size];

  // Calculate colors based on emotional state
  const getAvatarColors = () => {
    const { emotionalState } = evolution;
    
    if (emotionalState < 0.2) return { primary: '#6B7280', secondary: '#9CA3AF' }; // Gray
    if (emotionalState < 0.4) return { primary: '#3B82F6', secondary: '#60A5FA' }; // Blue
    if (emotionalState < 0.6) return { primary: '#10B981', secondary: '#34D399' }; // Green
    if (emotionalState < 0.8) return { primary: '#F59E0B', secondary: '#FBBF24' }; // Yellow
    return { primary: '#EF4444', secondary: '#F87171' }; // Red/Pink for joy
  };

  const colors = getAvatarColors();
  
  // Calculate openness - affects the "stance" of the avatar
  const opennessFactor = evolution.openness;
  const bodyWidth = 20 + (opennessFactor * 10); // More open = wider
  const armSpread = 15 + (opennessFactor * 10); // More open = arms spread wider
  
  // Calculate complexity - affects detail level
  const complexityFactor = evolution.complexity;
  const hasDetails = complexityFactor > 0.3;
  const hasAdvancedDetails = complexityFactor > 0.7;

  return (
    <div className={cn(
      'relative flex items-center justify-center',
      sizeClasses[size],
      className
    )}>
      {/* Glow Aura */}
      <div 
        className="absolute inset-0 rounded-full transition-all duration-1000 gentle-pulse"
        style={{ 
          background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`,
          opacity: evolution.glowIntensity,
          filter: 'blur(8px)'
        }}
      />
      
      {/* Avatar SVG */}
      <svg 
        width={currentSize} 
        height={currentSize} 
        viewBox="0 0 100 100" 
        className="relative z-10"
      >
        {/* Body */}
        <ellipse 
          cx="50" 
          cy="70" 
          rx={bodyWidth} 
          ry="25" 
          fill={colors.primary}
          className="transition-all duration-1000"
          opacity={0.8}
        />
        
        {/* Head */}
        <circle 
          cx="50" 
          cy="35" 
          r="20" 
          fill={colors.primary}
          className="transition-all duration-1000"
        />
        
        {/* Arms */}
        <ellipse 
          cx={50 - armSpread} 
          cy="60" 
          rx="8" 
          ry="20" 
          fill={colors.secondary}
          className="transition-all duration-1000"
          opacity={0.9}
        />
        <ellipse 
          cx={50 + armSpread} 
          cy="60" 
          rx="8" 
          ry="20" 
          fill={colors.secondary}
          className="transition-all duration-1000"
          opacity={0.9}
        />
        
        {/* Eyes - simple dots that get more detailed with complexity */}
        {!hasDetails ? (
          <>
            <circle cx="45" cy="32" r="2" fill="white" opacity={0.8} />
            <circle cx="55" cy="32" r="2" fill="white" opacity={0.8} />
          </>
        ) : (
          <>
            <ellipse cx="45" cy="32" rx="3" ry="2" fill="white" opacity={0.9} />
            <ellipse cx="55" cy="32" rx="3" ry="2" fill="white" opacity={0.9} />
            <circle cx="45" cy="32" r="1" fill={colors.primary} />
            <circle cx="55" cy="32" r="1" fill={colors.primary} />
          </>
        )}
        
        {/* Advanced details - appear with high complexity */}
        {hasAdvancedDetails && (
          <>
            {/* Heart center */}
            <circle 
              cx="50" 
              cy="70" 
              r="3" 
              fill="white" 
              opacity={0.6}
              className="gentle-pulse"
            />
            
            {/* Energy lines */}
            <path 
              d="M 50 45 Q 40 55 50 65 Q 60 55 50 45" 
              stroke={colors.secondary} 
              strokeWidth="1" 
              fill="none" 
              opacity={0.5}
            />
          </>
        )}
      </svg>
    </div>
  );
};

export default AvatarRenderer;
