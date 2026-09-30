import { describe, expect, it } from 'vitest';
import { exercises, exercisesByModule } from '../data/exercises';
import { modules } from '../data/modules';
import { seededRng, shuffle, sample } from '../lib/random';
import { buildQuiz, isPassed, prepareOptions, scoreAnswers } from '../lib/quiz';

describe('random', () => {
  it('seededRng jest deterministyczny i daje wartości z [0, 1)', () => {
    const a = seededRng(42);
    const b = seededRng(42);
    for (let i = 0; i < 100; i++) {
      const x = a();
      expect(x).toBe(b());
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });

  it('shuffle zachowuje elementy i nie modyfikuje wejścia', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const copy = input.slice();
    const out = shuffle(input, seededRng(1));
    expect(input).toEqual(copy);
    expect(out.slice().sort((x, y) => x - y)).toEqual(input);
  });

  it('shuffle faktycznie tasuje (dla 8 elementów i ustalonego ziarna kolejność się zmienia)', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(shuffle(input, seededRng(7))).not.toEqual(input);
  });

  it('shuffle i sample radzą sobie z pustą tablicą i jednym elementem', () => {
    expect(shuffle([], seededRng(1))).toEqual([]);
    expect(shuffle(['x'], seededRng(1))).toEqual(['x']);
    expect(sample([], 5, seededRng(1))).toEqual([]);
    expect(sample(['x'], 5, seededRng(1))).toEqual(['x']);
    expect(sample([1, 2, 3], 0, seededRng(1))).toEqual([]);
    expect(sample([1, 2, 3], -1, seededRng(1))).toEqual([]);
  });

  it('sample zwraca n unikalnych elementów', () => {
    const out = sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4, seededRng(3));
    expect(out).toHaveLength(4);
    expect(new Set(out).size).toBe(4);
  });
});

describe('buildQuiz', () => {
  const lesson = modules.find((m) => m.id === 'rodzaje')!;
  const exam = modules.find((m) => m.kind === 'egzamin')!;

  it('dla lekcji używa każdego ćwiczenia modułu dokładnie raz', () => {
    const pool = exercisesByModule(lesson.id);
    const session = buildQuiz(lesson, pool, seededRng(5));
    const ids = session.questions.map((q) => q.exercise.id).sort();
    expect(ids).toEqual(pool.map((e) => e.id).sort());
    expect(session.moduleId).toBe(lesson.id);
  });

  it('dla egzaminu losuje quizSize unikalnych pytań z całej puli', () => {
    const session = buildQuiz(exam, exercises, seededRng(9));
    expect(session.questions).toHaveLength(exam.quizSize);
    const ids = session.questions.map((q) => q.exercise.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ta sama pula i ziarno dają tę samą sesję', () => {
    const a = buildQuiz(exam, exercises, seededRng(11)).questions.map((q) => q.exercise.id);
    const b = buildQuiz(exam, exercises, seededRng(11)).questions.map((q) => q.exercise.id);
    expect(a).toEqual(b);
  });

  it('pusta pula daje pustą sesję zamiast błędu', () => {
    expect(buildQuiz(lesson, [], seededRng(1)).questions).toEqual([]);
  });
});

describe('prepareOptions', () => {
  it('dwie opcje zostają w oryginalnej kolejności', () => {
    const two = exercises.find((e) => e.options.length === 2)!;
    for (let seed = 0; seed < 20; seed++) {
      expect(prepareOptions(two, seededRng(seed)).map((o) => o.text)).toEqual(two.options.map((o) => o.text));
    }
  });

  it('trzy i więcej opcji są tasowane, ale zawsze z jedną poprawną', () => {
    const many = exercises.filter((e) => e.options.length >= 3);
    let movedAtLeastOnce = false;
    for (const e of many) {
      const prepared = prepareOptions(e, seededRng(e.id.length * 31));
      expect(prepared.filter((o) => o.correct)).toHaveLength(1);
      expect(prepared.map((o) => o.text).sort()).toEqual(e.options.map((o) => o.text).sort());
      if (prepared[0]?.text !== e.options[0]?.text) movedAtLeastOnce = true;
    }
    expect(movedAtLeastOnce).toBe(true);
  });
});

describe('scoreAnswers / isPassed', () => {
  it('liczy poprawne odpowiedzi', () => {
    const score = scoreAnswers([
      { exerciseId: 'a', chosenIndex: 0, correct: true },
      { exerciseId: 'b', chosenIndex: 1, correct: false },
      { exerciseId: 'c', chosenIndex: 0, correct: true },
    ]);
    expect(score).toEqual({ correct: 2, total: 3, ratio: 2 / 3 });
  });

  it('pusta lista daje 0/0 i ratio 0', () => {
    expect(scoreAnswers([])).toEqual({ correct: 0, total: 0, ratio: 0 });
    expect(isPassed(0, 0, 0.7)).toBe(false);
  });

  it('próg jest włączny i odporny na zaokrąglenia', () => {
    expect(isPassed(7, 10, 0.7)).toBe(true);
    expect(isPassed(6, 10, 0.7)).toBe(false);
    expect(isPassed(12, 15, 0.8)).toBe(true);
    expect(isPassed(11, 15, 0.8)).toBe(false);
    expect(isPassed(3, 3, 1)).toBe(true);
  });
});
