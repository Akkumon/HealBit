
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SentimentData } from '@/types/sentiment';
import WeatherAnimation from './WeatherAnimation';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface SentimentMeterProps {
  sentimentData: SentimentData;
}

const SentimentMeter: React.FC<SentimentMeterProps> = ({ sentimentData }) => {
  const { isDark } = useTheme();
  
  const getTrendIcon = () => {
    switch (sentimentData.trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (sentimentData.trend) {
      case 'improving':
        return 'text-green-700 dark:text-green-300';
      case 'declining':
        return 'text-orange-700 dark:text-orange-300';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  const getProgressBarGradient = () => {
    const percentage = (sentimentData.weeklyAverage / 5) * 100;
    if (isDark) {
      return {
        background: `linear-gradient(90deg, 
          hsl(220, 30%, 25%) 0%, 
          hsl(200, 40%, 35%) ${percentage * 0.3}%, 
          hsl(45, 60%, 50%) ${percentage * 0.7}%, 
          hsl(45, 80%, 60%) ${percentage}%, 
          transparent ${percentage}%)`
      };
    } else {
      return {
        background: `linear-gradient(90deg, 
          hsl(220, 30%, 70%) 0%, 
          hsl(200, 50%, 60%) ${percentage * 0.3}%, 
          hsl(45, 70%, 60%) ${percentage * 0.7}%, 
          hsl(45, 90%, 70%) ${percentage}%, 
          transparent ${percentage}%)`
      };
    }
  };

  const mockSentiment = {
    emotion: sentimentData.score,
    score: sentimentData.weeklyAverage / 5,
    magnitude: 0.8,
    confidence: 0.9
  };

  return (
    <Card className={cn(
      'border-primary/20 transition-all duration-300',
      isDark 
        ? 'bg-gray-800/70 backdrop-blur-sm' 
        : 'bg-white/70 backdrop-blur-sm'
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Your Emotional Weather</span>
          <WeatherAnimation sentiment={mockSentiment} />
        </CardTitle>
        <CardDescription>
          Weekly emotional climate overview
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weather Score */}
        <div className="flex items-center justify-between">
          <div className="text-center">
            <WeatherAnimation sentiment={mockSentiment} />
            <p className="text-sm text-muted-foreground mt-2">Current</p>
          </div>
          
          <div className="flex-1 mx-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Weekly Average</span>
              <div className="flex items-center space-x-1">
                {getTrendIcon()}
                <span className={cn('text-sm font-medium', getTrendColor())}>
                  {sentimentData.trend}
                </span>
              </div>
            </div>
            
            {/* Enhanced Progress bar with gradient */}
            <div className={cn(
              'w-full rounded-full h-3 transition-all duration-500',
              isDark ? 'bg-gray-700' : 'bg-muted'
            )}>
              <div 
                className="h-3 rounded-full transition-all duration-1000 ease-out"
                style={getProgressBarGradient()}
              />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Storm</span>
              <span>Sunny</span>
            </div>
          </div>
        </div>

        {/* Encouraging Message with enhanced styling */}
        <div className={cn(
          'text-center p-4 rounded-lg transition-all duration-300',
          isDark 
            ? 'bg-gradient-to-r from-primary/20 to-accent/20' 
            : 'bg-gradient-to-r from-primary/10 to-accent/10'
        )}>
          <p className="text-sm font-medium text-foreground leading-relaxed">
            {sentimentData.message}
          </p>
        </div>

        {/* Weather description */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {sentimentData.score === 1 && "Even storms pass, and you're so brave 🌈"}
            {sentimentData.score === 2 && "Gentle rains help things grow too 🌱"}
            {sentimentData.score === 3 && "Finding your rhythm in the gentle seasons 🍃"}
            {sentimentData.score === 4 && "Sunshine is breaking through the clouds ⛅"}
            {sentimentData.score === 5 && "Your skies are beautifully clear ☀️"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentMeter;
