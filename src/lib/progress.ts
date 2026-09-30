import type { Module } from '../data/types';
import { isPassed } from './quiz';

export interface ModuleResult {
  bestCorrect: number;
  bestTotal: number;
  attempts: number;
  /** ISO 8601, UTC. */
  lastAt: string;
}

export interface Progress {
  version: 1;
  modules: Record<string, ModuleResult>;
}

export type ModuleStatus = 'locked' | 'available' | 'completed';

export function createEmptyProgress(): Progress {
  return { version: 1, modules: {} };
}

/** Zapisuje wynik quizu. Zwraca nowy obiekt; lepszy wynik (wyższy ułamek) nadpisuje poprzedni. */
export function recordQuizResult(
  progress: Progress,
  moduleId: string,
  correct: number,
  total: number,
  now: Date = new Date(),
): Progress {
  if (total <= 0 || correct < 0 || correct > total) {
    throw new Error(`Nieprawidłowy wynik quizu: ${correct}/${total} dla modułu "${moduleId}"`);
  }
  const prev = progress.modules[moduleId];
  const prevRatio = prev && prev.bestTotal > 0 ? prev.bestCorrect / prev.bestTotal : -1;
  const newRatio = correct / total;
  const isBetter = newRatio > prevRatio;
  const next: ModuleResult = {
    bestCorrect: isBetter ? correct : (prev?.bestCorrect ?? 0),
    bestTotal: isBetter ? total : (prev?.bestTotal ?? 0),
    attempts: (prev?.attempts ?? 0) + 1,
    lastAt: now.toISOString(),
  };
  return { ...progress, modules: { ...progress.modules, [moduleId]: next } };
}

export function isModuleCompleted(progress: Progress, module: Module): boolean {
  const r = progress.modules[module.id];
  if (!r) return false;
  return isPassed(r.bestCorrect, r.bestTotal, module.passThreshold);
}

/**
 * Pierwsza lekcja jest zawsze dostępna. Każda kolejna lekcja wymaga zaliczenia poprzedniej.
 * Egzamin wymaga zaliczenia wszystkich lekcji.
 */
export function isModuleUnlocked(progress: Progress, modules: readonly Module[], moduleId: string): boolean {
  const index = modules.findIndex((m) => m.id === moduleId);
  if (index < 0) return false;
  const module = modules[index] as Module;
  if (module.kind === 'egzamin') {
    return modules.filter((m) => m.kind === 'lekcja').every((m) => isModuleCompleted(progress, m));
  }
  if (index === 0) return true;
  const prev = modules[index - 1] as Module;
  return isModuleCompleted(progress, prev);
}

export function moduleStatus(progress: Progress, modules: readonly Module[], module: Module): ModuleStatus {
  if (isModuleCompleted(progress, module)) return 'completed';
  return isModuleUnlocked(progress, modules, module.id) ? 'available' : 'locked';
}

/** Moduły, z których można losować ćwiczenia w treningu: odblokowane lekcje. */
export function unlockedLessonIds(progress: Progress, modules: readonly Module[]): string[] {
  return modules
    .filter((m) => m.kind === 'lekcja' && isModuleUnlocked(progress, modules, m.id))
    .map((m) => m.id);
}

export function completedCount(progress: Progress, modules: readonly Module[]): number {
  return modules.filter((m) => isModuleCompleted(progress, m)).length;
}
