
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
  { id: 'peaceful', label: 'Peaceful', icon: '🕊️', category: 'positive', color: 'text-blue-600' },
  { id: 'loved', label: 'Loved', icon: '💝', category: 'positive', color: 'text-pink-600' },
  { id: 'proud', label: 'Proud', icon: '👏', category: 'positive', color: 'text-purple-600' },
  
  // Processing emotions
  { id: 'confused', label: 'Confused', icon: '🤔', category: 'processing', color: 'text-gray-600' },
  { id: 'nostalgic', label: 'Nostalgic', icon: '📸', category: 'processing', color: 'text-amber-600' },
  { id: 'reflective', label: 'Reflective', icon: '🪞', category: 'processing', color: 'text-indigo-600' },
  { id: 'curious', label: 'Curious', icon: '🔍', category: 'processing', color: 'text-teal-600' },
  
  // Difficult emotions
  { id: 'heartbroken', label: 'Heartbroken', icon: '💔', category: 'difficult', color: 'text-red-600' },
  { id: 'lonely', label: 'Lonely', icon: '🌙', category: 'difficult', color: 'text-slate-600' },
  { id: 'betrayed', label: 'Betrayed', icon: '🗡️', category: 'difficult', color: 'text-orange-600' },
  { id: 'overwhelmed', label: 'Overwhelmed', icon: '🌊', category: 'difficult', color: 'text-blue-800' },
  { id: 'regretful', label: 'Regretful', icon: '😔', category: 'difficult', color: 'text-brown-600' },
];

export const useEmotionTags = () => {
  const getSuggestedTags = (mood: MoodType): EmotionTag[] => {
    switch (mood) {
      case 'joy':
        return emotionTags.filter(tag => ['grateful', 'hopeful', 'loved', 'proud'].includes(tag.id));
      case 'calm':
        return emotionTags.filter(tag => ['peaceful', 'reflective', 'grateful'].includes(tag.id));
      case 'hope':
        return emotionTags.filter(tag => ['hopeful', 'curious', 'reflective'].includes(tag.id));
      case 'neutral':
        return emotionTags.filter(tag => ['confused', 'reflective', 'curious'].includes(tag.id));
      case 'sadness':
        return emotionTags.filter(tag => ['heartbroken', 'lonely', 'nostalgic', 'regretful'].includes(tag.id));
      case 'anger':
        return emotionTags.filter(tag => ['betrayed', 'overwhelmed', 'regretful'].includes(tag.id));
      default:
        return [];
    }
  };

  const getTagsByCategory = (category: EmotionTag['category']): EmotionTag[] => {
    return emotionTags.filter(tag => tag.category === category);
  };

  const toggleTag = (selectedTags: string[], tagId: string): string[] => {
    return selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
  };

  return {
    emotionTags,
    getSuggestedTags,
    getTagsByCategory,
    toggleTag,
  };
};
