import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ANDROID_CONTENT_PATH, buildContent, serializeContent } from '../data/export';

describe('eksport treści dla Androida', () => {
  it('plik w aplikacji Androida jest zgodny z danymi (uruchom `npm run export:content`, jeśli test pada)', () => {
    const onDisk = readFileSync(resolve(import.meta.dirname, '..', '..', ANDROID_CONTENT_PATH), 'utf8');
    expect(onDisk).toBe(serializeContent());
  });

  it('eksport zawiera wszystkie sekcje treści', () => {
    const content = buildContent();
    expect(content.modules.length).toBeGreaterThan(0);
    expect(content.lessons.length).toBeGreaterThan(0);
    expect(content.exercises.length).toBeGreaterThan(0);
  });
});
