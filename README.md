# Akademia Sarkazmu

Aplikacja webowa do nauki sarkazmu: pięć lekcji z teorią, po każdej dziesięć ćwiczeń, na końcu egzamin. Działa w przeglądarce na komputerze i telefonie, nie wymaga backendu ani konta. Postęp zapisuje się w `localStorage` przeglądarki.

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

## Publikacja na GitHub Pages

Workflow `.github/workflows/deploy.yml` buduje aplikację przy każdym pushu do `main` i publikuje ją na GitHub Pages. Żeby zadziałał, w ustawieniach repozytorium (Settings → Pages) ustaw źródło na „GitHub Actions”. Aplikacja będzie dostępna pod `https://<użytkownik>.github.io/sarkazm/`.
