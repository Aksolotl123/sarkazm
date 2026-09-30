import type { Lesson, Module } from '../data/types';

interface LessonViewProps {
  lesson: Lesson;
  module: Module;
  onStartQuiz: () => void;
  onBack: () => void;
}

export function LessonView({ lesson, module, onStartQuiz, onBack }: LessonViewProps) {
  return (
    <article className="lesson">
      <button className="btn btn-ghost back" onClick={onBack}>
        ← Lekcje
      </button>
      <header className="lesson-header">
        <div className="module-emoji big" aria-hidden="true">
          {module.emoji}
        </div>
        <h1>{lesson.title}</h1>
        <p className="lead">{lesson.intro}</p>
      </header>

      {lesson.sections.map((s) => (
        <section key={s.heading} className="lesson-section">
          <h2>{s.heading}</h2>
          {s.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {s.examples && (
            <ul className="examples">
              {s.examples.map((ex) => (
                <li key={ex.text}>
                  <span className="example-text">{ex.text}</span>
                  <span className="example-note">{ex.note}</span>
                </li>
              ))}
            </ul>
          )}
          {s.tip && <p className="tip">💡 {s.tip}</p>}
        </section>
      ))}

      <section className="card takeaways">
        <h2>W skrócie</h2>
        <ul>
          {lesson.takeaways.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <div className="lesson-cta">
        <button className="btn btn-primary btn-lg" onClick={onStartQuiz}>
          Przejdź do ćwiczeń ({module.quizSize} pytań)
        </button>
      </div>
    </article>
  );
}
