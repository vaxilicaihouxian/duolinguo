import { Achievement, ShopItem } from '@/types/game';

// ====== XP & Level ======

/** 每题完成基础 XP */
export const BASE_XP_PER_QUESTION = 10;

/** 无错误完成完美奖励 */
export const PERFECT_BONUS_XP = 5;

/** 每日目标达成奖励 XP */
export const DAILY_GOAL_BONUS_XP = 20;

/** 连续打卡额外 XP (第 N 天 = streakMultiplier[N] * BASE) */
export const STREAK_MULTIPLIER: Record<number, number> = {
  3: 1.5,
  7: 2,
  30: 3,
  100: 5,
};

/** 等级公式: Level N 需要的总 XP = 100*N + 50*(N-1)^2 */
export function xpForLevel(level: number): number {
  return 100 * level + 50 * (level - 1) * (level - 1);
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) {
    level++;
  }
  return level;
}

// ====== Hearts ======

export const DEFAULT_MAX_HEARTS = 5;
export const HEART_REGEN_INTERVAL_MS = 30 * 60 * 1000; // 30 min (not enforced in MVP)

// ====== Gems ======

export const GEMS_PER_LESSON = 5;
export const GEMS_PER_LEVEL_UP = 20;
export const GEMS_PER_ACHIEVEMENT = 50;

// ====== Streak ======

/** 连续打卡冻结卡保护天数 */
export const STREAK_FREEZE_DAYS = 1;

// ====== Daily Goal ======

export const DEFAULT_DAILY_GOAL = 1; // 至少完成 1 课

// ====== Shop ======

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'heart_refill',
    name: '红心补充',
    description: '补充 1 颗红心',
    icon: '❤️',
    price: 20,
    type: 'heart',
    quantity: 1,
  },
  {
    id: 'streak_freeze',
    name: '冻结卡',
    description: '保护连续打卡，断签不归零',
    icon: '🧊',
    price: 50,
    type: 'streak_freeze',
    quantity: 1,
  },
  {
    id: 'xp_boost',
    name: '双倍 XP 卡',
    description: '30 分钟内获得双倍 XP（跨会话有效）',
    icon: '⚡',
    price: 100,
    type: 'xp_boost',
    quantity: 1,
  },
];

// ====== Achievements ======

export const ACHIEVEMENTS: Achievement[] = [
  // Streak
  {
    id: 'streak-3',
    name: '初尝坚持',
    description: '连续学习 3 天',
    icon: '🔥',
    category: 'streak',
    condition: { type: 'streak', days: 3 },
  },
  {
    id: 'streak-7',
    name: '一周达人',
    description: '连续学习 7 天',
    icon: '🔥',
    category: 'streak',
    condition: { type: 'streak', days: 7 },
  },
  {
    id: 'streak-30',
    name: '月度学霸',
    description: '连续学习 30 天',
    icon: '🌟',
    category: 'streak',
    condition: { type: 'streak', days: 30 },
  },
  // Mastery
  {
    id: 'perfect-1',
    name: '完美通关',
    description: '完成 1 次零错误课程',
    icon: '💯',
    category: 'mastery',
    condition: { type: 'perfect_lesson', count: 1 },
  },
  {
    id: 'perfect-10',
    name: '完美主义者',
    description: '完成 10 次零错误课程',
    icon: '🏆',
    category: 'mastery',
    condition: { type: 'perfect_lesson', count: 10 },
  },
  // Volume
  {
    id: 'lessons-5',
    name: '初出茅庐',
    description: '完成 5 节课程',
    icon: '📚',
    category: 'volume',
    condition: { type: 'lessons_completed', count: 5 },
  },
  {
    id: 'lessons-20',
    name: '学习达人',
    description: '完成 20 节课程',
    icon: '📖',
    category: 'volume',
    condition: { type: 'lessons_completed', count: 20 },
  },
  {
    id: 'level-5',
    name: '升级达人',
    description: '达到等级 5',
    icon: '⬆️',
    category: 'volume',
    condition: { type: 'level_reached', level: 5 },
  },
  {
    id: 'level-10',
    name: '英语大师',
    description: '达到等级 10',
    icon: '👑',
    category: 'volume',
    condition: { type: 'level_reached', level: 10 },
  },
  {
    id: 'xp-1000',
    name: '千分俱乐部',
    description: '累计获得 1000 XP',
    icon: '🎯',
    category: 'volume',
    condition: { type: 'xp_total', amount: 1000 },
  },
  // Special
  {
    id: 'gems-100',
    name: '宝石收藏家',
    description: '收集 100 颗宝石',
    icon: '💎',
    category: 'special',
    condition: { type: 'gems_collected', amount: 100 },
  },
  {
    id: 'first-lesson',
    name: '第一步',
    description: '完成第一节课程',
    icon: '🎉',
    category: 'special',
    condition: { type: 'lessons_completed', count: 1 },
  },
];
