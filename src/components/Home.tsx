import type { Module } from '../data/types';
import { completedCount, moduleStatus, type Progress, unlockedLessonIds } from '../lib/progress';
import type { Route } from '../lib/route';

interface HomeProps {
  modules: Module[];
  progress: Progress;
  navigate: (r: Route) => void;
  onReset: () => void;
}

export function Home({ modules, progress, navigate, onReset }: HomeProps) {
  const done = completedCount(progress, modules);
  const total = modules.length;
  const hasAnyProgress = Object.keys(progress.modules).length > 0;
  const examDone = modules.some((m) => m.kind === 'egzamin' && moduleStatus(progress, modules, m) === 'completed');
  const trainingPool = unlockedLessonIds(progress, modules).length;

  return (
    <>
      <section className="hero">
        <h1>Naucz się sarkazmu.</h1>
        <p className="lead">
          Pięć krótkich lekcji, po każdej ćwiczenia, na końcu egzamin. Bez zaliczenia poprzedniej lekcji następna się nie otworzy, bo
          sarkazm bez podstaw to po prostu bycie nieprzyjemnym.
        </p>
        <div className="progress-line" aria-label={`Ukończono ${done} z ${total} modułów`}>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${(done / total) * 100}%` }} />
          </div>
          <span className="progress-label">
            {done}/{total}
          </span>
        </div>
        {examDone && (
          <p className="diploma">
            🎓 Egzamin zaliczony. Możesz już oficjalnie mówić „no świetnie” i wiedzieć, co robisz.
          </p>
        )}
      </section>

      <section className="module-list" aria-label="Lekcje">
        {modules.map((m, i) => {
          const status = moduleStatus(progress, modules, m);
          const result = progress.modules[m.id];
          const locked = status === 'locked';
          const target: Route = m.kind === 'egzamin' ? { name: 'quiz', id: m.id } : { name: 'lekcja', id: m.id };
          return (
            <article key={m.id} className={`module-card status-${status}`} aria-disabled={locked}>
              <div className="module-emoji" aria-hidden="true">
                {m.emoji}
              </div>
              <div className="module-body">
                <h2>
                  <span className="module-index">{i + 1}.</span> {m.title}
                </h2>
                <p>{m.subtitle}</p>
                <p className="module-meta">
                  {status === 'locked' && '🔒 Zablokowane'}
                  {status === 'available' && (result ? `Najlepszy wynik: ${result.bestCorrect}/${result.bestTotal}, próg ${Math.round(m.passThreshold * 100)}%` : `${m.quizSize} pytań, próg ${Math.round(m.passThreshold * 100)}%`)}
                  {status === 'completed' && result && `✅ Zaliczone: ${result.bestCorrect}/${result.bestTotal}`}
                </p>
              </div>
              <div className="module-actions">
                {!locked && (
                  <button className={`btn ${status === 'completed' ? 'btn-secondary' : 'btn-primary'}`} onClick={() => navigate(target)}>
                    {m.kind === 'egzamin' ? (status === 'completed' ? 'Powtórz' : 'Zdaj') : status === 'completed' ? 'Powtórz' : result ? 'Spróbuj znów' : 'Zacznij'}
                  </button>
                )}
                {!locked && m.kind === 'lekcja' && result && (
                  <button className="btn btn-ghost" onClick={() => navigate({ name: 'quiz', id: m.id })}>
                    Same ćwiczenia
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <section className="card training-card">
        <h2>🏋️ Trening</h2>
        <p>
          Dziesięć losowych pytań z odblokowanych lekcji ({trainingPool} {trainingPool === 1 ? 'lekcja' : trainingPool < 5 ? 'lekcje' : 'lekcji'}).
          Nie wpływa na postęp, wpływa na formę.
        </p>
        <button className="btn btn-secondary" onClick={() => navigate({ name: 'trening' })}>
          Rozpocznij trening
        </button>
      </section>

      {hasAnyProgress && (
        <section className="reset-row">
          <button
            className="btn btn-ghost btn-danger"
            onClick={() => {
              if (window.confirm('Na pewno wyzerować cały postęp? Tego nie da się cofnąć.')) onReset();
            }}
          >
            Wyzeruj postęp
          </button>
        </section>
      )}
    </>
  );
}
