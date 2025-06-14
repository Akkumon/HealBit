
import { MoodType } from '../types/index';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
    case "calm":
      return "text-green-500";
    case "hope":
      return "text-purple-500";
    default:
      return "text-gray-500";
  }
};
