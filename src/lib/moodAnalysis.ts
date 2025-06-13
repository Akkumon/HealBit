import { JournalEntry } from '@/types';

export const getDailyStreaks = (entries: JournalEntry[]): number => {
  if (entries.length === 0) return 0;

  const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let streak = 0;
  let lastDate: Date | null = null;

  for (let i = 0; i < sortedEntries.length; i++) {
    const currentDate = new Date(sortedEntries[i].date);
    currentDate.setHours(0, 0, 0, 0);

    if (lastDate === null) {
      streak = 1;
    } else {
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else if (diffDays > 1) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (currentDate.getTime() !== today.getTime() && currentDate.getTime() !== yesterday.getTime()) {
          streak = 1;
        }
      }
    }
    lastDate = currentDate;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (lastDate && lastDate.getTime() === yesterday.getTime() && streak > 0) {
    return streak;
  } else if (lastDate && lastDate.getTime() === today.getTime() && streak > 0) {
    return streak;
  }
  
  return streak;
};

export const getMoodFrequency = (entries: JournalEntry[]): Record<string, number> => {
  const frequency: Record<string, number> = {};
  entries.forEach(entry => {
    frequency[entry.mood] = (frequency[entry.mood] || 0) + 1;
  });
  return frequency;
};
