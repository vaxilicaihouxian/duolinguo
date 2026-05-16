import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProgressEntry, ProgressMap } from '@/types/user';
import { QuizRecord, Achievement, PersonalBest } from '@/types/game';
import { ACHIEVEMENTS } from '@/data/constants';
import { usePlayerStore } from './usePlayerStore';

interface ProgressState {
  progress: ProgressMap;
  quizHistory: QuizRecord[];
  achievements: Achievement[];
  personalBest: PersonalBest;

  completeLesson: (lessonId: string, score: number) => void;
  getLessonProgress: (lessonId: string) => ProgressEntry | undefined;
  addQuizRecord: (record: QuizRecord) => void;
  getDueReviews: () => QuizRecord[];
  checkAchievements: () => Achievement[];
  updatePersonalBest: () => void;
}

const defaultProgressEntry: ProgressEntry = {
  completed: false,
  score: 0,
  bestScore: 0,
  completedAt: null,
  attempts: 0,
  stars: 0,
};

const defaultPersonalBest: PersonalBest = {
  totalXp: 0,
  longestStreak: 0,
  lessonsCompleted: 0,
  perfectLessons: 0,
  highestLevel: 1,
  updatedAt: new Date().toISOString(),
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      quizHistory: [],
      achievements: ACHIEVEMENTS.map((a) => ({ ...a })),
      personalBest: { ...defaultPersonalBest },

      completeLesson: (lessonId, score) => {
        const { progress } = get();
        const current = progress[lessonId] || { ...defaultProgressEntry };
        const stars = score >= 90 ? 3 : score >= 70 ? 2 : 1;

        set({
          progress: {
            ...progress,
            [lessonId]: {
              ...current,
              completed: true,
              score: Math.max(current.bestScore, score),
              bestScore: Math.max(current.bestScore, score),
              completedAt: new Date().toISOString(),
              attempts: current.attempts + 1,
              stars: Math.max(current.stars || 0, stars),
            },
          },
        });

        get().updatePersonalBest();
      },

      getLessonProgress: (lessonId) => {
        return get().progress[lessonId] || { ...defaultProgressEntry };
      },

      addQuizRecord: (record) => {
        set((s) => ({
          quizHistory: [record, ...s.quizHistory].slice(0, 200),
        }));
      },

      getDueReviews: () => {
        const today = new Date().toISOString().slice(0, 10);
        return get()
          .quizHistory.filter(
            (r) => r.nextReviewDate <= today && r.reviewCount < 5,
          )
          .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate));
      },

      checkAchievements: () => {
        const { progress } = get();
        const player = usePlayerStore.getState();

        const lessonsCompleted = Object.values(progress).filter((p) => p.completed).length;
        const perfectLessons = Object.values(progress).filter((p) => p.score === 100).length;

        const newlyUnlocked: Achievement[] = [];

        set((s) => {
          const updated = s.achievements.map((a) => {
            if (a.unlockedAt) return a;

            let shouldUnlock = false;
            switch (a.condition.type) {
              case 'streak':
                shouldUnlock = player.streak.currentStreak >= a.condition.days;
                break;
              case 'lessons_completed':
                shouldUnlock = lessonsCompleted >= a.condition.count;
                break;
              case 'perfect_lesson':
                shouldUnlock = perfectLessons >= a.condition.count;
                break;
              case 'level_reached':
                shouldUnlock = player.user.level >= a.condition.level;
                break;
              case 'xp_total':
                shouldUnlock = player.user.xp >= a.condition.amount;
                break;
              case 'gems_collected':
                shouldUnlock = player.user.gems >= a.condition.amount;
                break;
            }

            if (shouldUnlock) {
              const unlocked = { ...a, unlockedAt: new Date().toISOString() };
              newlyUnlocked.push(unlocked);
              player.addGems(50);
              return unlocked;
            }
            return a;
          });

          return { achievements: updated };
        });

        return newlyUnlocked;
      },

      updatePersonalBest: () => {
        const { progress, quizHistory } = get();
        const player = usePlayerStore.getState();

        const lessonsCompleted = Object.values(progress).filter((p) => p.completed).length;
        const perfectLessons = Object.values(progress).filter((p) => p.score === 100).length;
        const totalXp = quizHistory.reduce((sum, r) => sum + r.xpEarned, 0);

        set({
          personalBest: {
            totalXp,
            longestStreak: player.streak.longestStreak,
            lessonsCompleted,
            perfectLessons,
            highestLevel: player.user.level,
            updatedAt: new Date().toISOString(),
          },
        });
      },
    }),
    {
      name: 'duo_progress',
    },
  ),
);
