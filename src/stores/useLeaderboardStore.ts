import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatarEmoji: string;
  xp: number;
  streak: number;
  level: number;
}

interface LeaderboardState {
  entries: LeaderboardEntry[];
  lastUpdated: string;
  updateEntries: (currentXp: number, currentStreak: number, currentLevel: number) => void;
}

const MOCK_NAMES = [
  { name: '英语达人', emoji: '🌟' },
  { name: '学习小能手', emoji: '📚' },
  { name: '单词王', emoji: '👑' },
  { name: '语言爱好者', emoji: '💬' },
  { name: '每日打卡者', emoji: '🔥' },
  { name: '语法大师', emoji: '📝' },
  { name: '口语达人', emoji: '🗣️' },
  { name: '听力高手', emoji: '👂' },
  { name: '阅读之星', emoji: '📖' },
];

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set) => ({
      entries: [],
      lastUpdated: '',

      updateEntries: (currentXp, currentStreak, currentLevel) => {
        const entries: LeaderboardEntry[] = MOCK_NAMES.map((mock) => ({
          rank: 0,
          name: mock.name,
          avatarEmoji: mock.emoji,
          xp: currentXp + Math.floor(Math.random() * 500 - 250),
          streak: Math.max(0, currentStreak + Math.floor(Math.random() * 10 - 5)),
          level: Math.max(1, currentLevel + Math.floor(Math.random() * 3 - 1)),
        }));

        // Insert user
        entries.push({
          rank: 0,
          name: '你',
          avatarEmoji: '🦉',
          xp: currentXp,
          streak: currentStreak,
          level: currentLevel,
        });

        // Sort by XP descending
        entries.sort((a, b) => b.xp - a.xp);
        entries.forEach((e, i) => (e.rank = i + 1));

        set({
          entries,
          lastUpdated: new Date().toISOString(),
        });
      },
    }),
    {
      name: 'duo_leaderboard',
    },
  ),
);
