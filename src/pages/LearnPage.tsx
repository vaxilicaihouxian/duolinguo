import { useState } from 'react';
import { Tabs, SpinLoading } from 'antd-mobile';
import { useProgressStore } from '@/stores/useProgressStore';
import { courseTree } from '@/data/courses';
import { getLevelProgress } from '@/services/CourseService';
import SkillTree from '@/components/course/SkillTree';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import styles from './LearnPage.module.css';

function getLevelEmoji(levelId: string): string {
  switch (levelId) {
    case 'a1': return '🌱';
    case 'a2': return '🌿';
    case 'b1': return '🌳';
    case 'b2': return '🏔️';
    default: return '📚';
  }
}

export default function LearnPage() {
  const [activeLevel, setActiveLevel] = useState('a1');
  const progress = useProgressStore((s) => s.progress);

  const activeLevelData = courseTree.find((l) => l.id === activeLevel);

  return (
    <ErrorBoundary>
      <div className={styles.page}>
        <h1 className={styles.title}>学习路径</h1>
        <Tabs
          activeKey={activeLevel}
          onChange={(key) => setActiveLevel(key)}
          className={styles.tabs}
        >
          {courseTree.map((level) => {
            const prog = getLevelProgress(level, progress);
            return (
              <Tabs.Tab
                title={
                  <span className={styles.tabLabel}>
                    {getLevelEmoji(level.id)} {level.name}
                    {prog.progress > 0 && (
                      <span className={styles.tabProgress}> {prog.progress}%</span>
                    )}
                  </span>
                }
                key={level.id}
              />
            );
          })}
        </Tabs>

        {activeLevelData && activeLevelData.units.length > 0 ? (
          <SkillTree
            units={activeLevelData.units}
            progress={progress}
          />
        ) : activeLevelData && activeLevelData.units.length === 0 ? (
          <div className={styles.emptyLevel}>
            <SpinLoading style={{ '--size': '32px' }} />
            <p className={styles.emptyText}>即将上线，敬请期待！</p>
          </div>
        ) : null}
      </div>
    </ErrorBoundary>
  );
}
