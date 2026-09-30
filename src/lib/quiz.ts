import type { Exercise, Module, Option } from '../data/types';
import { shuffle, sample, type Rng } from './random';

export interface QuizQuestion {
  exercise: Exercise;
  /** Opcje w kolejności wyświetlania (przetasowane, gdy jest ich więcej niż dwie). */
  options: Option[];
}

export interface QuizSession {
  moduleId: string;
  questions: QuizQuestion[];
}

export interface AnswerRecord {
  exerciseId: string;
  chosenIndex: number;
  correct: boolean;
}

export interface Score {
  correct: number;
  total: number;
  /** correct / total; 0 gdy total = 0. */
  ratio: number;
}

/**
 * Dwie opcje (Sarkazm / Na serio, Tak / Nie) mają stałą kolejność, żeby UI był przewidywalny.
 * Przy trzech i więcej tasujemy, bo w danych poprawna odpowiedź bywa zawsze pierwsza.
 */
export function prepareOptions(exercise: Exercise, rng: Rng): Option[] {
  return exercise.options.length <= 2 ? exercise.options.slice() : shuffle(exercise.options, rng);
}

/**
 * Buduje sesję quizu.
 * - lekcja: wszystkie ćwiczenia modułu (przetasowane), przycięte do quizSize.
 * - egzamin / trening: losowa próbka quizSize z podanej puli.
 */
export function buildQuiz(module: Pick<Module, 'id' | 'quizSize'>, pool: readonly Exercise[], rng: Rng = Math.random): QuizSession {
  const picked = sample(pool, module.quizSize, rng);
  return {
    moduleId: module.id,
    questions: picked.map((exercise) => ({ exercise, options: prepareOptions(exercise, rng) })),
  };
}

export function scoreAnswers(answers: readonly AnswerRecord[]): Score {
  const total = answers.length;
  const correct = answers.filter((a) => a.correct).length;
  return { correct, total, ratio: total === 0 ? 0 : correct / total };
}

/** Porównanie z tolerancją, żeby 7/10 przy progu 0.7 nie przepadło przez zmiennoprzecinkowe zaokrąglenia. */
export function isPassed(correct: number, total: number, threshold: number): boolean {
  if (total <= 0) return false;
  return correct / total + 1e-9 >= threshold;
}
