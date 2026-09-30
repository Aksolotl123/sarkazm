/** Rodzaj ćwiczenia — używany do etykiet w UI i statystyk, nie zmienia mechaniki (zawsze wybór jednej opcji). */
export type ExerciseKind =
  | 'rozpoznaj' // sarkazm czy na serio?
  | 'pojecie' // sarkazm / ironia / cynizm
  | 'sygnal' // który sygnał zdradza sarkazm?
  | 'rodzaj' // jaki to rodzaj sarkazmu?
  | 'riposta' // wybierz najlepszą ripostę
  | 'technika' // jaka technika została użyta?
  | 'stosownosc'; // czy sarkazm jest tu na miejscu?

export interface Option {
  text: string;
  correct: boolean;
  /** Wyjaśnienie pokazywane po wybraniu tej opcji. */
  feedback: string;
}

export interface Exercise {
  id: string;
  moduleId: string;
  kind: ExerciseKind;
  /** Opis sytuacji, w której pada wypowiedź. */
  context?: string;
  /** Wypowiedź, którą oceniamy. */
  quote?: string;
  question: string;
  options: Option[];
}

export interface LessonExample {
  text: string;
  note: string;
}

export interface LessonSection {
  heading: string;
  paragraphs: string[];
  examples?: LessonExample[];
  tip?: string;
}

export interface Lesson {
  /** Równe id modułu. */
  id: string;
  title: string;
  intro: string;
  sections: LessonSection[];
  takeaways: string[];
}

export type ModuleKind = 'lekcja' | 'egzamin';

export interface Module {
  id: string;
  kind: ModuleKind;
  title: string;
  subtitle: string;
  emoji: string;
  /** Liczba pytań w quizie. Dla lekcji: wszystkie ćwiczenia modułu. Dla egzaminu: losowa próbka ze wszystkich. */
  quizSize: number;
  /** Ułamek poprawnych odpowiedzi potrzebny do zaliczenia (0–1). */
  passThreshold: number;
}
