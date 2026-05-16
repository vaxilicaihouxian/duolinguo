import { QuestionType } from './course';

export interface QuizRecord {
  id: string;
  lessonId: string;
  questionId: string;
  questionType: QuestionType;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  xpEarned: number;
  createdAt: string;

  // SM-2 review fields
  interval: number;
  easeFactor: number;
  nextReviewDate: string;
  reviewCount: number;
}

export type AchievementCategory = 'streak' | 'mastery' | 'volume' | 'special';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  condition: AchievementCondition;
  unlockedAt?: string;
}

export type AchievementCondition =
  | { type: 'streak'; days: number }
  | { type: 'lessons_completed'; count: number }
  | { type: 'perfect_lesson'; count: number }
  | { type: 'level_reached'; level: number }
  | { type: 'xp_total'; amount: number }
  | { type: 'gems_collected'; amount: number }
  | { type: 'custom'; check: string };

export interface PersonalBest {
  totalXp: number;
  longestStreak: number;
  lessonsCompleted: number;
  perfectLessons: number;
  highestLevel: number;
  updatedAt: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  type: 'heart' | 'streak_freeze' | 'xp_boost';
  quantity: number;
}
