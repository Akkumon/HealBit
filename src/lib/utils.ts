import { MoodType } from '../types/index';

export const getMoodColorClass = (mood: MoodType) => {
  switch (mood) {
    case "joy":
      return "text-yellow-500";
    case "sadness":
      return "text-blue-500";
    case "anger":
      return "text-red-500";
    case "neutral":
      return "text-gray-500";
    default:
      return "text-gray-500";
  }
};

export function cn(...inputs: (string | undefined)[]) {
  return inputs.filter(Boolean).join(' ');
}
