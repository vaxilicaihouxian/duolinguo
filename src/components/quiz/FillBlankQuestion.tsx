import { useState, useRef, useEffect } from 'react';
import { FillBlankQuestion } from '@/types/course';
import styles from './QuizEngine.module.css';

interface Props {
  question: FillBlankQuestion;
  onAnswer: (answer: string) => void;
  disabled: boolean;
  feedbackType: 'correct' | 'incorrect' | null;
}

export default function FillBlankQuestionComponent({ question, onAnswer, disabled, feedbackType }: Props) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
    setInput('');
  }, [question.id, disabled]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onAnswer(trimmed);
  };

  let inputClass = styles.answerInput;
  if (feedbackType === 'correct') inputClass += ` ${styles.inputCorrect}`;
  else if (feedbackType === 'incorrect') inputClass += ` ${styles.inputIncorrect}`;

  return (
    <div className={styles.questionContainer}>
      <p className={styles.prompt}>{question.prompt}</p>
      {question.context && (
        <p className={styles.context}>{question.context}</p>
      )}
      {question.hint && <p className={styles.hint}>💡 {question.hint}</p>}
      <div className={styles.inputRow}>
        <input
          ref={inputRef}
          className={inputClass}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          placeholder="输入你的答案..."
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
        >
          确认
        </button>
      </div>
    </div>
  );
}
