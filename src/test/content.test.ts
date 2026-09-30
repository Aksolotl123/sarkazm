import { describe, expect, it } from 'vitest';
import { exercises, exercisesByModule } from '../data/exercises';
import { lessons, lessonsById } from '../data/lessons';
import { modules, EXAM_MODULE_ID } from '../data/modules';

const lessonModules = modules.filter((m) => m.kind === 'lekcja');

describe('spójność treści', () => {
  it('id modułów są unikalne i egzamin istnieje', () => {
    const ids = modules.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain(EXAM_MODULE_ID);
    expect(modules.filter((m) => m.kind === 'egzamin')).toHaveLength(1);
  });

  it('każda lekcja ma moduł i każdy moduł-lekcja ma lekcję', () => {
    for (const m of lessonModules) expect(lessonsById[m.id], `brak lekcji dla ${m.id}`).toBeDefined();
    for (const l of lessons) expect(modules.find((m) => m.id === l.id), `brak modułu dla lekcji ${l.id}`).toBeDefined();
  });

  it('lekcje mają treść: intro, sekcje z akapitami, podsumowanie', () => {
    for (const l of lessons) {
      expect(l.intro.length).toBeGreaterThan(20);
      expect(l.sections.length).toBeGreaterThanOrEqual(3);
      for (const s of l.sections) {
        expect(s.heading.length).toBeGreaterThan(0);
        expect(s.paragraphs.length).toBeGreaterThan(0);
        for (const p of s.paragraphs) expect(p.trim().length).toBeGreaterThan(0);
      }
      expect(l.takeaways.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('id ćwiczeń są unikalne', () => {
    const ids = exercises.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('każde ćwiczenie należy do istniejącej lekcji (nie do egzaminu)', () => {
    const lessonIds = new Set(lessonModules.map((m) => m.id));
    for (const e of exercises) expect(lessonIds.has(e.moduleId), `${e.id} -> ${e.moduleId}`).toBe(true);
  });

  it('każde ćwiczenie ma dokładnie jedną poprawną opcję i feedback przy każdej', () => {
    for (const e of exercises) {
      expect(e.options.length, e.id).toBeGreaterThanOrEqual(2);
      expect(e.options.filter((o) => o.correct).length, `${e.id}: liczba poprawnych`).toBe(1);
      expect(e.question.trim().length, e.id).toBeGreaterThan(0);
      for (const o of e.options) {
        expect(o.text.trim().length, `${e.id}: pusta opcja`).toBeGreaterThan(0);
        expect(o.feedback.trim().length, `${e.id}: brak feedbacku dla "${o.text}"`).toBeGreaterThan(0);
      }
      const texts = e.options.map((o) => o.text);
      expect(new Set(texts).size, `${e.id}: zduplikowane opcje`).toBe(texts.length);
    }
  });

  it('każda lekcja ma tyle ćwiczeń, ile wynosi quizSize', () => {
    for (const m of lessonModules) {
      expect(exercisesByModule(m.id).length, m.id).toBe(m.quizSize);
    }
  });

  it('egzamin ma z czego losować', () => {
    const exam = modules.find((m) => m.id === EXAM_MODULE_ID)!;
    expect(exercises.length).toBeGreaterThanOrEqual(exam.quizSize);
  });

  it('ćwiczenia „sarkazm czy na serio” nie są jednostronne (obie odpowiedzi występują w module)', () => {
    for (const m of lessonModules) {
      const recognize = exercisesByModule(m.id).filter((e) => e.kind === 'rozpoznaj');
      if (recognize.length === 0) continue;
      const sarcastic = recognize.filter((e) => e.options[0]?.correct).length;
      expect(sarcastic, `${m.id}: brak przykładów sarkazmu`).toBeGreaterThan(0);
      expect(recognize.length - sarcastic, `${m.id}: brak przykładów „na serio”`).toBeGreaterThan(0);
    }
  });

  it('progi zaliczenia mieszczą się w (0, 1]', () => {
    for (const m of modules) {
      expect(m.passThreshold).toBeGreaterThan(0);
      expect(m.passThreshold).toBeLessThanOrEqual(1);
      expect(m.quizSize).toBeGreaterThan(0);
    }
  });
});
