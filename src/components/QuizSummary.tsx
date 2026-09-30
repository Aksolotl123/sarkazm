import type { Score } from '../lib/quiz';

interface QuizSummaryProps {
  title: string;
  score: Score;
  /** null = trening bez progu. */
  passed: boolean | null;
  passThreshold: number | null;
  isExam: boolean;
  onRetry: () => void;
  onExit: () => void;
  onNext?: (() => void) | undefined;
  nextLabel?: string | undefined;
}

function comment(ratio: number, passed: boolean | null, isExam: boolean): string {
  if (passed === true && isExam) return 'Egzamin zdany. Od dziś każde twoje „no świetnie” ma dyplom.';
  if (ratio === 1) return 'Komplet. Naprawdę. To nie jest sarkazm.';
  if (ratio >= 0.9) return 'Prawie komplet. Jedno potknięcie dodaje charakteru.';
  if (passed === true) return 'Zaliczone. Następna lekcja czeka, o ile nie masz nic lepszego do roboty.';
  if (ratio >= 0.5) return 'Blisko. Wróć do lekcji, przeczytaj jeszcze raz i spróbuj ponownie. Sarkazm cię nie oceni. Ja też nie. Może trochę.';
  if (ratio > 0) return 'No pięknie. Cudownie. Świetna robota. (To był przykład. Wróć do lekcji.)';
  return 'Zero. Statystycznie trudniej to osiągnąć niż komplet. Gratulacje?';
}

export function QuizSummary({ title, score, passed, passThreshold, isExam, onRetry, onExit, onNext, nextLabel }: QuizSummaryProps) {
  const percent = Math.round(score.ratio * 100);
  return (
    <section className="card summary">
      <p className="summary-kicker">{title}</p>
      <h1 className="summary-score">
        {score.correct} / {score.total}
      </h1>
      <p className="summary-percent">{percent}%</p>
      {passed !== null && passThreshold !== null && (
        <p className={`summary-verdict ${passed ? 'verdict-pass' : 'verdict-fail'}`}>
          {passed ? '✅ Zaliczone' : `❌ Niezaliczone (próg: ${Math.round(passThreshold * 100)}%)`}
        </p>
      )}
      <p className="summary-comment">{comment(score.ratio, passed, isExam)}</p>
      <div className="summary-actions">
        {onNext && nextLabel && (
          <button className="btn btn-primary btn-lg" onClick={onNext}>
            {nextLabel}
          </button>
        )}
        <button className={`btn btn-lg ${onNext ? 'btn-secondary' : 'btn-primary'}`} onClick={onRetry}>
          Spróbuj ponownie
        </button>
        <button className="btn btn-ghost" onClick={onExit}>
          Wróć do lekcji
        </button>
      </div>
    </section>
  );
}
