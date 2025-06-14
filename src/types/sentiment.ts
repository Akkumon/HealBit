
// Sentiment analysis types
export type EmotionScale = 1 | 2 | 3 | 4 | 5;

export interface SentimentData {
  score: number; // -1 to 1
  magnitude: number; // 0 to 1
  emotion: EmotionScale;
  confidence: number; // 0 to 1
}

export interface EmotionAnalysis {
  primary: string;
  secondary?: string;
  intensity: EmotionScale;
  sentiment: SentimentData;
}
