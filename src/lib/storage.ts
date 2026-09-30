import { createEmptyProgress, type ModuleResult, type Progress } from './progress';

export const STORAGE_KEY = 'sarkazm.progress.v1';

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function isModuleResult(value: unknown): value is ModuleResult {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    Number.isInteger(v.bestCorrect) &&
    Number.isInteger(v.bestTotal) &&
    Number.isInteger(v.attempts) &&
    typeof v.lastAt === 'string' &&
    (v.bestCorrect as number) >= 0 &&
    (v.bestTotal as number) >= (v.bestCorrect as number) &&
    (v.attempts as number) >= 0
  );
}

/** Waliduje kształt zapisanych danych. Odrzuca całość, gdy cokolwiek jest nie tak: lepiej zacząć od zera niż działać na śmieciach. */
export function parseProgress(raw: unknown): Progress | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const obj = raw as Record<string, unknown>;
  if (obj.version !== 1) return null;
  if (typeof obj.modules !== 'object' || obj.modules === null || Array.isArray(obj.modules)) return null;
  const modules: Record<string, ModuleResult> = {};
  for (const [id, result] of Object.entries(obj.modules as Record<string, unknown>)) {
    if (!isModuleResult(result)) return null;
    modules[id] = { bestCorrect: result.bestCorrect, bestTotal: result.bestTotal, attempts: result.attempts, lastAt: result.lastAt };
  }
  return { version: 1, modules };
}

/** Nigdy nie rzuca: przy braku danych, błędzie odczytu lub uszkodzonym JSON-ie zwraca pusty postęp. */
export function loadProgress(storage: StorageLike | null): Progress {
  if (!storage) return createEmptyProgress();
  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    // localStorage może rzucić np. w trybie prywatnym Safari lub przy zablokowanych ciasteczkach.
    return createEmptyProgress();
  }
  if (raw === null) return createEmptyProgress();
  try {
    return parseProgress(JSON.parse(raw)) ?? createEmptyProgress();
  } catch {
    // Uszkodzony JSON: traktujemy jak brak danych.
    return createEmptyProgress();
  }
}

/** Zwraca false, gdy zapis się nie powiódł (brak miejsca, tryb prywatny). UI może wtedy ostrzec użytkownika. */
export function saveProgress(storage: StorageLike | null, progress: Progress): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function clearProgress(storage: StorageLike | null): void {
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Brak dostępu do storage: nie ma czego czyścić.
  }
}

/** localStorage bywa niedostępny (SSR, polityka przeglądarki); zwracamy null zamiast rzucać. */
export function getBrowserStorage(): StorageLike | null {
  try {
    return typeof window !== 'undefined' && window.localStorage ? window.localStorage : null;
  } catch {
    return null;
  }
}
