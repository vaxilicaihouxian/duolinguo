import { useNavigate } from 'react-router-dom';
import { ProgressBar } from 'antd-mobile';
import { Lesson } from '@/types/course';
import { ProgressEntry } from '@/types/user';
import styles from './LessonCard.module.css';

interface Props {
  lesson: Lesson;
  unitId: string;
  progress?: ProgressEntry;
}

export default function LessonCard({ lesson, unitId, progress }: Props) {
  const navigate = useNavigate();
  const isComplete = progress?.completed ?? false;
  const stars = progress?.stars ?? 0;
  const handleStart = () => {
    navigate(`/lesson/${lesson.id}?unitId=${unitId}`);
  };

  return (
    <div className={`${styles.card} ${isComplete ? styles.complete : ''}`} onClick={handleStart}>
      <div className={styles.left}>
        <span className={styles.emoji}>{isComplete ? '🏆' : '📝'}</span>
      </div>
      <div className={styles.center}>
        <h4 className={styles.title}>{lesson.title}</h4>
        <p className={styles.desc}>{lesson.description}</p>
        <div className={styles.meta}>
          <span className={styles.count}>{lesson.questions.length} 题</span>
          {isComplete && (
            <span className={styles.stars}>
              {Array.from({ length: 3 }, (_, i) => (
                <span key={i} className={i < stars ? styles.starActive : styles.starInactive}>
                  ★
                </span>
              ))}
            </span>
          )}
        </div>
        {isComplete && progress?.score !== undefined && (
          <ProgressBar
            percent={progress.score}
            style={{
              '--track-width': '3px',
              '--fill-color': stars >= 3 ? '#ffc800' : stars >= 2 ? '#58cc02' : '#1cb0f6',
              '--track-color': '#f0f0f0',
              marginTop: '6px',
              maxWidth: '200px',
            } as React.CSSProperties}
          />
        )}
      </div>
      <div className={styles.right}>
        {isComplete ? (
          <span className={styles.retry}>复习</span>
        ) : (
          <span className={styles.start}>开始</span>
        )}
      </div>
    </div>
  );
}
