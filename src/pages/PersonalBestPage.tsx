import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useProgressStore } from '@/stores/useProgressStore';
import styles from './PersonalBestPage.module.css';

export default function PersonalBestPage() {
  const personalBest = useProgressStore((s) => s.personalBest);

  const records = [
    { label: '累计 XP', value: personalBest.totalXp, icon: '⚡' },
    { label: '最长连续打卡', value: `${personalBest.longestStreak} 天`, icon: '🔥' },
    { label: '完成课程数', value: personalBest.lessonsCompleted, icon: '📚' },
    { label: '完美课程数', value: personalBest.perfectLessons, icon: '💯' },
    { label: '最高等级', value: personalBest.highestLevel, icon: '👑' },
  ];

  return (
    <ErrorBoundary>
      <div className={styles.page}>
        <h1 className={styles.title}>🏆 个人记录</h1>
        <div className={styles.records}>
          {records.map((r) => (
            <div key={r.label} className={styles.record}>
              <span className={styles.icon}>{r.icon}</span>
              <span className={styles.label}>{r.label}</span>
              <span className={styles.value}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
