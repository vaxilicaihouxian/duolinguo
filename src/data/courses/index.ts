import { CEFRLevel } from '@/types/course';
import a1Data from './a1.json';
import a2Data from './a2.json';
import b1Data from './b1.json';
import b2Data from './b2.json';

/* JSON imports widen literal types to string — we trust the hand-maintained data */
const toLevel = (d: typeof a1Data): CEFRLevel =>
  ({ ...d.level, units: d.units } as CEFRLevel);

export const courseTree: CEFRLevel[] = [
  toLevel(a1Data),
  toLevel(a2Data),
  toLevel(b1Data),
  toLevel(b2Data),
];

export function getAllLessons(): { unitId: string; lessonId: string }[] {
  const result: { unitId: string; lessonId: string }[] = [];
  for (const level of courseTree) {
    for (const unit of level.units) {
      for (const lesson of unit.lessons) {
        result.push({ unitId: unit.id, lessonId: lesson.id });
      }
    }
  }
  return result;
}

export function getLessonById(lessonId: string) {
  for (const level of courseTree) {
    for (const unit of level.units) {
      const lesson = unit.lessons.find((l) => l.id === lessonId);
      if (lesson) return { level, unit, lesson };
    }
  }
  return null;
}

export function getNextLesson(currentLessonId: string) {
  const all = getAllLessons();
  const idx = all.findIndex((l) => l.lessonId === currentLessonId);
  if (idx === -1 || idx >= all.length - 1) return null;
  return all[idx + 1];
}
