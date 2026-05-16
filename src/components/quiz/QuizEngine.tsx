import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Lesson } from '@/types/course';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useProgressStore } from '@/stores/useProgressStore';
import { BASE_XP_PER_QUESTION, PERFECT_BONUS_XP } from '@/data/constants';
import QuizProgress from './QuizProgress';
import QuizFeedback from './QuizFeedback';
import QuizSummary from './QuizSummary';
import ChoiceQuestionComponent from './ChoiceQuestion';
import FillBlankQuestionComponent from './FillBlankQuestion';
import TranslationQuestionComponent from './TranslationQuestion';
import ListeningQuestionComponent from './ListeningQuestion';
import SpeakingQuestionComponent from './SpeakingQuestion';
import styles from './QuizEngine.module.css';

interface Props {
  lesson: Lesson;
  lessonId: string;
  unitId: string;
  onComplete: (score: number, xpEarned: number) => void;
  onFail: () => void;
}

type FeedbackType = 'correct' | 'incorrect' | null;

export default function QuizEngine({ lesson, lessonId, unitId, onComplete, onFail }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(null);
  const [lastAnswer, setLastAnswer] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  const removeHeart = usePlayerStore((s) => s.removeHeart);
  const addXp = usePlayerStore((s) => s.addXp);
  const hearts = usePlayerStore((s) => s.user.hearts);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const checkInToday = usePlayerStore((s) => s.checkInToday);
  const checkAchievements = useProgressStore((s) => s.checkAchievements);

  void unitId; // Reserved for quiz record tracking

  const questions = lesson.questions;
  const currentQuestion = questions[currentIndex];

  const handleAnswer = useCallback(
    (answer: string) => {
      const question = questions[currentIndex];
      const acceptableAnswers = question.acceptableAnswers || [];
      const correctAnswer = 'correctIndex' in question
        ? question.options[question.correctIndex]
        : question.correctAnswer;

      const normalize = (s: string) =>
        s.toLowerCase().replace(/[.,!?;:'"]/g, ' ').replace(/\s+/g, ' ').trim();

      const isStrict =
        answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase() ||
        acceptableAnswers.some((a) => answer.trim().toLowerCase() === a.trim().toLowerCase());

      const isLenient =
        question.type === 'listening' || question.type === 'speaking'
          ? normalize(answer) === normalize(correctAnswer) ||
            acceptableAnswers.some((a) => normalize(answer) === normalize(a))
          : false;

      const isCorrect = isStrict || isLenient;

      setLastAnswer(answer);

      if (isCorrect) {
        setCorrectCount((c) => c + 1);
        const xp = BASE_XP_PER_QUESTION;
        setTotalXp((prev) => prev + xp);
        addXp(xp);
        setFeedbackType('correct');
      } else {
        removeHeart();
        setFeedbackType('incorrect');
      }
    },
    [currentIndex, questions, addXp, removeHeart],
  );

  const handleFeedbackDismiss = useCallback(() => {
    setFeedbackType(null);

    // Check if we need to fail (hearts at 0 after decrement)
    const currentHearts = usePlayerStore.getState().user.hearts;
    if (feedbackType === 'incorrect' && currentHearts <= 0) {
      setHasFailed(true);
      onFail();
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      // Course complete
      const isPerfect = correctCount === questions.length;
      const bonusXp = isPerfect ? PERFECT_BONUS_XP * questions.length : 0;
      const score = Math.round((correctCount / questions.length) * 100);
      const finalXp = totalXp + bonusXp;

      if (bonusXp > 0) {
        addXp(bonusXp);
        setTotalXp((prev) => prev + bonusXp);
      }

      completeLesson(lessonId, score);
      checkInToday();
      checkAchievements();
      setIsComplete(true);
      onComplete(score, finalXp);
    } else {
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, correctCount, totalXp, questions.length, feedbackType, lessonId,
    addXp, completeLesson, checkInToday, checkAchievements, onComplete, onFail]);

  // Re-check hearts when feedback dismisses (after removeHeart took effect)
  const effectiveHearts = hasFailed ? 0 : hearts;

  if (isComplete) {
    const score = Math.round((correctCount / questions.length) * 100);
    return (
      <QuizSummary
        score={score}
        xpEarned={totalXp}
        correctCount={correctCount}
        totalCount={questions.length}
      />
    );
  }

  if (hasFailed) {
    return (
      <div className={styles.failContainer}>
        <div className={styles.failIcon}>💔</div>
        <h2 className={styles.failTitle}>红心用完了</h2>
        <p className={styles.failDesc}>别灰心，再试一次吧！</p>
      </div>
    );
  }

  return (
    <div className={styles.engine}>
      <QuizProgress
        current={currentIndex + 1}
        total={questions.length}
        hearts={effectiveHearts}
        maxHearts={5}
        xp={totalXp}
      />

      <div className={styles.questionArea}>
        {currentQuestion && (
          <>
            {currentQuestion.type === 'choice' && (
              <ChoiceQuestionComponent
                question={currentQuestion}
                onAnswer={handleAnswer}
                disabled={feedbackType !== null}
                feedbackType={feedbackType}
              />
            )}
            {currentQuestion.type === 'fill-blank' && (
              <FillBlankQuestionComponent
                question={currentQuestion}
                onAnswer={handleAnswer}
                disabled={feedbackType !== null}
                feedbackType={feedbackType}
              />
            )}
            {currentQuestion.type === 'translation' && (
              <TranslationQuestionComponent
                question={currentQuestion}
                onAnswer={handleAnswer}
                disabled={feedbackType !== null}
                feedbackType={feedbackType}
              />
            )}
            {currentQuestion.type === 'listening' && (
              <ListeningQuestionComponent
                question={currentQuestion}
                onAnswer={handleAnswer}
                disabled={feedbackType !== null}
                feedbackType={feedbackType}
              />
            )}
            {currentQuestion.type === 'speaking' && (
              <SpeakingQuestionComponent
                question={currentQuestion}
                onAnswer={handleAnswer}
                disabled={feedbackType !== null}
                feedbackType={feedbackType}
              />
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {feedbackType && currentQuestion && (
          <QuizFeedback
            type={feedbackType}
            correctAnswer={
              'correctIndex' in currentQuestion
                ? currentQuestion.options[currentQuestion.correctIndex]
                : currentQuestion.correctAnswer
            }
            userAnswer={lastAnswer}
            onDismiss={handleFeedbackDismiss}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
