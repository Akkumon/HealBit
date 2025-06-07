
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SentimentData } from '@/types/sentiment';
import WeatherAnimation from './WeatherAnimation';

interface SentimentMeterProps {
  sentimentData: SentimentData;
}

const SentimentMeter: React.FC<SentimentMeterProps> = ({ sentimentData }) => {
  const getTrendIcon = () => {
    switch (sentimentData.trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-orange-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (sentimentData.trend) {
      case 'improving':
        return 'text-green-700';
      case 'declining':
        return 'text-orange-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Your Emotional Weather</span>
          <WeatherAnimation emotionScale={sentimentData.score} size="sm" />
        </CardTitle>
        <CardDescription>
          Weekly emotional climate overview
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weather Score */}
        <div className="flex items-center justify-between">
          <div className="text-center">
            <WeatherAnimation emotionScale={sentimentData.score} size="lg" />
            <p className="text-sm text-muted-foreground mt-2">Current</p>
          </div>
          
          <div className="flex-1 mx-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Weekly Average</span>
              <div className="flex items-center space-x-1">
                {getTrendIcon()}
                <span className={`text-sm font-medium ${getTrendColor()}`}>
                  {sentimentData.trend}
                </span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="h-2 bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(sentimentData.weeklyAverage / 5) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Storm</span>
              <span>Sunny</span>
            </div>
          </div>
        </div>

        {/* Encouraging Message */}
        <div className="text-center p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
          <p className="text-sm font-medium text-foreground">
            {sentimentData.message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentMeter;
