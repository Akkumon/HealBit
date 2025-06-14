export type EmotionScale = 1 | 2 | 3 | 4 | 5;

export interface SentimentData {
  score: EmotionScale;
  trend: 'improving' | 'stable' | 'declining';
  weeklyAverage: number;
  message: string;
}

export interface AvatarEvolution {
  complexity: number; // 0-1 based on entryCount
  emotionalState: number; // 0-1 based on mood average
  openness: number; // 0-1 based on recent trends
  glowIntensity: number; // 0-1 based on consistency
}

export interface WeatherState {
  type: 'storm' | 'heavyRain' | 'cloudy' | 'partlySunny' | 'sunny';
  label: string;
  icon: string;
  description: string;
}
