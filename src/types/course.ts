// ====== Question Types ======

export type QuestionType = 'choice' | 'fill-blank' | 'translation' | 'listening' | 'speaking';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  correctAnswer: string;
  acceptableAnswers?: string[];
  hint?: string;
  difficulty: 1 | 2 | 3;
}

export interface ChoiceQuestion extends BaseQuestion {
  type: 'choice';
  options: string[];
  correctIndex: number;
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill-blank';
  context?: string;
}

export interface TranslationQuestion extends BaseQuestion {
  type: 'translation';
  direction: 'zh-to-en' | 'en-to-zh';
}

export interface ListeningQuestion extends BaseQuestion {
  type: 'listening';
  audioText: string;
}

export interface SpeakingQuestion extends BaseQuestion {
  type: 'speaking';
  targetText: string;
  scoringThreshold: number;
}

/** 当前题型（5种） */
export type Question =
  | ChoiceQuestion
  | FillBlankQuestion
  | TranslationQuestion
  | ListeningQuestion
  | SpeakingQuestion;

// ====== Course Structure ======

export interface Lesson {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  unlockRequirement: UnlockRule;
}

export interface CEFRLevel {
  id: string;
  name: string;
  description: string;
  color: string;
  units: Unit[];
}

// ====== Unlock Rules ======

export type UnlockRule =
  | { type: 'always_unlocked' }
  | { type: 'all_lessons_completed'; unitId: string };

export function isUnitUnlocked(rule: UnlockRule, completedLessonIds: Set<string>, units: Unit[]): boolean {
  if (rule.type === 'always_unlocked') return true;

  if (rule.type === 'all_lessons_completed') {
    const targetUnit = units.find((u) => u.id === rule.unitId);
    if (!targetUnit) return false;
    const allLessonIds = targetUnit.lessons.map((l) => l.id);
    return allLessonIds.every((id) => completedLessonIds.has(id));
  }

  return false;
}

