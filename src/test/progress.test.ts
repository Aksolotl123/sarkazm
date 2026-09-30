import { describe, expect, it } from 'vitest';
import { modules } from '../data/modules';
import {
  completedCount,
  createEmptyProgress,
  isModuleCompleted,
  isModuleUnlocked,
  moduleStatus,
  recordQuizResult,
  unlockedLessonIds,
  type Progress,
} from '../lib/progress';
import { loadProgress, parseProgress, saveProgress, clearProgress, STORAGE_KEY, type StorageLike } from '../lib/storage';

const NOW = new Date('2026-09-30T12:00:00Z');
const lessonIds = modules.filter((m) => m.kind === 'lekcja').map((m) => m.id);
const first = modules[0]!;
const second = modules[1]!;
const exam = modules.find((m) => m.kind === 'egzamin')!;

function passAll(progress: Progress, ids: string[]): Progress {
  return ids.reduce((p, id) => recordQuizResult(p, id, 10, 10, NOW), progress);
}

describe('recordQuizResult', () => {
  it('zapisuje pierwszy wynik i liczy próby', () => {
    const p = recordQuizResult(createEmptyProgress(), first.id, 6, 10, NOW);
    expect(p.modules[first.id]).toEqual({ bestCorrect: 6, bestTotal: 10, attempts: 1, lastAt: NOW.toISOString() });
  });

  it('nie modyfikuje wejścia', () => {
    const empty = createEmptyProgress();
    recordQuizResult(empty, first.id, 6, 10, NOW);
    expect(empty.modules).toEqual({});
  });

  it('gorszy wynik nie nadpisuje lepszego, ale zwiększa liczbę prób', () => {
    let p = recordQuizResult(createEmptyProgress(), first.id, 9, 10, NOW);
    p = recordQuizResult(p, first.id, 4, 10, NOW);
    expect(p.modules[first.id]?.bestCorrect).toBe(9);
    expect(p.modules[first.id]?.attempts).toBe(2);
  });

  it('lepszy wynik nadpisuje (porównanie ułamkiem, nie liczbą bezwzględną)', () => {
    let p = recordQuizResult(createEmptyProgress(), exam.id, 10, 15, NOW);
    p = recordQuizResult(p, exam.id, 9, 10, NOW);
    expect(p.modules[exam.id]).toMatchObject({ bestCorrect: 9, bestTotal: 10, attempts: 2 });
  });

  it('odrzuca nieprawidłowe wyniki', () => {
    expect(() => recordQuizResult(createEmptyProgress(), first.id, 1, 0, NOW)).toThrow();
    expect(() => recordQuizResult(createEmptyProgress(), first.id, 11, 10, NOW)).toThrow();
    expect(() => recordQuizResult(createEmptyProgress(), first.id, -1, 10, NOW)).toThrow();
  });
});

describe('odblokowywanie', () => {
  it('na starcie dostępna jest tylko pierwsza lekcja', () => {
    const p = createEmptyProgress();
    expect(moduleStatus(p, modules, first)).toBe('available');
    for (const m of modules.slice(1)) expect(moduleStatus(p, modules, m), m.id).toBe('locked');
    expect(unlockedLessonIds(p, modules)).toEqual([first.id]);
    expect(completedCount(p, modules)).toBe(0);
  });

  it('zaliczenie pierwszej lekcji na progu odblokowuje drugą', () => {
    const threshold = Math.ceil(first.passThreshold * 10);
    const p = recordQuizResult(createEmptyProgress(), first.id, threshold, 10, NOW);
    expect(isModuleCompleted(p, first)).toBe(true);
    expect(moduleStatus(p, modules, first)).toBe('completed');
    expect(moduleStatus(p, modules, second)).toBe('available');
    expect(unlockedLessonIds(p, modules)).toEqual([first.id, second.id]);
  });

  it('wynik tuż pod progiem nie odblokowuje', () => {
    const below = Math.ceil(first.passThreshold * 10) - 1;
    const p = recordQuizResult(createEmptyProgress(), first.id, below, 10, NOW);
    expect(isModuleCompleted(p, first)).toBe(false);
    expect(moduleStatus(p, modules, second)).toBe('locked');
  });

  it('egzamin wymaga wszystkich lekcji, nie tylko poprzedniej', () => {
    const allButLast = passAll(createEmptyProgress(), lessonIds.slice(0, -1));
    expect(isModuleUnlocked(allButLast, modules, exam.id)).toBe(false);
    const all = passAll(createEmptyProgress(), lessonIds);
    expect(isModuleUnlocked(all, modules, exam.id)).toBe(true);
    expect(moduleStatus(all, modules, exam)).toBe('available');
    expect(completedCount(all, modules)).toBe(lessonIds.length);
  });

  it('zaliczony egzamin liczy się do ukończonych', () => {
    const p = recordQuizResult(passAll(createEmptyProgress(), lessonIds), exam.id, 15, 15, NOW);
    expect(completedCount(p, modules)).toBe(modules.length);
  });

  it('nieznany moduł jest zablokowany', () => {
    expect(isModuleUnlocked(createEmptyProgress(), modules, 'nie-ma-takiego')).toBe(false);
  });
});

