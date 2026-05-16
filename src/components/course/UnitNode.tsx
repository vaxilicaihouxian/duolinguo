import { useState } from 'react';
import { Collapse } from 'antd-mobile';
import { ProgressEntry } from '@/types/user';
import { UnitProgress } from '@/services/CourseService';
import LessonCard from './LessonCard';
import styles from './UnitNode.module.css';

interface Props {
  unitProgress: UnitProgress;
  progress: Record<string, ProgressEntry>;
  isFirst: boolean;
}

export default function UnitNode({ unitProgress, progress, isFirst }: Props) {
  const [expanded, setExpanded] = useState(isFirst);
  const { unit, totalLessons, completedLessons, isUnlocked, isCompleted } = unitProgress;

  return (
    <div className={`${styles.node} ${!isUnlocked ? styles.locked : ''}`}>
      <div className={styles.header} onClick={() => isUnlocked && setExpanded(!expanded)}>
        <div className={styles.info}>
          <span className={styles.icon}>
            {isCompleted ? '✅' : isUnlocked ? '📖' : '🔒'}
          </span>
          <div>
            <h3 className={styles.title}>{unit.title}</h3>
            <p className={styles.subtitle}>
              {completedLessons}/{totalLessons} 课完成
              {isCompleted && <span className={styles.completedTag}> · 已完成</span>}
              {!isUnlocked && (
                <span className={styles.lockedTag}> · 需完成前置单元</span>
              )}
            </p>
          </div>
        </div>
        {isUnlocked && (
          <span className={`${styles.arrow} ${expanded ? styles.expanded : ''}`}>
            ▼
          </span>
        )}
      </div>

      {isUnlocked && (
        <Collapse
          style={{ '--border-inner': 'none', '--border-top': 'none' } as React.CSSProperties}
        >
          <Collapse.Panel
            key={unit.id}
            title=""
            style={{ '--header-padding': '0' } as React.CSSProperties}
          >
            <div className={styles.lessons}>
              {unit.lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  unitId={unit.id}
                  progress={progress[lesson.id]}
                />
              ))}
            </div>
          </Collapse.Panel>
        </Collapse>
      )}
    </div>
  );
}
