
export type EmotionScale = 1 | 2 | 3 | 4 | 5;

export interface SentimentData {
  score: number;
  confidence: number;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
  };
  emotionScale: EmotionScale;
}

export interface WeatherMood {
  type: 'storm' | 'overcast' | 'clearing' | 'sunny';
  intensity: number;
  description: string;
}
