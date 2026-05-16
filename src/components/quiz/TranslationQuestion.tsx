import { useState, useRef, useEffect } from 'react';
import { TranslationQuestion } from '@/types/course';
import styles from './QuizEngine.module.css';

interface Props {
  question: TranslationQuestion;
  onAnswer: (answer: string) => void;
  disabled: boolean;
  feedbackType: 'correct' | 'incorrect' | null;
}

export default function TranslationQuestionComponent({ question, onAnswer, disabled, feedbackType }: Props) {
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

  const directionLabel = question.direction === 'zh-to-en' ? '中 → 英' : '英 → 中';

  return (
    <div className={styles.questionContainer}>
      <div className={styles.directionBadge}>{directionLabel}</div>
      <p className={styles.prompt}>{question.prompt}</p>
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
          placeholder={question.direction === 'zh-to-en' ? '输入英文翻译...' : '输入中文翻译...'}
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
