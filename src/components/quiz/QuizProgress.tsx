import styles from './QuizEngine.module.css';

interface Props {
  current: number;
  total: number;
  hearts: number;
  maxHearts: number;
  xp: number;
}

export default function QuizProgress({ current, total, hearts, maxHearts, xp }: Props) {
  return (
    <div className={styles.progressBar}>
      <div className={styles.progressTop}>
        <div className={styles.hearts}>
          {Array.from({ length: maxHearts }, (_, i) => (
            <span
              key={i}
              className={`${styles.heart} ${i < hearts ? styles.heartActive : styles.heartEmpty}`}
            >
              {i < hearts ? '❤️' : '🤍'}
            </span>
          ))}
        </div>
        <span className={styles.xpBadge}>⚡ {xp} XP</span>
      </div>
      <div className={styles.track}>
        <div
          className={styles.trackFill}
          style={{ width: `${Math.round((current / total) * 100)}%` }}
        />
      </div>
      <span className={styles.counter}>
        {current} / {total}
      </span>
    </div>
  );
}
