
export type EmotionScale = 1 | 2 | 3 | 4 | 5;

export interface SentimentData {
  score: EmotionScale;
  trend: 'improving' | 'stable' | 'declining';
  weeklyAverage: number;
  message: string;
}

export interface SentimentAnalysis {
  emotion: EmotionScale;
  score: number;
  magnitude: number;
  confidence: number;
}
