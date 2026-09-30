import { describe, expect, it } from 'vitest';
import { parseRoute, routeToHash } from '../lib/route';

describe('route', () => {
  it('parsuje znane ścieżki', () => {
    expect(parseRoute('')).toEqual({ name: 'home' });
    expect(parseRoute('#')).toEqual({ name: 'home' });
    expect(parseRoute('#/')).toEqual({ name: 'home' });
    expect(parseRoute('#/lekcja/czym-jest')).toEqual({ name: 'lekcja', id: 'czym-jest' });
    expect(parseRoute('#/quiz/egzamin/')).toEqual({ name: 'quiz', id: 'egzamin' });
    expect(parseRoute('#/trening')).toEqual({ name: 'trening' });
  });

  it('nieznane i niepełne ścieżki prowadzą do domu', () => {
    expect(parseRoute('#/cokolwiek')).toEqual({ name: 'home' });
    expect(parseRoute('#/lekcja')).toEqual({ name: 'home' });
    expect(parseRoute('#/lekcja/')).toEqual({ name: 'home' });
  });

  it('zniekształcone kodowanie nie rzuca', () => {
    expect(parseRoute('#/lekcja/%E0%A4%A')).toEqual({ name: 'lekcja', id: '%E0%A4%A' });
  });

  it('routeToHash i parseRoute są odwrotne', () => {
    const routes = [
      { name: 'home' as const },
      { name: 'lekcja' as const, id: 'a b/c' },
      { name: 'quiz' as const, id: 'egzamin' },
      { name: 'trening' as const },
    ];
    for (const r of routes) expect(parseRoute(routeToHash(r))).toEqual(r);
  });
});
