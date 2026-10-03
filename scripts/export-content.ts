import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ANDROID_CONTENT_PATH, serializeContent } from '../src/data/export';

const target = resolve(import.meta.dirname, '..', ANDROID_CONTENT_PATH);
writeFileSync(target, serializeContent(), 'utf8');
console.log(`Zapisano treść do ${ANDROID_CONTENT_PATH}`);
