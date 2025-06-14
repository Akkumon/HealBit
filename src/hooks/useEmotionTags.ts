
import { MoodType } from '@/types';

export interface EmotionTag {
  id: string;
  label: string;
  icon: string;
  category: 'positive' | 'processing' | 'difficult';
  color: string;
}

const emotionTags: EmotionTag[] = [
  // Positive emotions
  { id: 'grateful', label: 'Grateful', icon: '🙏', category: 'positive', color: 'text-green-600' },
  { id: 'hopeful', label: 'Hopeful', icon: '🌟', category: 'positive', color: 'text-yellow-600' },
  { id: 'peaceful', label: 'Peaceful', icon: '🕊️', category: 'positive', color: 'text-blue-500' },
  { id: 'content', label: 'Content', icon: '😌', category: 'positive', color: 'text-green-500' },
  
  // Processing emotions
  { id: 'reflective', label: 'Reflective', icon: '🤔', category: 'processing', color: 'text-purple-600' },
  { id: 'uncertain', label: 'Uncertain', icon: '😕', category: 'processing', color: 'text-gray-600' },
  { id: 'contemplative', label: 'Contemplative', icon: '💭', category: 'processing', color: 'text-indigo-600' },
  
  // Difficult emotions
  { id: 'heartbroken', label: 'Heartbroken', icon: '💔', category: 'difficult', color: 'text-red-600' },
  { id: 'lonely', label: 'Lonely', icon: '😔', category: 'difficult', color: 'text-blue-700' },
  { id: 'overwhelmed', label: 'Overwhelmed', icon: '😵', category: 'difficult', color: 'text-orange-600' },
  { id: 'frustrated', label: 'Frustrated', icon: '😤', category: 'difficult', color: 'text-red-500' },
];

export const useEmotionTags = () => {
  const getSuggestedTags = (mood: MoodType): EmotionTag[] => {
    switch (mood) {
      case 'joy':
        return emotionTags.filter(tag => ['grateful', 'hopeful', 'content'].includes(tag.id));
      case 'calm':
        return emotionTags.filter(tag => ['peaceful', 'content', 'reflective'].includes(tag.id));
      case 'hope':
        return emotionTags.filter(tag => ['hopeful', 'grateful', 'contemplative'].includes(tag.id));
      case 'sadness':
        return emotionTags.filter(tag => ['heartbroken', 'lonely', 'reflective'].includes(tag.id));
      case 'anger':
        return emotionTags.filter(tag => ['frustrated', 'overwhelmed', 'contemplative'].includes(tag.id));
      default:
        return emotionTags.filter(tag => ['reflective', 'uncertain', 'contemplative'].includes(tag.id));
    }
  };

  const getTagsByCategory = (category: EmotionTag['category']): EmotionTag[] => {
    return emotionTags.filter(tag => tag.category === category);
  };

  const getAllTags = (): EmotionTag[] => {
    return emotionTags;
  };

  return {
    getSuggestedTags,
    getTagsByCategory,
    getAllTags,
  };
};
