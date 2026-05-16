import { useState, useMemo } from 'react';
import { ChoiceQuestion } from '@/types/course';
import styles from './QuizEngine.module.css';

interface Props {
  question: ChoiceQuestion;
  onAnswer: (answer: string) => void;
  disabled: boolean;
  feedbackType: 'correct' | 'incorrect' | null;
}

export default function ChoiceQuestionComponent({ question, onAnswer, disabled, feedbackType }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const shuffledOptions = useMemo(() => {
    const indexed = question.options.map((text, i) => ({ text, isCorrect: i === question.correctIndex }));
    for (let i = indexed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
    }
    return indexed;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const handleClick = (index: number, text: string) => {
    if (disabled) return;
    setSelectedIndex(index);
    onAnswer(text);
  };

  return (
    <div className={styles.questionContainer}>
      <p className={styles.prompt}>{question.prompt}</p>
      {question.hint && <p className={styles.hint}>💡 {question.hint}</p>}
      <div className={styles.options}>
        {shuffledOptions.map((opt, i) => {
          let optionClass = styles.option;
          if (feedbackType) {
            if (opt.isCorrect) {
              optionClass += ` ${styles.optionCorrect}`;
            } else if (i === selectedIndex && !opt.isCorrect) {
              optionClass += ` ${styles.optionIncorrect}`;
            }
          }
          return (
            <button
              key={i}
              className={optionClass}
              onClick={() => handleClick(i, opt.text)}
              disabled={disabled}
            >
              <span className={styles.optionText}>{opt.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
