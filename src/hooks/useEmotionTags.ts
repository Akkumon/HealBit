
import { useState } from 'react';
import { MoodType } from '@/types';

export const useEmotionTags = () => {
  const [currentMood, setCurrentMood] = useState<MoodType>('neutral');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const emotionTags = {
    joy: ['grateful', 'excited', 'proud', 'hopeful', 'content'],
    calm: ['peaceful', 'relaxed', 'centered', 'balanced', 'serene'],
    hope: ['optimistic', 'motivated', 'inspired', 'determined', 'confident'],
    neutral: ['okay', 'steady', 'normal', 'quiet', 'thoughtful'],
    sadness: ['lonely', 'disappointed', 'grieving', 'melancholy', 'tired'],
    anger: ['frustrated', 'irritated', 'overwhelmed', 'stressed', 'bitter']
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearTags = () => {
    setSelectedTags([]);
  };

  return {
    currentMood,
    setCurrentMood,
    selectedTags,
    setSelectedTags,
    emotionTags,
    toggleTag,
    clearTags
  };
};
