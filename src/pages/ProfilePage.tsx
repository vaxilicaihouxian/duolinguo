import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useProgressStore } from '@/stores/useProgressStore';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = usePlayerStore((s) => s.user);
  const streak = usePlayerStore((s) => s.streak);
  const personalBest = useProgressStore((s) => s.personalBest);

  return (
    <ErrorBoundary>
      <div className={styles.page}>
        <div className={styles.header}>
          <span className={styles.avatar}>{user.avatarEmoji}</span>
          <h1 className={styles.name}>{user.name}</h1>
          <p className={styles.level}>等级 {user.level}</p>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{user.xp}</span>
            <span className={styles.statLabel}>总 XP</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{streak.longestStreak}🔥</span>
            <span className={styles.statLabel}>最长打卡</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{personalBest.lessonsCompleted}</span>
            <span className={styles.statLabel}>完成课程</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{user.gems}💎</span>
            <span className={styles.statLabel}>宝石</span>
          </div>
        </div>

        <div className={styles.menu}>
          <button className={styles.menuItem} onClick={() => navigate('/personal-best')}>
            <span>🏆 个人记录</span>
            <span className={styles.arrow}>›</span>
          </button>
          <button className={styles.menuItem} onClick={() => navigate('/achievements')}>
            <span>🎖 成就徽章</span>
            <span className={styles.arrow}>›</span>
          </button>
          <button className={styles.menuItem} onClick={() => navigate('/shop')}>
            <span>🛍 宝石商城</span>
            <span className={styles.arrow}>›</span>
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
}
