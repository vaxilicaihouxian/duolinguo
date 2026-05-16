import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import styles from './PracticePage.module.css';

export default function PracticePage() {
  const navigate = useNavigate();

  return (
    <ErrorBoundary>
      <div className={styles.page}>
        <h1 className={styles.title}>练习中心</h1>
        <div className={styles.empty}>
          <span className={styles.emoji}>🏋️</span>
          <p className={styles.text}>完成一些课程后，这里可以复习错题和专项练习</p>
        </div>
        <button className={styles.reviewBtn} onClick={() => navigate('/learn')}>
          去学习新课程 →
        </button>
      </div>
    </ErrorBoundary>
  );
}
