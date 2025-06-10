import React from 'react';
import { cn } from '@/lib/utils';
import { AvatarEvolution } from '@/types/sentiment';
import { MoodType } from '@/types';
import { useTheme } from '@/hooks/useTheme';

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
  const { isDark } = useTheme();
  
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

  // Calculate colors based on emotional state with theme awareness
  const getAvatarColors = () => {
    const { emotionalState } = evolution;
    
    // Base colors adjusted for theme
    const baseColors = {
      light: {
        low: { primary: '#6B7280', secondary: '#9CA3AF' }, // Gray
        lowMid: { primary: '#3B82F6', secondary: '#60A5FA' }, // Blue
        mid: { primary: '#10B981', secondary: '#34D399' }, // Green
        highMid: { primary: '#F59E0B', secondary: '#FBBF24' }, // Yellow
        high: { primary: '#EF4444', secondary: '#F87171' } // Red/Pink for joy
      },
      dark: {
        low: { primary: '#9CA3AF', secondary: '#D1D5DB' }, // Lighter Gray
        lowMid: { primary: '#60A5FA', secondary: '#93C5FD' }, // Lighter Blue
        mid: { primary: '#34D399', secondary: '#6EE7B7' }, // Lighter Green
        highMid: { primary: '#FBBF24', secondary: '#FCD34D' }, // Lighter Yellow
        high: { primary: '#F87171', secondary: '#FCA5A5' } // Lighter Red/Pink
      }
    };

    const colors = baseColors[isDark ? 'dark' : 'light'];
    
    if (emotionalState < 0.2) return colors.low;
    if (emotionalState < 0.4) return colors.lowMid;
    if (emotionalState < 0.6) return colors.mid;
    if (emotionalState < 0.8) return colors.highMid;
    return colors.high;
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

  // Enhanced glow intensity for dark mode
  const glowIntensity = evolution.glowIntensity * (isDark ? 1.2 : 1);

  return (
    <div className={cn(
      'relative flex items-center justify-center',
      sizeClasses[size],
      className
    )}>
      {/* Glow Aura - Enhanced for dark mode */}
      <div 
        className="absolute inset-0 rounded-full transition-all duration-1000 gentle-pulse avatar-glow"
        style={{ 
          background: `radial-gradient(circle, ${colors.primary}${isDark ? '40' : '20'} 0%, transparent 70%)`,
          opacity: glowIntensity,
          filter: `blur(8px) ${isDark ? 'brightness(1.2)' : ''}`
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
          opacity={isDark ? 0.9 : 0.8}
        />
        
        {/* Head */}
        <circle 
          cx="50" 
          cy="35" 
          r="20" 
          fill={colors.primary}
          className="transition-all duration-1000"
          opacity={isDark ? 0.95 : 1}
        />
        
        {/* Arms */}
        <ellipse 
          cx={50 - armSpread} 
          cy="60" 
          rx="8" 
          ry="20" 
          fill={colors.secondary}
          className="transition-all duration-1000"
          opacity={isDark ? 0.95 : 0.9}
        />
        <ellipse 
          cx={50 + armSpread} 
          cy="60" 
          rx="8" 
          ry="20" 
          fill={colors.secondary}
          className="transition-all duration-1000"
          opacity={isDark ? 0.95 : 0.9}
        />
        
        {/* Eyes - simple dots that get more detailed with complexity */}
        {!hasDetails ? (
          <>
            <circle cx="45" cy="32" r="2" fill={isDark ? '#F3F4F6' : 'white'} opacity={0.8} />
            <circle cx="55" cy="32" r="2" fill={isDark ? '#F3F4F6' : 'white'} opacity={0.8} />
          </>
        ) : (
          <>
            <ellipse cx="45" cy="32" rx="3" ry="2" fill={isDark ? '#F3F4F6' : 'white'} opacity={0.9} />
            <ellipse cx="55" cy="32" rx="3" ry="2" fill={isDark ? '#F3F4F6' : 'white'} opacity={0.9} />
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
              fill={isDark ? '#F3F4F6' : 'white'} 
              opacity={isDark ? 0.8 : 0.6}
              className="gentle-pulse"
            />
            
            {/* Energy lines */}
            <path 
              d="M 50 45 Q 40 55 50 65 Q 60 55 50 45" 
              stroke={colors.secondary} 
              strokeWidth="1" 
              fill="none" 
              opacity={isDark ? 0.7 : 0.5}
            />
          </>
        )}
      </svg>
    </div>
  );
};

export default AvatarRenderer;