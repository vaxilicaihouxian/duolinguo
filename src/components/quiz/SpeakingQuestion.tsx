import { useState, useRef, useCallback, useEffect } from 'react';
import { SpeakingQuestion as SpeakingQuestionType } from '@/types/course';
import styles from './QuizEngine.module.css';

interface Props {
  question: SpeakingQuestionType;
  onAnswer: (answer: string) => void;
  disabled: boolean;
  feedbackType: 'correct' | 'incorrect' | null;
}

/* Minimal type declarations — Web Speech API types are absent from default TS DOM lib */
interface SpeechRecognitionResultItem {
  readonly transcript: string;
}
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionResultItem;
}
interface SpeechRecognitionEvent {
  readonly results: SpeechRecognitionResult[];
}
interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
interface SpeechRecognitionCtor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

export default function SpeakingQuestionComponent({ question, onAnswer, disabled, feedbackType }: Props) {
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [notSupported, setNotSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      setNotSupported(true);
      return;
    }

    const recognition = new Ctor();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript: string[] = [];
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].length > 0) {
          transcript.push(event.results[i][0].transcript);
        }
      }
      setRecognizedText(transcript.join(' '));
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  const startListening = useCallback(() => {
    if (isListening || !recognitionRef.current) return;
    setRecognizedText('');
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch {
      // May already be started
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setIsListening(false);
    recognitionRef.current.stop();
  }, []);

  const handleSubmit = () => {
    if (!recognizedText.trim() || disabled) return;
    onAnswer(recognizedText.trim());
  };

  const inputClass = [
    styles.answerInput,
    feedbackType === 'correct' ? styles.inputCorrect : '',
    feedbackType === 'incorrect' ? styles.inputIncorrect : '',
  ].join(' ');

  if (notSupported) {
    return (
      <div className={styles.questionContainer}>
        <p className={styles.prompt}>{question.prompt}</p>
        <p className={styles.hint}>⚠️ 你的浏览器不支持语音识别，请在 Chrome 中打开</p>
        <p style={{ textAlign: 'center', color: 'var(--duo-text-secondary)', fontSize: 'var(--duo-font-lg)', fontWeight: 600 }}>
          &ldquo;{question.targetText}&rdquo;
        </p>
        <div className={styles.inputRow}>
          <input
            className={inputClass}
            type="text"
            value={recognizedText}
            onChange={(e) => setRecognizedText(e.target.value)}
            placeholder="请尝试朗读上面的句子..."
            disabled={disabled}
          />
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={disabled || !recognizedText.trim()}
          >
            提交
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.questionContainer}>
      <p className={styles.prompt}>{question.prompt}</p>
      {question.hint && <p className={styles.hint}>💡 {question.hint}</p>}

      <p style={{ textAlign: 'center', color: 'var(--duo-text-secondary)', fontSize: 'var(--duo-font-lg)', fontWeight: 600 }}>
        &ldquo;{question.targetText}&rdquo;
      </p>

      <button
        className={styles.submitBtn}
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        style={{
          alignSelf: 'center',
          minWidth: 140,
          background: isListening ? 'var(--duo-danger)' : 'var(--duo-primary)',
          boxShadow: isListening ? '0 3px 0 #c42020' : undefined,
        }}
      >
        {isListening ? '🔴 正在录音...' : '🎤 点击录音'}
      </button>

      {recognizedText && (
        <div className={styles.inputRow}>
          <input
            className={inputClass}
            type="text"
            value={recognizedText}
            onChange={(e) => setRecognizedText(e.target.value)}
            placeholder="识别结果..."
            disabled={disabled}
          />
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={disabled || !recognizedText.trim()}
          >
            提交
          </button>
        </div>
      )}
    </div>
  );
}
