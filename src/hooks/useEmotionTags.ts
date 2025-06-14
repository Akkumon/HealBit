
import { useState } from 'react';
import { MoodType } from '@/types';

export interface EmotionTag {
  id: string;
  label: string;
  icon: string;
  category: 'positive' | 'processing' | 'difficult';
  color: string;
}

export const useEmotionTags = () => {
  const [currentMood, setCurrentMood] = useState<MoodType>('neutral');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const emotionTags: EmotionTag[] = [
    // Positive emotions
    { id: 'grateful', label: 'Grateful', icon: '🙏', category: 'positive', color: 'text-yellow-600' },
    { id: 'hopeful', label: 'Hopeful', icon: '🌅', category: 'positive', color: 'text-orange-500' },
    { id: 'peaceful', label: 'Peaceful', icon: '🕊️', category: 'positive', color: 'text-blue-400' },
    { id: 'content', label: 'Content', icon: '😌', category: 'positive', color: 'text-green-500' },
    { id: 'excited', label: 'Excited', icon: '✨', category: 'positive', color: 'text-purple-500' },
    
    // Processing emotions
    { id: 'thoughtful', label: 'Thoughtful', icon: '🤔', category: 'processing', color: 'text-indigo-500' },
    { id: 'reflective', label: 'Reflective', icon: '💭', category: 'processing', color: 'text-gray-500' },
    { id: 'curious', label: 'Curious', icon: '🔍', category: 'processing', color: 'text-teal-500' },
    { id: 'nostalgic', label: 'Nostalgic', icon: '📸', category: 'processing', color: 'text-amber-500' },
    
    // Difficult emotions
    { id: 'sad', label: 'Sad', icon: '😢', category: 'difficult', color: 'text-blue-600' },
    { id: 'lonely', label: 'Lonely', icon: '💔', category: 'difficult', color: 'text-gray-600' },
    { id: 'frustrated', label: 'Frustrated', icon: '😤', category: 'difficult', color: 'text-red-500' },
    { id: 'anxious', label: 'Anxious', icon: '😰', category: 'difficult', color: 'text-yellow-500' },
    { id: 'confused', label: 'Confused', icon: '😕', category: 'difficult', color: 'text-purple-400' },
  ];

  const getSuggestedTags = (mood: MoodType): EmotionTag[] => {
    const moodToTags: Record<MoodType, string[]> = {
      joy: ['grateful', 'excited', 'hopeful', 'content'],
      calm: ['peaceful', 'content', 'thoughtful', 'reflective'],
      hope: ['hopeful', 'excited', 'grateful', 'curious'],
      neutral: ['thoughtful', 'reflective', 'content', 'curious'],
      sadness: ['sad', 'lonely', 'nostalgic', 'reflective'],
      anger: ['frustrated', 'confused', 'thoughtful', 'anxious']
    };

    const suggestedIds = moodToTags[mood] || [];
    return emotionTags.filter(tag => suggestedIds.includes(tag.id));
  };

  const getTagsByCategory = (category: EmotionTag['category']): EmotionTag[] => {
    return emotionTags.filter(tag => tag.category === category);
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
    getSuggestedTags,
    getTagsByCategory,
    toggleTag,
    clearTags
  };
};
