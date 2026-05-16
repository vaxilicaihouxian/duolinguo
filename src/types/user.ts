export interface UserProfile {
  id: string;
  name: string;
  avatarEmoji: string;
  xp: number;
  level: number;
  gems: number;
  hearts: number;
  maxHearts: number;
  dailyGoal: number;
  dailyGoalMet: boolean;
  joinedAt: string;
}

export interface ProgressEntry {
  completed: boolean;
  score: number;
  bestScore: number;
  completedAt: string | null;
  attempts: number;
  stars: number;
}

export interface ProgressMap {
  [lessonId: string]: ProgressEntry;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  streakFreezes: number;
  history: string[];
}
