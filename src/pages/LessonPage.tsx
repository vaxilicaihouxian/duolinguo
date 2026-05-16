import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { getLessonById } from '@/data/courses';
import QuizEngine from '@/components/quiz/QuizEngine';
import styles from './LessonPage.module.css';

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const unitId = searchParams.get('unitId') || '';

  const result = lessonId ? getLessonById(lessonId) : null;

  if (!result || !lessonId) {
    return (
      <div className={styles.notFound}>
        <p>课程不存在</p>
        <button onClick={() => navigate('/learn')}>返回学习</button>
      </div>
    );
  }

  const { lesson } = result;

  const handleComplete = (score: number, xpEarned: number) => {
    Toast.show({
      content: `课程完成！得分 ${score}%，获得 ${xpEarned} XP`,
      duration: 3000,
    });
    navigate('/learn', { replace: true });
  };

  const handleFail = () => {
    Toast.show({
      content: '红心用完了，请重试！',
      duration: 2000,
    });
  };

  return (
    <ErrorBoundary>
      <div className={styles.page}>
        <header className={styles.header}>
          <button className={styles.back} onClick={() => navigate(-1)}>
            ✕
          </button>
          <h1 className={styles.title}>{lesson.title}</h1>
          <div className={styles.spacer} />
        </header>
        <QuizEngine
          lesson={lesson}
          lessonId={lessonId}
          unitId={unitId}
          onComplete={handleComplete}
          onFail={handleFail}
        />
      </div>
    </ErrorBoundary>
  );
}
