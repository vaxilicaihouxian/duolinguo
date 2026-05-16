import { motion } from 'framer-motion';
import styles from './QuizEngine.module.css';

interface Props {
  score: number;
  xpEarned: number;
  correctCount: number;
  totalCount: number;
}

export default function QuizSummary({ score, xpEarned, correctCount, totalCount }: Props) {
  const isPerfect = correctCount === totalCount;
  const stars = score >= 90 ? 3 : score >= 70 ? 2 : 1;

  return (
    <motion.div
      className={styles.summary}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
    >
      <div className={styles.summaryIcon}>{isPerfect ? '🏆' : '🎉'}</div>
      <h2 className={styles.summaryTitle}>
        {isPerfect ? '完美通关！' : '课程完成！'}
      </h2>

      <div className={styles.starsRow}>
        {[1, 2, 3].map((s) => (
          <span
            key={s}
            className={`${styles.star} ${s <= stars ? styles.starActive : styles.starInactive}`}
          >
            ★
          </span>
        ))}
      </div>

      <div className={styles.statGrid}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{score}%</span>
          <span className={styles.statLabel}>正确率</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>⚡{xpEarned}</span>
          <span className={styles.statLabel}>获得 XP</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>
            {correctCount}/{totalCount}
          </span>
          <span className={styles.statLabel}>正确题数</span>
        </div>
      </div>
    </motion.div>
  );
}
