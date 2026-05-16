import { useState, useCallback } from 'react';
import { ListeningQuestion as ListeningQuestionType } from '@/types/course';
import styles from './QuizEngine.module.css';

interface Props {
  question: ListeningQuestionType;
  onAnswer: (answer: string) => void;
  disabled: boolean;
  feedbackType: 'correct' | 'incorrect' | null;
}

export default function ListeningQuestionComponent({ question, onAnswer, disabled, feedbackType }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const speak = useCallback(() => {
    if (isPlaying) return;
    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(question.audioText);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    synth.speak(utterance);
    setHasPlayed(true);
  }, [question.audioText, isPlaying]);

  const handleSubmit = () => {
    if (!inputValue.trim() || disabled) return;
    onAnswer(inputValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const inputClass = [
    styles.answerInput,
    feedbackType === 'correct' ? styles.inputCorrect : '',
    feedbackType === 'incorrect' ? styles.inputIncorrect : '',
  ].join(' ');

  return (
    <div className={styles.questionContainer}>
      <p className={styles.prompt}>{question.prompt}</p>
      {question.hint && <p className={styles.hint}>💡 {question.hint}</p>}

      <button
        className={styles.submitBtn}
        onClick={speak}
        disabled={disabled}
        style={{ alignSelf: 'center', minWidth: 120 }}
      >
        {isPlaying ? '🔊 播放中...' : hasPlayed ? '🔁 重新播放' : '🔊 点击播放'}
      </button>

      <div className={styles.inputRow}>
        <input
          className={inputClass}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入你听到的内容..."
          disabled={disabled}
          autoFocus
        />
        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={disabled || !inputValue.trim()}
        >
          提交
        </button>
      </div>
    </div>
  );
}
