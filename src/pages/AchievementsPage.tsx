import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useProgressStore } from '@/stores/useProgressStore';
import styles from './AchievementsPage.module.css';

export default function AchievementsPage() {
  const achievements = useProgressStore((s) => s.achievements);

  return (
    <ErrorBoundary>
      <div className={styles.page}>
        <h1 className={styles.title}>🎖 成就徽章</h1>
        <div className={styles.grid}>
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`${styles.badge} ${a.unlockedAt ? styles.unlocked : styles.locked}`}
            >
              <span className={styles.icon}>{a.icon}</span>
              <span className={styles.name}>{a.name}</span>
              <span className={styles.desc}>{a.description}</span>
              {a.unlockedAt ? (
                <span className={styles.status}>✅ 已解锁</span>
              ) : (
                <span className={styles.status}>🔒 未解锁</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
