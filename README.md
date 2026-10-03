# Akademia Sarkazmu

Aplikacja do nauki sarkazmu: pięć lekcji z teorią, po każdej dziesięć ćwiczeń, na końcu egzamin. Istnieje w dwóch wersjach o tej samej treści:

- **natywna aplikacja na Androida** (Kotlin + Jetpack Compose) w katalogu `android/`,
- **aplikacja webowa** (Vite + React) w katalogu głównym.

Żadna nie wymaga backendu ani konta. Postęp zapisuje się lokalnie na urządzeniu.

## Co jest w środku

| Moduł | Treść | Ćwiczenia |
| --- | --- | --- |
| 1. Czym jest sarkazm | definicja, sarkazm a ironia, cynizm, kłamstwo | sarkazm czy na serio, pojęcia |
| 2. Jak go rozpoznać | rozdźwięk z sytuacją, hiperbola, ton, słowa-klucze, kontrast rejestru | rozpoznawanie, sygnały |
| 3. Rodzaje sarkazmu | autoironiczny, beznamiętny, przesłodzony, złośliwy, ponury, entuzjastyczny | jaki to rodzaj |
| 4. Budowanie riposty | pięć technik i zasady dobrej odpowiedzi | wybierz ripostę, jaka technika |
| 5. Kiedy (nie) używać | zielone, żółte i czerwone światło, pasywna agresja, co robić, gdy nie wypali | czy to na miejscu |
| 6. Egzamin | 15 losowych pytań ze wszystkich lekcji, próg 80% | |

Kolejna lekcja odblokowuje się po zaliczeniu poprzedniej (próg 70%). Tryb „Trening” losuje 10 pytań z odblokowanych lekcji i nie wpływa na postęp.

## Uruchomienie

```bash
npm install
npm run dev        # serwer deweloperski, domyślnie http://localhost:5173
npm test           # testy (Vitest)
npm run build      # typecheck + build produkcyjny do dist/
npm run preview    # podgląd zbudowanej wersji
```

## Struktura

```
src/
  data/        treść: moduły, lekcje, ćwiczenia (czysty TypeScript, bez React)
  lib/         logika czysta: losowanie, budowanie quizu, postęp, zapis, routing
  components/  ekrany React: lista lekcji, lekcja, quiz, podsumowanie
  test/        testy logiki i spójności treści
```

Treść i logika są oddzielone od UI, więc dodanie lekcji lub ćwiczenia to edycja jednego pliku w `src/data/`. Testy w `src/test/content.test.ts` sprawdzają, czy każde ćwiczenie ma dokładnie jedną poprawną odpowiedź, feedback przy każdej opcji i należy do istniejącej lekcji.

## Dodawanie ćwiczeń

Ćwiczenie to obiekt `Exercise` w `src/data/exercises.ts`. Dla najczęstszych typów są funkcje pomocnicze:

```ts
rozpoznaj('sy-11', 'sygnaly', 'Kontekst sytuacji.', 'Wypowiedź.', true, 'Dlaczego tak.');
stosownosc('ki-11', 'Kontekst.', 'Wypowiedź.', false, 'Dlaczego nie.');
rodzaj('ro-11', 'Wypowiedź.', 'auto', ['zlosliwy', 'slodki', 'ponury'], 'Dlaczego.');
```

Liczba ćwiczeń w lekcji musi równać się `quizSize` modułu w `src/data/modules.ts` (pilnuje tego test).

## Aplikacja na Androida

Natywna aplikacja w Kotlinie i Jetpack Compose, minimalnie Android 8.0 (API 26).

```
android/
  core/   logika i treść w czystym Kotlinie (osobny build, testy bez Android SDK)
  app/    interfejs w Jetpack Compose, ViewModel, zapis postępu w SharedPreferences
```

**Instalacja na telefonie.** Workflow „Android” w GitHub Actions buduje APK przy każdej zmianie w `android/` lub w treści kursu. Pobierz artefakt `akademia-sarkazmu-debug-apk` z ostatniego udanego przebiegu, rozpakuj i otwórz plik `app-debug.apk` na telefonie. Android poprosi o zgodę na instalację z nieznanego źródła.

**Budowanie lokalnie** (wymaga Android SDK, np. z Android Studio):

```bash
cd android
./gradlew -p core test                 # logika i treść, działa bez Android SDK
./gradlew :app:testDebugUnitTest       # testy interfejsu (Robolectric)
./gradlew :app:assembleDebug           # APK w app/build/outputs/apk/debug/
```

Można też otworzyć katalog `android/` w Android Studio i uruchomić aplikację na emulatorze.

### Wspólna treść

Lekcje i ćwiczenia są zapisane raz, w `src/data/`. Aplikacja na Androida czyta je z pliku `android/core/src/main/resources/content.json`. Po każdej zmianie treści wygeneruj ten plik ponownie:

```bash
npm run export:content
```

Test w `src/test/export.test.ts` nie przejdzie, jeśli plik jest nieaktualny, więc CI wyłapie zapomniany eksport.

## Publikacja na GitHub Pages

Workflow `.github/workflows/deploy.yml` buduje aplikację przy każdym pushu do `main` i publikuje ją na GitHub Pages. Żeby zadziałał, w ustawieniach repozytorium (Settings → Pages) ustaw źródło na „GitHub Actions”. Aplikacja będzie dostępna pod `https://<użytkownik>.github.io/sarkazm/`.
