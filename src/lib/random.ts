export type Rng = () => number;

/** Deterministyczny generator (mulberry32). Używany w testach; w aplikacji Math.random. */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates; zwraca nową tablicę, nie modyfikuje wejścia. */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = out[i] as T;
    out[i] = out[j] as T;
    out[j] = tmp;
  }
  return out;
}

/** Losowa próbka `n` elementów bez powtórzeń. Gdy n >= długości, zwraca wszystkie (przetasowane). */
export function sample<T>(items: readonly T[], n: number, rng: Rng = Math.random): T[] {
  if (n <= 0) return [];
  return shuffle(items, rng).slice(0, Math.min(n, items.length));
}
