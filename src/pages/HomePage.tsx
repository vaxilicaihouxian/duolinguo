import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useProgressStore } from '@/stores/useProgressStore';
import { courseTree } from '@/data/courses';
import { getLastActiveLesson } from '@/services/CourseService';
import { storageService } from '@/services/StorageService';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();
  const user = usePlayerStore((s) => s.user);
  const streak = usePlayerStore((s) => s.streak);
  const progress = useProgressStore((s) => s.progress);

  const lastActive = getLastActiveLesson(progress, courseTree);

  const handleExport = () => {
    const json = storageService.exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `duolingo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          storageService.importAll(reader.result as string);
          window.location.reload();
        } catch {
          alert('导入失败：数据格式不正确');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const xpForNext = 100 * (user.level + 1) + 50 * user.level * user.level;
  const xpForCurrent = 100 * user.level + 50 * (user.level - 1) * (user.level - 1);
  const xpProgress = Math.round(((user.xp - xpForCurrent) / (xpForNext - xpForCurrent)) * 100);

  const hasProgress = Object.values(progress).some((p) => p.completed);

  return (
    <ErrorBoundary>
      <div className={styles.page}>
        {hasProgress ? (
          <>
            <div className={styles.header}>
              <div className={styles.streakBadge}>
                🔥 {streak.currentStreak}
              </div>
              <div className={styles.gemBadge}>
                💎 {user.gems}
              </div>
            </div>

            <div className={styles.hero}>
              <span className={styles.owl}>🦉</span>
              <h1 className={styles.greeting}>继续加油！</h1>
              <div className={styles.levelBadge}>等级 {user.level}</div>
              <div className={styles.xpBar}>
                <div className={styles.xpFill} style={{ width: `${Math.min(xpProgress, 100)}%` }} />
              </div>
              <p className={styles.xpText}>{user.xp} / {xpForNext} XP</p>
            </div>

            <div className={styles.actions}>
              {lastActive ? (
                <button
                  className={styles.primaryBtn}
                  onClick={() => navigate(`/lesson/${lastActive.lesson.id}?unitId=${lastActive.unitId}`)}
                >
                  继续学习
                </button>
              ) : (
                <button
                  className={styles.primaryBtn}
                  onClick={() => navigate('/learn')}
                >
                  开始学习
                </button>
              )}
            </div>

            <div className={styles.tools}>
              <button className={styles.toolBtn} onClick={handleExport}>
                📤 导出数据
              </button>
              <button className={styles.toolBtn} onClick={handleImport}>
                📥 导入数据
              </button>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <span className={styles.emptyOwl}>🦉</span>
            <h1 className={styles.emptyTitle}>欢迎来到英语学习！</h1>
            <p className={styles.emptyDesc}>
              每天 5 分钟，轻松学英语{'\n'}
              从最简单的问候语开始吧！
            </p>
            <button
              className={styles.startBtn}
              onClick={() => navigate('/learn')}
            >
              开始你的第一节英语课吧！
            </button>
            <div className={styles.emptyTools}>
              <button className={styles.toolBtn} onClick={handleImport}>
                📥 导入备份数据
              </button>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
