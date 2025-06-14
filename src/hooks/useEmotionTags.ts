
import { useState, useCallback } from 'react';
import { MoodType } from '@/types';

export interface EmotionTag {
  id: string;
  label: string;
  category: 'positive' | 'processing' | 'difficult';
  icon: string;
  color: string;
}

const emotionTags: EmotionTag[] = [
  // Positive
  { id: 'grateful', label: 'Grateful', category: 'positive', icon: '🙏', color: 'bg-green-100 text-green-800' },
  { id: 'hopeful', label: 'Hopeful', category: 'positive', icon: '🌟', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'peaceful', label: 'Peaceful', category: 'positive', icon: '🕊️', color: 'bg-blue-100 text-blue-800' },
  { id: 'proud', label: 'Proud', category: 'positive', icon: '💪', color: 'bg-purple-100 text-purple-800' },
  { id: 'loved', label: 'Loved', category: 'positive', icon: '💕', color: 'bg-pink-100 text-pink-800' },
  
  // Processing
  { id: 'confused', label: 'Confused', category: 'processing', icon: '🤔', color: 'bg-gray-100 text-gray-800' },
  { id: 'thoughtful', label: 'Thoughtful', category: 'processing', icon: '💭', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'uncertain', label: 'Uncertain', category: 'processing', icon: '🌫️', color: 'bg-slate-100 text-slate-800' },
  { id: 'processing', label: 'Processing', category: 'processing', icon: '🔄', color: 'bg-teal-100 text-teal-800' },
  { id: 'reflective', label: 'Reflective', category: 'processing', icon: '🪞', color: 'bg-cyan-100 text-cyan-800' },
  
  // Difficult
  { id: 'sad', label: 'Sad', category: 'difficult', icon: '😢', color: 'bg-blue-100 text-blue-800' },
  { id: 'angry', label: 'Angry', category: 'difficult', icon: '😤', color: 'bg-red-100 text-red-800' },
  { id: 'overwhelmed', label: 'Overwhelmed', category: 'difficult', icon: '😵', color: 'bg-orange-100 text-orange-800' },
  { id: 'lonely', label: 'Lonely', category: 'difficult', icon: '🌑', color: 'bg-violet-100 text-violet-800' },
  { id: 'anxious', label: 'Anxious', category: 'difficult', icon: '😰', color: 'bg-amber-100 text-amber-800' },
];

export const useEmotionTags = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [recentTags, setRecentTags] = useState<string[]>([]);

  const getSuggestedTags = useCallback((mood: MoodType): EmotionTag[] => {
    const moodToCategory: Record<MoodType, EmotionTag['category'][]> = {
      joy: ['positive'],
      calm: ['positive', 'processing'],
      hope: ['positive'],
      neutral: ['processing'],
      sadness: ['difficult', 'processing'],
      anger: ['difficult']
    };
    
    const categories = moodToCategory[mood] || ['processing'];
    return emotionTags.filter(tag => categories.includes(tag.category));
  }, []);

  const toggleTag = useCallback((tagId: string) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId];
      
      // Update recent tags
      if (!prev.includes(tagId)) {
        setRecentTags(current => {
          const updated = [tagId, ...current.filter(id => id !== tagId)];
          return updated.slice(0, 5); // Keep only 5 most recent
        });
      }
      
      return newTags;
    });
  }, []);

  const clearTags = useCallback(() => {
    setSelectedTags([]);
  }, []);

  const getTagById = useCallback((id: string): EmotionTag | undefined => {
    return emotionTags.find(tag => tag.id === id);
  }, []);

  const getTagsByCategory = useCallback((category: EmotionTag['category']): EmotionTag[] => {
    return emotionTags.filter(tag => tag.category === category);
  }, []);

  return {
    allTags: emotionTags,
    selectedTags,
    recentTags,
    getSuggestedTags,
    toggleTag,
    clearTags,
    getTagById,
    getTagsByCategory
  };
};
