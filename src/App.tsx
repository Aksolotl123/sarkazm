import { useMemo, useState } from 'react';
import { exercises, exercisesByModule } from './data/exercises';
import { lessonsById } from './data/lessons';
import { modules } from './data/modules';
import type { Module } from './data/types';
import { useHashRoute, useProgress } from './hooks';
import { isModuleUnlocked, recordQuizResult, unlockedLessonIds } from './lib/progress';
import { buildQuiz } from './lib/quiz';
import type { Route } from './lib/route';
import { Home } from './components/Home';
import { LessonView } from './components/LessonView';
import { Quiz } from './components/Quiz';
import { Notice } from './components/Notice';

const TRAINING_SIZE = 10;

export function App() {
  const [route, navigate] = useHashRoute();
  const store = useProgress();
  const { progress } = store;

  const goHome = () => navigate({ name: 'home' });

  return (
    <div className="app">
      <header className="app-header">
        <a
          className="brand"
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            goHome();
          }}
        >
          <span aria-hidden="true">🙃</span> Akademia Sarkazmu
        </a>
      </header>
      {store.saveFailed && (
        <Notice tone="warning">
          Nie udało się zapisać postępu w tej przeglądarce. Możesz ćwiczyć dalej, ale po odświeżeniu strony wynik zniknie.
        </Notice>
      )}
      <main className="app-main">
        <Screen route={route} navigate={navigate} store={store} progress={progress} />
      </main>
      <footer className="app-footer">Postęp zapisuje się tylko w tej przeglądarce. Sarkazm zapisuje się w ludziach.</footer>
    </div>
  );
}

interface ScreenProps {
  route: Route;
  navigate: (r: Route) => void;
  store: ReturnType<typeof useProgress>;
  progress: ReturnType<typeof useProgress>['progress'];
}

function Screen({ route, navigate, store, progress }: ScreenProps) {
  switch (route.name) {
    case 'home':
      return <Home modules={modules} progress={progress} navigate={navigate} onReset={store.reset} />;

    case 'lekcja': {
      const module = findModule(route.id);
      const lesson = lessonsById[route.id];
      if (!module || !lesson) return <NotFound navigate={navigate} />;
      if (!isModuleUnlocked(progress, modules, module.id)) return <Locked module={module} navigate={navigate} />;
      return <LessonView lesson={lesson} module={module} onStartQuiz={() => navigate({ name: 'quiz', id: module.id })} onBack={() => navigate({ name: 'home' })} />;
    }

    case 'quiz': {
      const module = findModule(route.id);
      if (!module) return <NotFound navigate={navigate} />;
      if (!isModuleUnlocked(progress, modules, module.id)) return <Locked module={module} navigate={navigate} />;
      return <ModuleQuiz key={module.id} module={module} navigate={navigate} store={store} />;
    }

    case 'trening':
      return <TrainingQuiz navigate={navigate} progress={progress} />;
  }
}

function findModule(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

interface ModuleQuizProps {
  module: Module;
  navigate: (r: Route) => void;
  store: ReturnType<typeof useProgress>;
}

function ModuleQuiz({ module, navigate, store }: ModuleQuizProps) {
  // Licznik prób: „spróbuj ponownie” losuje nową sesję i resetuje stan quizu przez zmianę `key`.
  const [attempt, setAttempt] = useState(0);
  const session = useMemo(() => {
    const pool = module.kind === 'egzamin' ? exercises : exercisesByModule(module.id);
    return buildQuiz(module, pool);
  }, [module, attempt]);

  const index = modules.findIndex((m) => m.id === module.id);
  const nextModule = modules[index + 1];
  const nextUnlockedAfterPass = nextModule && nextModule.kind === 'lekcja' ? nextModule : undefined;

  return (
    <Quiz
      key={attempt}
      title={module.kind === 'egzamin' ? module.title : `Ćwiczenia: ${module.title}`}
      session={session}
      passThreshold={module.passThreshold}
      isExam={module.kind === 'egzamin'}
      onFinish={(score) => store.update(recordQuizResult(store.progress, module.id, score.correct, score.total))}
      onRetry={() => {
        setAttempt((a) => a + 1);
        window.scrollTo({ top: 0 });
      }}
      onExit={() => navigate({ name: 'home' })}
      onNext={nextUnlockedAfterPass ? () => navigate({ name: 'lekcja', id: nextUnlockedAfterPass.id }) : undefined}
      nextLabel={nextUnlockedAfterPass ? `Następna lekcja: ${nextUnlockedAfterPass.title}` : undefined}
    />
  );
}

interface TrainingQuizProps {
  navigate: (r: Route) => void;
  progress: ReturnType<typeof useProgress>['progress'];
}

function TrainingQuiz({ navigate, progress }: TrainingQuizProps) {
  const [attempt, setAttempt] = useState(0);
  const session = useMemo(() => {
    const ids = new Set(unlockedLessonIds(progress, modules));
    const pool = exercises.filter((e) => ids.has(e.moduleId));
    return buildQuiz({ id: 'trening', quizSize: TRAINING_SIZE }, pool);
  }, [progress, attempt]);

  return (
    <Quiz
      key={attempt}
      title="Trening"
      session={session}
      passThreshold={null}
      isExam={false}
      onFinish={() => undefined}
      onRetry={() => {
        setAttempt((a) => a + 1);
        window.scrollTo({ top: 0 });
      }}
      onExit={() => navigate({ name: 'home' })}
    />
  );
}

function NotFound({ navigate }: { navigate: (r: Route) => void }) {
  return (
    <section className="card">
      <h1>Nie ma takiej strony</h1>
      <p>Co za niespodzianka. Wróć na stronę główną, tam wszystko istnieje.</p>
      <button className="btn btn-primary" onClick={() => navigate({ name: 'home' })}>
        Strona główna
      </button>
    </section>
  );
}

function Locked({ module, navigate }: { module: Module; navigate: (r: Route) => void }) {
  return (
    <section className="card">
      <h1>
        {module.emoji} {module.title}
      </h1>
      <p>Ten moduł jest jeszcze zablokowany. Zalicz wcześniejsze lekcje, a otworzy się sam. Magia.</p>
      <button className="btn btn-primary" onClick={() => navigate({ name: 'home' })}>
        Wróć do listy lekcji
      </button>
    </section>
  );
}
