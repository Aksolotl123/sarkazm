import type { Module } from './types';

/** Kolejność w tablicy = kolejność odblokowywania. */
export const modules: Module[] = [
  {
    id: 'czym-jest',
    kind: 'lekcja',
    title: 'Czym jest sarkazm',
    subtitle: 'Sarkazm, ironia i cynizm to nie to samo.',
    emoji: '🎭',
    quizSize: 10,
    passThreshold: 0.7,
  },
  {
    id: 'sygnaly',
    kind: 'lekcja',
    title: 'Jak go rozpoznać',
    subtitle: 'Kontekst, przesada, ton i słowa-klucze.',
    emoji: '🔍',
    quizSize: 10,
    passThreshold: 0.7,
  },
  {
    id: 'rodzaje',
    kind: 'lekcja',
    title: 'Rodzaje sarkazmu',
    subtitle: 'Od autoironii po kamienną twarz.',
    emoji: '🃏',
    quizSize: 10,
    passThreshold: 0.7,
  },
  {
    id: 'riposta',
    kind: 'lekcja',
    title: 'Budowanie riposty',
    subtitle: 'Techniki i zasady dobrej odpowiedzi.',
    emoji: '⚔️',
    quizSize: 10,
    passThreshold: 0.7,
  },
  {
    id: 'kiedy',
    kind: 'lekcja',
    title: 'Kiedy (nie) używać',
    subtitle: 'Sarkazm to sól, nie danie główne.',
    emoji: '🚦',
    quizSize: 10,
    passThreshold: 0.7,
  },
  {
    id: 'egzamin',
    kind: 'egzamin',
    title: 'Egzamin końcowy',
    subtitle: 'Losowe pytania ze wszystkich lekcji.',
    emoji: '🎓',
    quizSize: 15,
    passThreshold: 0.8,
  },
];

export const EXAM_MODULE_ID = 'egzamin';
