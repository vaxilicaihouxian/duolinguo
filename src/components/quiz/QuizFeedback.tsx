import { motion } from 'framer-motion';
import styles from './QuizEngine.module.css';

interface Props {
  type: 'correct' | 'incorrect';
  correctAnswer: string;
  userAnswer: string;
  onDismiss: () => void;
}

export default function QuizFeedback({ type, correctAnswer, userAnswer, onDismiss }: Props) {
  return (
    <motion.div
      className={styles.feedbackOverlay}
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className={`${styles.feedbackContent} ${type === 'correct' ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
        <div className={styles.feedbackIcon}>
          {type === 'correct' ? '🎉' : '❌'}
        </div>
        <h3 className={styles.feedbackTitle}>
          {type === 'correct' ? '回答正确！' : '回答错误'}
        </h3>
        {type === 'incorrect' && (
          <div className={styles.correction}>
            <p className={styles.userAnswer}>
              你的答案：<span className={styles.wrongText}>{userAnswer}</span>
            </p>
            <p className={styles.correctAnswer}>
              正确答案：<span className={styles.rightText}>{correctAnswer}</span>
            </p>
          </div>
        )}
        <button className={styles.nextBtn} onClick={onDismiss}>
          {type === 'correct' ? '继续' : '知道了'}
        </button>
      </div>
    </motion.div>
  );
}
