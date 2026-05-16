import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, StreakData } from '@/types/user';
import { DEFAULT_MAX_HEARTS, DEFAULT_DAILY_GOAL, STREAK_FREEZE_DAYS } from '@/data/constants';

interface PlayerState {
  user: UserProfile;
  streak: StreakData;

  // User actions
  addXp: (amount: number) => void;
  setDailyGoalMet: (met: boolean) => void;
  removeHeart: () => void;
  restoreHeart: () => void;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;

  // Streak actions
  checkInToday: () => boolean;
  addStreakFreeze: () => void;
  useStreakFreeze: () => boolean;

  // Reset
  resetPlayer: () => void;
}

const defaultUser: UserProfile = {
  id: 'user-1',
  name: '学习者',
  avatarEmoji: '🦉',
  xp: 0,
  level: 1,
  gems: 50,
  hearts: DEFAULT_MAX_HEARTS,
  maxHearts: DEFAULT_MAX_HEARTS,
  dailyGoal: DEFAULT_DAILY_GOAL,
  dailyGoalMet: false,
  joinedAt: new Date().toISOString(),
};

const defaultStreak: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: '',
  streakFreezes: 0,
  history: [],
};

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      user: { ...defaultUser },
      streak: { ...defaultStreak },

      addXp: (amount) => {
        set((s) => {
          const newXp = s.user.xp + amount;
          const newLevel = Math.max(1, Math.floor(Math.sqrt(newXp / 50 + 1)));
          const didLevelUp = newLevel > s.user.level;
          return {
            user: {
              ...s.user,
              xp: newXp,
              level: newLevel,
              gems: didLevelUp ? s.user.gems + 20 : s.user.gems,
            },
          };
        });
      },

      setDailyGoalMet: (met) => {
        set((s) => ({
          user: { ...s.user, dailyGoalMet: met },
        }));
      },

      removeHeart: () => {
        const { user } = get();
        if (user.hearts > 0) {
          set({ user: { ...user, hearts: user.hearts - 1 } });
        }
      },

      restoreHeart: () => {
        const { user } = get();
        if (user.hearts < user.maxHearts) {
          set({ user: { ...user, hearts: user.hearts + 1 } });
        }
      },

      addGems: (amount) => {
        set((s) => ({ user: { ...s.user, gems: s.user.gems + amount } }));
      },

      spendGems: (amount) => {
        const { user } = get();
        if (user.gems >= amount) {
          set({ user: { ...user, gems: user.gems - amount } });
          return true;
        }
        return false;
      },

      checkInToday: () => {
        const today = getTodayStr();
        const { streak } = get();
        // Already checked in today
        if (streak.lastStudyDate === today) return false;

        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        let newStreak: number;

        if (streak.lastStudyDate === yesterday) {
          // Consecutive
          newStreak = streak.currentStreak + 1;
        } else if (streak.lastStudyDate === '') {
          // First time
          newStreak = 1;
        } else {
          // Gap - check freezes
          const gapDays = Math.floor(
            (new Date(today).getTime() - new Date(streak.lastStudyDate).getTime()) / 86400000,
          );
          if (gapDays <= STREAK_FREEZE_DAYS + 1 && streak.streakFreezes > 0) {
            // Use a freeze
            newStreak = streak.currentStreak + 1;
            set({ streak: { ...streak, streakFreezes: streak.streakFreezes - 1 } });
          } else {
            newStreak = 1;
          }
        }

        const updatedStreak = {
          ...get().streak,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, streak.longestStreak),
          lastStudyDate: today,
          history: [today, ...streak.history].slice(0, 365),
        };

        set({ streak: updatedStreak });
        return true;
      },

      addStreakFreeze: () => {
        set((s) => ({
          streak: { ...s.streak, streakFreezes: s.streak.streakFreezes + 1 },
        }));
      },

      useStreakFreeze: () => {
        const { streak } = get();
        if (streak.streakFreezes > 0) {
          set({
            streak: { ...streak, streakFreezes: streak.streakFreezes - 1 },
          });
          return true;
        }
        return false;
      },

      resetPlayer: () => {
        set({
          user: {
            ...defaultUser,
            id: 'user-1',
            joinedAt: new Date().toISOString(),
          },
          streak: { ...defaultStreak },
        });
      },
    }),
    {
      name: 'duo_player',
    },
  ),
);
