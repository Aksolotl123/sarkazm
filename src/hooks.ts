import { useCallback, useEffect, useState } from 'react';
import { parseRoute, routeToHash, type Route } from './lib/route';
import { createEmptyProgress, type Progress } from './lib/progress';
import { clearProgress, getBrowserStorage, loadProgress, saveProgress } from './lib/storage';

export function useHashRoute(): [Route, (r: Route) => void] {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  const navigate = useCallback((r: Route) => {
    const hash = routeToHash(r);
    if (window.location.hash === hash) {
      // Ten sam hash nie wywoła hashchange; ustawiamy stan ręcznie (np. „spróbuj ponownie”).
      setRoute(parseRoute(hash));
    } else {
      window.location.hash = hash;
    }
    window.scrollTo({ top: 0 });
  }, []);
  return [route, navigate];
}

export interface ProgressStore {
  progress: Progress;
  update: (next: Progress) => void;
  reset: () => void;
  /** true, gdy ostatni zapis się nie powiódł (np. tryb prywatny). */
  saveFailed: boolean;
}

export function useProgress(): ProgressStore {
  const [storage] = useState(getBrowserStorage);
  const [progress, setProgress] = useState<Progress>(() => loadProgress(storage));
  const [saveFailed, setSaveFailed] = useState(false);

  const update = useCallback(
    (next: Progress) => {
      setProgress(next);
      setSaveFailed(!saveProgress(storage, next));
    },
    [storage],
  );

  const reset = useCallback(() => {
    clearProgress(storage);
    setProgress(createEmptyProgress());
    setSaveFailed(false);
  }, [storage]);

  return { progress, update, reset, saveFailed };
}