function memoryStorage(initial: Record<string, string> = {}): StorageLike & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? (data[k] as string) : null),
    setItem: (k, v) => {
      data[k] = v;
    },
    removeItem: (k) => {
      delete data[k];
    },
  };
}

describe('storage', () => {
  it('zapis i odczyt zachowują dane', () => {
    const s = memoryStorage();
    const p = recordQuizResult(createEmptyProgress(), first.id, 8, 10, NOW);
    expect(saveProgress(s, p)).toBe(true);
    expect(loadProgress(s)).toEqual(p);
  });

  it('brak danych, uszkodzony JSON i zła struktura dają pusty postęp', () => {
    expect(loadProgress(memoryStorage())).toEqual(createEmptyProgress());
    expect(loadProgress(memoryStorage({ [STORAGE_KEY]: '{nie json' }))).toEqual(createEmptyProgress());
    expect(loadProgress(memoryStorage({ [STORAGE_KEY]: '"string"' }))).toEqual(createEmptyProgress());
    expect(loadProgress(memoryStorage({ [STORAGE_KEY]: JSON.stringify({ version: 2, modules: {} }) }))).toEqual(createEmptyProgress());
    expect(loadProgress(memoryStorage({ [STORAGE_KEY]: JSON.stringify({ version: 1, modules: [] }) }))).toEqual(createEmptyProgress());
    expect(
      loadProgress(memoryStorage({ [STORAGE_KEY]: JSON.stringify({ version: 1, modules: { x: { bestCorrect: 11, bestTotal: 10, attempts: 1, lastAt: 'x' } } }) })),
    ).toEqual(createEmptyProgress());
    expect(loadProgress(null)).toEqual(createEmptyProgress());
  });

  it('parseProgress odcina nadmiarowe pola', () => {
    const parsed = parseProgress({ version: 1, modules: { a: { bestCorrect: 1, bestTotal: 2, attempts: 1, lastAt: 't', extra: 1 } }, junk: true });
    expect(parsed).toEqual({ version: 1, modules: { a: { bestCorrect: 1, bestTotal: 2, attempts: 1, lastAt: 't' } } });
  });

  it('błąd storage przy odczycie lub zapisie nie wywraca aplikacji', () => {
    const broken: StorageLike = {
      getItem: () => {
        throw new Error('QuotaExceededError');
      },
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => {
        throw new Error('SecurityError');
      },
    };
    expect(loadProgress(broken)).toEqual(createEmptyProgress());
    expect(saveProgress(broken, createEmptyProgress())).toBe(false);
    expect(() => clearProgress(broken)).not.toThrow();
    expect(saveProgress(null, createEmptyProgress())).toBe(false);
  });

  it('clearProgress usuwa klucz', () => {
    const s = memoryStorage({ [STORAGE_KEY]: '{}' });
    clearProgress(s);
    expect(s.data[STORAGE_KEY]).toBeUndefined();
  });
});
