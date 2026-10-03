import { exercises } from './exercises';
import { lessons } from './lessons';
import { modules } from './modules';

/** Wersja formatu pliku z treścią. Zmień przy niekompatybilnej zmianie struktury. */
export const CONTENT_FORMAT_VERSION = 1;

/** Ścieżka pliku czytanego przez aplikację na Androida (względem katalogu repozytorium). */
export const ANDROID_CONTENT_PATH = 'android/core/src/main/resources/content.json';

/** Cała treść kursu w jednym obiekcie, gotowa do zapisania jako JSON. */
export function buildContent() {
  return { version: CONTENT_FORMAT_VERSION, modules, lessons, exercises };
}

/** Deterministyczny tekst JSON (stałe wcięcia i końcowa nowa linia), żeby diff w gicie był czytelny. */
export function serializeContent(): string {
  return JSON.stringify(buildContent(), null, 2) + '\n';
}
