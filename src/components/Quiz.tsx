import { useState } from 'react';
import type { ExerciseKind } from '../data/types';
import { isPassed, scoreAnswers, type AnswerRecord, type QuizSession } from '../lib/quiz';
import { QuizSummary } from './QuizSummary';

interface QuizProps {
  title: string;
  session: QuizSession;
  /** null = tryb bez zaliczenia (trening). */
  passThreshold: number | null;
  isExam: boolean;
  onFinish: (score: ReturnType<typeof scoreAnswers>) => void;
  onRetry: () => void;
  onExit: () => void;
  onNext?: (() => void) | undefined;
  nextLabel?: string | undefined;
}

const KIND_LABEL: Record<ExerciseKind, string> = {
  rozpoznaj: 'Rozpoznawanie',
  pojecie: 'Pojęcia',
  sygnal: 'Sygnały',
  rodzaj: 'Rodzaje',
  riposta: 'Riposta',
  technika: 'Technika',
  stosownosc: 'Stosowność',
};

export function Quiz({ title, session, passThreshold, isExam, onFinish, onRetry, onExit, onNext, nextLabel }: QuizProps) {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [finished, setFinished] = useState(false);

  const total = session.questions.length;

  if (total === 0) {
    return (
      <section className="card">
        <h1>{title}</h1>
        <p>Brak pytań do wyświetlenia. To nie sarkazm, to naprawdę pusta lista.</p>
        <button className="btn btn-primary" onClick={onExit}>
          Wróć
        </button>
      </section>
    );
  }

  if (finished) {
    const score = scoreAnswers(answers);
    const passed = passThreshold === null ? null : isPassed(score.correct, score.total, passThreshold);
    return (
      <QuizSummary
        title={title}
        score={score}
        passed={passed}
        passThreshold={passThreshold}
        isExam={isExam}
        onRetry={onRetry}
        onExit={onExit}
        onNext={passed ? onNext : undefined}
        nextLabel={nextLabel}
      />
    );
  }

  const question = session.questions[index];
  if (!question) return null;
  const { exercise, options } = question;
  const answered = chosen !== null;
  const isLast = index === total - 1;

  const choose = (i: number) => {
    if (answered) return; // Podwójne kliknięcie nie może zaliczyć dwóch odpowiedzi.
    const option = options[i];
    if (!option) return;
    setChosen(i);
    setAnswers((prev) => [...prev, { exerciseId: exercise.id, chosenIndex: i, correct: option.correct }]);
  };

  const next = () => {
    if (!answered) return;
    if (isLast) {
      // onFinish dostaje pełną listę odpowiedzi (stan `answers` jest już zaktualizowany, bo `answered` wymaga wyboru).
      onFinish(scoreAnswers(answers));
      setFinished(true);
      return;
    }
    setIndex(index + 1);
    setChosen(null);
  };

  const chosenOption = chosen !== null ? options[chosen] : undefined;

  return (
    <section className="quiz">
      <div className="quiz-top">
        <button className="btn btn-ghost back" onClick={onExit}>
          ← Wyjdź
        </button>
        <span className="quiz-counter" aria-live="polite">
          {index + 1} / {total}
        </span>
      </div>
      <div className="progress-track slim" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%` }} />
      </div>

      <h1 className="quiz-title">{title}</h1>

      <article className="card question">
        <span className="kind-badge">{KIND_LABEL[exercise.kind]}</span>
        {exercise.context && <p className="context">{exercise.context}</p>}
        {exercise.quote && <blockquote className="quote">„{exercise.quote}”</blockquote>}
        <h2 className="question-text">{exercise.question}</h2>

        <div className="options" role="group" aria-label="Odpowiedzi">
          {options.map((o, i) => {
            let cls = 'option';
            if (answered) {
              if (o.correct) cls += ' option-correct';
              else if (i === chosen) cls += ' option-wrong';
              else cls += ' option-muted';
            }
            return (
              <button key={o.text} className={cls} onClick={() => choose(i)} disabled={answered} aria-pressed={i === chosen}>
                <span className="option-letter" aria-hidden="true">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{o.text}</span>
              </button>
            );
          })}
        </div>

        {chosenOption && (
          <div className={`feedback ${chosenOption.correct ? 'feedback-ok' : 'feedback-bad'}`} role="status">
            <span aria-hidden="true">{chosenOption.correct ? '✅' : '❌'}</span> {chosenOption.feedback}
          </div>
        )}
      </article>

      <div className="quiz-actions">
        <button className="btn btn-primary btn-lg" onClick={next} disabled={!answered}>
          {isLast ? 'Zobacz wynik' : 'Dalej'}
        </button>
      </div>
    </section>
  );
}
