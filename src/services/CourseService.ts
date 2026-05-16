import { CEFRLevel, Unit, Lesson } from '@/types/course';
import { ProgressEntry } from '@/types/user';

export interface UnitProgress {
  unit: Unit;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  isUnlocked: boolean;
  isCompleted: boolean;
}

export function getUnitProgress(
  unit: Unit,
  progressMap: Record<string, ProgressEntry>,
  units: Unit[],
): UnitProgress {
  const totalLessons = unit.lessons.length;
  const completedLessons = unit.lessons.filter((l) => progressMap[l.id]?.completed).length;

  // Check unlock
  let isUnlocked = false;
  const unlockReq = unit.unlockRequirement;
  if (unlockReq.type === 'always_unlocked') {
    isUnlocked = true;
  } else if (unlockReq.type === 'all_lessons_completed') {
    const targetUnit = units.find((u) => u.id === unlockReq.unitId);
    if (targetUnit) {
      isUnlocked = targetUnit.lessons.every((l) => progressMap[l.id]?.completed);
    }
  }

  return {
    unit,
    totalLessons,
    completedLessons,
    progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    isUnlocked,
    isCompleted: completedLessons === totalLessons && totalLessons > 0,
  };
}

export function getLevelProgress(level: CEFRLevel, progressMap: Record<string, ProgressEntry>) {
  let totalLessons = 0;
  let completedLessons = 0;

  for (const unit of level.units) {
    for (const lesson of unit.lessons) {
      totalLessons++;
      if (progressMap[lesson.id]?.completed) {
        completedLessons++;
      }
    }
  }

  return {
    totalLessons,
    completedLessons,
    progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
  };
}

export function getLastActiveLesson(
  progressMap: Record<string, ProgressEntry>,
  levels: CEFRLevel[],
): { levelId: string; unitId: string; lesson: Lesson } | null {
  // Find the latest unlocked lesson that isn't completed
  for (const level of levels) {
    for (const unit of level.units) {
      const unitProg = getUnitProgress(unit, progressMap, level.units);
      if (!unitProg.isUnlocked) continue;

      for (const lesson of unit.lessons) {
        if (!progressMap[lesson.id]?.completed) {
          return { levelId: level.id, unitId: unit.id, lesson };
        }
      }
    }
  }

  return null;
}
