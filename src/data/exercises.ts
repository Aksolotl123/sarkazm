import type { Exercise, Option } from './types';

/** Ćwiczenie „sarkazm czy na serio?”. `why` trafia do feedbacku obu opcji. */
function rozpoznaj(
  id: string,
  moduleId: string,
  context: string,
  quote: string,
  sarcastic: boolean,
  why: string,
): Exercise {
  const options: Option[] = [
    { text: 'Sarkazm', correct: sarcastic, feedback: sarcastic ? `Tak. ${why}` : `Nie. ${why}` },
    { text: 'Na serio', correct: !sarcastic, feedback: sarcastic ? `Nie. ${why}` : `Tak. ${why}` },
  ];
  return { id, moduleId, kind: 'rozpoznaj', context, quote, question: 'Sarkazm czy na serio?', options };
}

/** Ćwiczenie „czy sarkazm jest tu na miejscu?”. */
function stosownosc(
  id: string,
  context: string,
  quote: string,
  ok: boolean,
  why: string,
): Exercise {
  const options: Option[] = [
    { text: 'Tak, na miejscu', correct: ok, feedback: ok ? `Tak. ${why}` : `Nie. ${why}` },
    { text: 'Nie, odpuść', correct: !ok, feedback: ok ? `Nie. ${why}` : `Tak. ${why}` },
  ];
  return { id, moduleId: 'kiedy', kind: 'stosownosc', context, quote, question: 'Czy sarkazm jest tu na miejscu?', options };
}

const RODZAJE = {
  auto: 'Autoironiczny',
  deadpan: 'Beznamiętny',
  slodki: 'Przesłodzony',
  zlosliwy: 'Złośliwy',
  ponury: 'Ponury',
  entuzjasta: 'Entuzjastyczny',
} as const;
type Rodzaj = keyof typeof RODZAJE;

/** Ćwiczenie „jaki to rodzaj sarkazmu?” z czterema opcjami. */
function rodzaj(
  id: string,
  quote: string,
  correct: Rodzaj,
  distractors: [Rodzaj, Rodzaj, Rodzaj],
  why: string,
  context?: string,
): Exercise {
  const options: Option[] = [
    { text: RODZAJE[correct], correct: true, feedback: `Tak. ${why}` },
    ...distractors.map((d) => ({ text: RODZAJE[d], correct: false, feedback: `Nie, to ${RODZAJE[correct].toLowerCase()}. ${why}` })),
  ];
  const base: Exercise = { id, moduleId: 'rodzaje', kind: 'rodzaj', quote, question: 'Jaki to rodzaj sarkazmu?', options };
  return context ? { ...base, context } : base;
}

export const exercises: Exercise[] = [
  // ─── Moduł 1: Czym jest sarkazm ────────────────────────────────────────────
  rozpoznaj(
    'cj-01',
    'czym-jest',
    'Kolega spóźnił się 40 minut na spotkanie, które sam zwołał.',
    'O, jak miło, że jednak wpadłeś.',
    true,
    'Słowa dziękują, a sytuacja mówi „spóźniłeś się”. Rozdźwięk plus kpiące ostrze to sarkazm.',
  ),
  rozpoznaj(
    'cj-02',
    'czym-jest',
    'Koleżanka przyniosła do biura ciasto. Zniknęło w pięć minut.',
    'Naprawdę pyszne, dasz przepis?',
    false,
    'Słowa i sytuacja mówią to samo. Bez rozdźwięku nie ma sarkazmu.',
  ),
  rozpoznaj(
    'cj-03',
    'czym-jest',
    'Komputer zawiesił się trzeci raz w ciągu godziny.',
    'Uwielbiam nowoczesną technologię.',
    true,
    'Nikt nie uwielbia komputera, który się wiesza. Pochwała w tej sytuacji może być tylko kpiną.',
  ),
  rozpoznaj(
    'cj-04',
    'czym-jest',
    'Dziecko pokazuje mamie rysunek. Mama uśmiecha się szeroko.',
    'Ładny, powiesimy go na lodówce.',
    false,
    'Uśmiech, pochwała i konkretny gest zgadzają się ze sobą. To szczera reakcja.',
  ),
  rozpoznaj(
    'cj-05',
    'czym-jest',
    'Ktoś przewrócił się na zupełnie równym chodniku.',
    'Grawitacja dzisiaj wyjątkowo agresywna.',
    true,
    'Absurdalne wytłumaczenie wpadki to kpina, nie fizyka. Sarkazm celuje w sytuację.',
  ),
  rozpoznaj(
    'cj-06',
    'czym-jest',
    'Przyjaciel przez cały dzień nosił kartony przy twojej przeprowadzce.',
    'Dzięki, bez ciebie bym tego nie ogarnął.',
    false,
    'Podziękowanie za realną pomoc. Słowa i fakty się zgadzają.',
  ),
  rozpoznaj(
    'cj-07',
    'czym-jest',
    'Szef właśnie ogłosił nadgodziny w najbliższy weekend.',
    'Super, i tak nie miałem planów na życie.',
    true,
    '„Super” w reakcji na zabrany weekend plus hiperbola o „planach na życie”. Podwójny sygnał.',
  ),
  {
    id: 'cj-08',
    moduleId: 'czym-jest',
    kind: 'pojecie',
    context: 'Strażakowi spłonął własny dom, gdy był na służbie przy innym pożarze.',
    question: 'Co to za zjawisko?',
    options: [
      { text: 'Sarkazm', correct: false, feedback: 'Nie. Sarkazm potrzebuje mówcy, który kpi. Tu nikt nic nie powiedział.' },
      { text: 'Ironia sytuacyjna', correct: true, feedback: 'Tak. Rozdźwięk między oczekiwaniem (strażak chroni przed ogniem) a rzeczywistością, bez żadnego komentarza.' },
      { text: 'Cynizm', correct: false, feedback: 'Nie. Cynizm to postawa wobec ludzi, nie zbieg okoliczności.' },
    ],
  },
  {
    id: 'cj-09',
    moduleId: 'czym-jest',
    kind: 'pojecie',
    context: 'Powiedziane zupełnie serio, bez cienia żartu.',
    quote: 'Ludzie zawsze zawodzą. Lepiej na nikogo nie liczyć.',
    question: 'Co to jest?',
    options: [
      { text: 'Cynizm', correct: true, feedback: 'Tak. To postawa: brak wiary w dobre intencje. Nie ma tu rozdźwięku między słowami a myślą.' },
      { text: 'Sarkazm', correct: false, feedback: 'Nie. Mówca ma na myśli dokładnie to, co mówi. Sarkazm wymaga rozdźwięku.' },
      { text: 'Ironia sytuacyjna', correct: false, feedback: 'Nie. Ironia sytuacyjna to zbieg okoliczności, nie deklaracja poglądów.' },
    ],
  },
  {
    id: 'cj-10',
    moduleId: 'czym-jest',
    kind: 'pojecie',
    context: 'Kolega mówi to tak, żebyś uwierzył, choć nie ma zamiaru pożyczyć ani złotówki.',
    quote: 'Jasne, pożyczę ci te 500 zł.',
    question: 'Co to jest?',
    options: [
      { text: 'Kłamstwo', correct: true, feedback: 'Tak. Kłamstwo chce, żebyś uwierzył. Sarkazm chce, żebyś NIE uwierzył.' },
      { text: 'Sarkazm', correct: false, feedback: 'Nie. Sarkazm daje odbiorcy szansę zorientować się, że to nie serio. Tu tej szansy nie ma.' },
      { text: 'Ironia', correct: false, feedback: 'Nie. Ironia zakłada, że rozdźwięk jest do odczytania. Tu jest ukryty celowo.' },
    ],
  },

  // ─── Moduł 2: Sygnały ──────────────────────────────────────────────────────
  rozpoznaj(
    'sy-01',
    'sygnaly',
    'Właśnie wylałeś kawę na klawiaturę.',
    'No pięknie.',
    true,
    '„No” na początku zdania plus „pięknie” w reakcji na katastrofę. Klasyczny polski sarkazm w dwóch słowach.',
  ),
  {
    id: 'sy-02',
    moduleId: 'sygnaly',
    kind: 'sygnal',
    context: 'Po dwugodzinnej prezentacji ktoś wytyka ci jedną literówkę na ostatnim slajdzie.',
    quote: 'Bardzo dziękuję za tę niezwykle cenną uwagę.',
    question: 'Który sygnał najmocniej zdradza sarkazm?',
    options: [
      { text: 'Kontrast rejestru: nadmierna uprzejmość', correct: true, feedback: 'Tak. Oficjalna, wyszukana forma w błahej sytuacji. Im grzeczniej, tym bardziej kąśliwie.' },
      { text: 'Przeciągnięte samogłoski', correct: false, feedback: 'Nie. Tego nie widać w zapisie. Sygnałem jest tu sama forma wypowiedzi.' },
      { text: 'Emotka', correct: false, feedback: 'Nie. Nie ma tu żadnej emotki. Sygnałem jest przesadna uprzejmość.' },
    ],
  },
  rozpoznaj(
    'sy-03',
    'sygnaly',
    'SMS od koleżanki o znajomym, który spóźnia się na wszystko.',
    'jasne, na pewno przyjdzie na czas 🙃',
    true,
    '„Jasne”, „na pewno” i 🙃 to trzy tekstowe sygnały naraz. W tekście trzeba ich więcej niż w mowie.',
  ),
  {
    id: 'sy-04',
    moduleId: 'sygnaly',
    kind: 'sygnal',
    question: 'Które zdanie, bez żadnego kontekstu, najprawdopodobniej jest sarkastyczne?',
    options: [
      { text: '„Dzięki za pomoc.”', correct: false, feedback: 'Nie. To neutralne podziękowanie. Nic tu nie zgrzyta.' },
      { text: '„No dzięki za pomoc.”', correct: true, feedback: 'Tak. Partykuła „no” na początku to w polszczyźnie mocny sygnał sarkazmu.' },
      { text: '„Dziękuję ci za pomoc.”', correct: false, feedback: 'Nie. Pełna, spokojna forma. Bez kontekstu brzmi szczerze.' },
    ],
  },
  {
    id: 'sy-05',
    moduleId: 'sygnaly',
    kind: 'sygnal',
    context: 'Po drobnej stłuczce na parkingu.',
    quote: 'Najlepszy dzień w moim życiu.',
    question: 'Który sygnał sarkazmu tu działa?',
    options: [
      { text: 'Hiperbola', correct: true, feedback: 'Tak. „Najlepszy dzień w życiu” to przesada, która sama się demaskuje.' },
      { text: 'Niedopowiedzenie', correct: false, feedback: 'Nie. Niedopowiedzenie umniejsza. Tu mamy odwrotność: wielkie słowa o drobnym zdarzeniu.' },
      { text: 'Kontrast rejestru', correct: false, feedback: 'Nie. Nie ma tu oficjalnego tonu. Działa sama przesada.' },
    ],
  },
  {
    id: 'sy-06',
    moduleId: 'sygnaly',
    kind: 'sygnal',
    context: 'Sytuacja A: klient właśnie podpisał umowę po twojej prezentacji. Sytuacja B: wylałeś kawę na laptop klienta.',
    quote: 'Świetna robota.',
    question: 'W której sytuacji to zdanie jest sarkazmem?',
    options: [
      { text: 'W sytuacji A', correct: false, feedback: 'Nie. Po podpisanej umowie „świetna robota” to zwykła pochwała.' },
      { text: 'W sytuacji B', correct: true, feedback: 'Tak. To samo zdanie, inna sytuacja. Sarkazm siedzi w kontekście, nie w słowach.' },
      { text: 'W obu', correct: false, feedback: 'Nie. W sytuacji A nie ma rozdźwięku, więc nie ma sarkazmu.' },
      { text: 'W żadnej', correct: false, feedback: 'Nie. W sytuacji B pochwała po katastrofie może być tylko kpiną.' },
    ],
  },
  {
    id: 'sy-07',
    moduleId: 'sygnaly',
    kind: 'sygnal',
    question: 'Co w mowie najczęściej zdradza sarkazm?',
    options: [
      { text: 'Przeciągnięte samogłoski i płaski ton', correct: true, feedback: 'Tak. „Świeeetnie” powiedziane bez emocji to podręcznikowy sygnał.' },
      { text: 'Szybkie tempo mówienia', correct: false, feedback: 'Nie. Szybkie tempo to raczej zdenerwowanie albo pośpiech.' },
      { text: 'Podniesiony głos', correct: false, feedback: 'Nie. Podniesiony głos to złość. Sarkazm zwykle jest cichy i spokojny.' },
    ],
  },
  rozpoznaj(
    'sy-08',
    'sygnaly',
    'Odpisałeś klientowi po trzech tygodniach. Klient odpowiada:',
    'Dziękujemy za błyskawiczną odpowiedź.',
    true,
    '„Błyskawiczna” po trzech tygodniach to rozdźwięk, którego nie da się przeoczyć.',
  ),
  rozpoznaj(
    'sy-09',
    'sygnaly',
    'Kolega wraca z urlopu wyraźnie opalony.',
    'Widzę, że pogoda dopisała.',
    false,
    'Słowa zgadzają się z tym, co widać. Bez rozdźwięku to zwykła uwaga.',
  ),
  rozpoznaj(
    'sy-10',
    'sygnaly',
    'Wiadomość od współpracownika na czacie.',
    'Zrobione, raport jest w folderze. Daj znać, jeśli czegoś brakuje.',
    false,
    'Żadnego „no”, żadnej przesady, żadnej emotki. Nie każde zdanie kryje drugie dno.',
  ),

  // ─── Moduł 3: Rodzaje ──────────────────────────────────────────────────────
  rodzaj(
    'ro-01',
    'Jasne, ja i gotowanie. Ostatnio przypaliłem wodę.',
    'auto',
    ['zlosliwy', 'slodki', 'ponury'],
    'Celem jest sam mówca. Nikt inny nie oberwał.',
  ),
  rodzaj(
    'ro-02',
    'OCH, JAK CUDOWNIE! Kolejna ankieta satysfakcji! Nie mogę się doczekać!',
    'entuzjasta',
    ['deadpan', 'auto', 'ponury'],
    'Przesadny zachwyt, który sam się demaskuje. Nikt tak nie cieszy się z ankiety.',
  ),
  rodzaj(
    'ro-03',
    'Tak. Bardzo się cieszę.',
    'deadpan',
    ['entuzjasta', 'slodki', 'zlosliwy'],
    'Kamienna twarz i płaski ton. Sygnałem jest właśnie brak sygnałów.',
    'Powiedziane bez zmiany tonu, bez uśmiechu, patrząc w punkt na ścianie.',
  ),
  rodzaj(
    'ro-04',
    'Kochanie, to takie urocze, że znowu zostawiłeś naczynia. Uwielbiam je myć.',
    'slodki',
    ['deadpan', 'auto', 'entuzjasta'],
    'Ocieka czułością, a pod spodem siedzi pretensja. Im słodsze słowa, tym więcej kwasu.',
  ),
  rodzaj(
    'ro-05',
    'Brawo, geniuszu. Naprawdę, Nobel czeka.',
    'zlosliwy',
    ['auto', 'slodki', 'deadpan'],
    'Wymierzony w konkretną osobę, żeby ją obniżyć. Najbardziej ryzykowny rodzaj.',
  ),
  rodzaj(
    'ro-06',
    'Nie, spoko, ja zostanę po godzinach. Jak zawsze. Nikt inny przecież nie może.',
    'ponury',
    ['entuzjasta', 'auto', 'slodki'],
    'Pod sarkazmem siedzi prawdziwy żal. To pretensja powiedziana naokoło.',
  ),
  {
    id: 'ro-07',
    moduleId: 'rodzaje',
    kind: 'rodzaj',
    question: 'Który rodzaj sarkazmu jest najbezpieczniejszy w nowej grupie?',
    options: [
      { text: 'Autoironiczny', correct: true, feedback: 'Tak. Celujesz w siebie, więc nikt nie może się obrazić. Idealny na start.' },
      { text: 'Złośliwy', correct: false, feedback: 'Nie. Złośliwość wobec ludzi, których nie znasz, to najkrótsza droga do konfliktu.' },
      { text: 'Przesłodzony', correct: false, feedback: 'Nie. Obcy nie wiedzą, czy jesteś miły, czy kpisz. Ryzykowne.' },
      { text: 'Beznamiętny', correct: false, feedback: 'Nie. Nowi ludzie nie znają twojej kamiennej twarzy i wezmą to dosłownie.' },
    ],
  },
  {
    id: 'ro-08',
    moduleId: 'rodzaje',
    kind: 'rodzaj',
    question: 'Który rodzaj sarkazmu najtrudniej rozpoznać przez telefon albo w tekście?',
    options: [
      { text: 'Beznamiętny', correct: true, feedback: 'Tak. Jego jedynym sygnałem jest brak sygnałów. Bez twarzy i sytuacji brzmi jak powaga.' },
      { text: 'Entuzjastyczny', correct: false, feedback: 'Nie. Przesadny zachwyt widać nawet w SMS-ie, zwłaszcza wielkimi literami.' },
      { text: 'Złośliwy', correct: false, feedback: 'Nie. Złośliwość zwykle czuć od razu, niezależnie od kanału.' },
      { text: 'Autoironiczny', correct: false, feedback: 'Nie. Autoironia zwykle sama podaje kontekst („ja i punktualność”).' },
    ],
  },
  rodzaj(
    'ro-09',
    'Egzamin poszedł mi świetnie. Jeśli za świetnie uznać 3 punkty na 100.',
    'auto',
    ['zlosliwy', 'ponury', 'deadpan'],
    'Mówca kpi z własnego wyniku. Druga część zdania sama zdradza żart.',
  ),
  rodzaj(
    'ro-10',
    'Bardzo, ale to bardzo dziękuję, że mi przypomniałaś. Trzeci raz dzisiaj. Jesteś aniołem.',
    'slodki',
    ['auto', 'entuzjasta', 'deadpan'],
    'Podziękowania i „anioł” w reakcji na irytujące przypominanie. Słodycz z kwasem w środku.',
  ),

  // ─── Moduł 4: Riposta ──────────────────────────────────────────────────────
  {
    id: 'ri-01',
    moduleId: 'riposta',
    kind: 'riposta',
    context: 'Kolega, trzeci raz w tym tygodniu:',
    quote: 'Znowu zapomniałem hasła.',
    question: 'Wybierz najlepszą sarkastyczną ripostę.',
    options: [
      { text: '„Zapisz je na karteczce i przyklej do monitora. Bezpieczne i wygodne.”', correct: true, feedback: 'Tak. Zgoda doprowadzona do absurdu: krótko, celuje w sytuację, kolega się zaśmieje.' },
      { text: '„Jesteś beznadziejny.”', correct: false, feedback: 'Nie. To obraza, nie sarkazm. Nie ma tu żadnego rozdźwięku między słowami a myślą.' },
      { text: '„Zainstaluj menedżer haseł.”', correct: false, feedback: 'Nie. Dobra rada, ale zupełnie na serio. Pytanie było o ripostę.' },
      { text: '„Ha, ha. To ironiczne, bo hasła powinno się pamiętać.”', correct: false, feedback: 'Nie. Tłumaczenie żartu zabija żart. Riposta ma się bronić sama.' },
    ],
  },
  {
    id: 'ri-02',
    moduleId: 'riposta',
    kind: 'riposta',
    context: 'Współpracownik obiecuje to samo od tygodnia:',
    quote: 'Wyślę ci to do końca dnia.',
    question: 'Wybierz najlepszą sarkastyczną ripostę.',
    options: [
      { text: '„Jasne. Którego?”', correct: true, feedback: 'Tak. Dosłowność w dwóch słowach. Krótko, celnie, bez obrażania.' },
      { text: '„Kłamiesz jak zawsze.”', correct: false, feedback: 'Nie. Oskarżenie wprost. Może i prawdziwe, ale to nie riposta, to zarzut.' },
      { text: '„OK, dzięki.”', correct: false, feedback: 'Nie. Zupełnie na serio. Nie ma tu żadnego ostrza.' },
      { text: '„Mówię z sarkazmem: jasne, jasne.”', correct: false, feedback: 'Nie. Zapowiadanie sarkazmu to jak zapowiadanie puenty. Nie rób tego.' },
    ],
  },
  {
    id: 'ri-03',
    moduleId: 'riposta',
    kind: 'riposta',
    context: 'Wychodzisz z dwugodzinnego spotkania, które mogło być mailem. Kolega pyta:',
    quote: 'I jak było?',
    question: 'Wybierz najlepszą sarkastyczną ripostę.',
    options: [
      { text: '„Cudownie. Rozważam prośbę o dogrywkę.”', correct: true, feedback: 'Tak. Przesadna pochwała plus absurdalny szczegół. Celuje w spotkanie, nie w ludzi.' },
      { text: '„Okropnie, nie znoszę tych spotkań.”', correct: false, feedback: 'Nie. Szczere narzekanie. Prawdziwe, ale bez żadnego żartu.' },
      { text: '„Ironicznie mówiąc: świetnie.”', correct: false, feedback: 'Nie. Etykieta „ironicznie” zabija efekt. Odbiorca sam ma to wyłapać.' },
      { text: '„Szef to idiota.”', correct: false, feedback: 'Nie. Obraza konkretnej osoby. Nie sarkazm, tylko ryzyko zawodowe.' },
    ],
  },
  {
    id: 'ri-04',
    moduleId: 'riposta',
    kind: 'riposta',
    context: 'Znajomy chwali się, jakby wygrał milion:',
    quote: 'Wygrałem 5 złotych na loterii!',
    question: 'Wybierz najlepszą sarkastyczną ripostę.',
    options: [
      { text: '„No to możesz już rzucić pracę.”', correct: true, feedback: 'Tak. Hiperbola w jednym zdaniu. Śmieje się z sytuacji, nie ze znajomego.' },
      { text: '„Gratulacje!”', correct: false, feedback: 'Nie. Miłe i na serio. Pytanie było o ripostę.' },
      { text: '„To bardzo mało.”', correct: false, feedback: 'Nie. Dosłowne, suche i lekko przykre. Bez żadnego rozdźwięku.' },
      { text: '„Chciałbym mieć twoje szczęście. Oczywiście żartuję, bo 5 zł to mało.”', correct: false, feedback: 'Nie. Dobry początek zabity tłumaczeniem. Zatrzymaj się po pierwszym zdaniu.' },
    ],
  },
  {
    id: 'ri-05',
    moduleId: 'riposta',
    kind: 'technika',
    quote: 'Co?! Spóźniłeś się?! To zupełnie do ciebie niepodobne.',
    question: 'Jaka technika została użyta?',
    options: [
      { text: 'Fałszywe zaskoczenie', correct: true, feedback: 'Tak. Udawane zdumienie czymś całkowicie przewidywalnym.' },
      { text: 'Niedopowiedzenie', correct: false, feedback: 'Nie. Niedopowiedzenie umniejsza. Tu mamy udawane zdziwienie.' },
      { text: 'Dosłowność', correct: false, feedback: 'Nie. Dosłowność bierze czyjeś słowa wprost. Tu nikt nic nie powiedział.' },
    ],
  },
  {
    id: 'ri-06',
    moduleId: 'riposta',
    kind: 'technika',
    context: 'Szef prosi o „jeszcze jedną małą rzecz” do piątku.',
    quote: 'Jasne, dodajmy jeszcze trzy funkcje przed piątkiem. I przy okazji przepiszmy całość od zera.',
    question: 'Jaka technika została użyta?',
    options: [
      { text: 'Zgoda doprowadzona do absurdu', correct: true, feedback: 'Tak. Przytaknięcie i pociągnięcie pomysłu, aż sam się ośmieszy.' },
      { text: 'Fałszywe zaskoczenie', correct: false, feedback: 'Nie. Nikt tu nie udaje zdziwienia. Mówca się „zgadza”.' },
      { text: 'Przesadna pochwała', correct: false, feedback: 'Nie. Nikt niczego nie chwali. Mówca eskaluje pomysł.' },
    ],
  },
  {
    id: 'ri-07',
    moduleId: 'riposta',
    kind: 'technika',
    context: 'Serwer padł, cała firma stoi, telefony się urywają.',
    quote: 'Mamy mały problem.',
    question: 'Jaka technika została użyta?',
    options: [
      { text: 'Niedopowiedzenie', correct: true, feedback: 'Tak. Katastrofa opisana jak drobiazg. Działa najlepiej z kamienną twarzą.' },
      { text: 'Hiperbola', correct: false, feedback: 'Nie. Hiperbola wyolbrzymia. Tu jest dokładnie odwrotnie.' },
      { text: 'Dosłowność', correct: false, feedback: 'Nie. Nikt nie bierze niczyich słów wprost. Mówca umniejsza skalę.' },
    ],
  },
  {
    id: 'ri-08',
    moduleId: 'riposta',
    kind: 'technika',
    quote: 'Świetny pomysł… to znaczy mówię ironicznie, bo wcale nie uważam, że jest świetny, bo ma sporo wad.',
    question: 'Która zasada dobrej riposty została złamana?',
    options: [
      { text: 'Nie tłumacz żartu', correct: true, feedback: 'Tak. „Świetny pomysł” wystarczyło. Reszta to instrukcja obsługi żartu.' },
      { text: 'Celuj w sytuację, nie w osobę', correct: false, feedback: 'Nie. Riposta celuje w pomysł, więc ta zasada jest zachowana. Złamano inną.' },
      { text: 'Ton pewny', correct: false, feedback: 'Nie. Problemem nie jest ton, tylko to, że mówca tłumaczy własny żart.' },
    ],
  },
  {
    id: 'ri-09',
    moduleId: 'riposta',
    kind: 'riposta',
    context: 'Kolega pokazuje slajd: 400 słów tekstu czcionką 8 punktów.',
    quote: 'I jak wygląda?',
    question: 'Wybierz najlepszą sarkastyczną ripostę.',
    options: [
      { text: '„Czytelnie. Z lupą.”', correct: true, feedback: 'Tak. Pochwała z jednym demaskującym szczegółem. Dwa słowa i po sprawie.' },
      { text: '„Za dużo tekstu, zmniejsz.”', correct: false, feedback: 'Nie. Dobry feedback, ale na serio. Pytanie było o ripostę.' },
      { text: '„Fatalnie. Kto cię tego uczył?”', correct: false, feedback: 'Nie. To atak na osobę, bez żadnego rozdźwięku. Obraza, nie sarkazm.' },
      { text: '„Wygląda dobrze.”', correct: false, feedback: 'Nie. Bez żadnego sygnału to po prostu nieszczera pochwała. Kolega w nią uwierzy.' },
    ],
  },
  {
    id: 'ri-10',
    moduleId: 'riposta',
    kind: 'riposta',
    context: 'Przyjaciel, szczerze skruszony:',
    quote: 'Przepraszam, zapomniałem o twoich urodzinach.',
    question: 'Która riposta jest lekka, a nie przestrzelona?',
    options: [
      { text: '„Nie szkodzi, mam je co roku. Jeszcze załapiesz.”', correct: true, feedback: 'Tak. Jedno zdanie, ciepłe ostrze. Przyjaciel się zaśmieje i temat zamknięty.' },
      { text: '„Jasne, bo przecież nigdy nic dla ciebie nie znaczyłem, nasza przyjaźń to fikcja, dzięki, naprawdę, wspaniale.”', correct: false, feedback: 'Nie. Seria sarkazmów to już nie żart, to kłótnia. Jedna riposta wystarczy.' },
      { text: '„OK.”', correct: false, feedback: 'Nie. Zero sarkazmu, ale też zero ciepła. Brzmi jak foch.' },
      { text: '„Nie obchodzi mnie to.”', correct: false, feedback: 'Nie. Na serio i chłodno. Nic tu nie jest żartem.' },
    ],
  },

  // ─── Moduł 5: Kiedy (nie) używać ───────────────────────────────────────────
  stosownosc(
    'ki-01',
    'Koleżanka mówi ci, że jej pies jest ciężko chory.',
    'No super, będziesz miała powód do wolnego.',
    false,
    'Ktoś przeżywa trudny moment. Czerwone światło, bez wyjątków.',
  ),
  stosownosc(
    'ki-02',
    'Kumpel od dziesięciu lat spóźnia się, jak zwykle, pięć minut.',
    'Punktualny jak zawsze.',
    true,
    'Bliska osoba, niska stawka, wspólny kod. Zaśmieje się razem z tobą.',
  ),
  stosownosc(
    'ki-03',
    'Nowy stażysta, którego jesteś opiekunem, popełnił błąd w raporcie.',
    'No, pięknie. Gratuluję.',
    false,
    'Feedback dla kogoś zależnego. Sarkazm uczy tu lęku, nie poprawy. Powiedz wprost, co i jak poprawić.',
  ),
  stosownosc(
    'ki-04',
    'Mail do klienta, którego nigdy nie spotkałeś, po jego dwutygodniowym opóźnieniu.',
    'Dziękujemy za błyskawiczną odpowiedź.',
    false,
    'Obcy człowiek, tekst bez tonu, relacja zawodowa. Trzy czerwone flagi naraz.',
  ),
  stosownosc(
    'ki-05',
    'Partner znów zostawił naczynia w zlewie. Zamiast rozmowy mówisz:',
    'Nie, nie, ja pozmywam. Jak zawsze.',
    false,
    'To pasywna agresja: pretensja powiedziana naokoło. Druga strona nie wie, na co ma odpowiedzieć. Powiedz wprost.',
  ),
  stosownosc(
    'ki-06',
    'Pięciolatek z dumą pokazuje „posprzątany” pokój, w którym nic się nie zmieniło.',
    'Pięknie posprzątane.',
    false,
    'Małe dzieci biorą słowa dosłownie. Usłyszy pochwałę i uzna, że tak wygląda porządek.',
  ),
  stosownosc(
    'ki-07',
    'Grupa znajomych wychodzi z kina po wyjątkowo słabym filmie.',
    'Arcydzieło. Oscar murowany.',
    true,
    'Znajomi, niska stawka, celujesz w film, nie w człowieka. Wszyscy się śmieją.',
  ),
  stosownosc(
    'ki-08',
    'Kolega z pracy właśnie dostał wypowiedzenie.',
    'No to masz wreszcie wolny weekend.',
    false,
    'Kryzys drugiej osoby. Nawet jeśli kolega sam żartuje, ty nie zaczynaj.',
  ),
  {
    id: 'ki-09',
    moduleId: 'kiedy',
    kind: 'stosownosc',
    context: 'Twój żart nie wypalił. Osoba wyraźnie wygląda na urażoną.',
    question: 'Co robisz?',
    options: [
      { text: 'Mówisz: „Żartowałem, przepraszam, zabrzmiało gorzej, niż chciałem” i zmieniasz temat.', correct: true, feedback: 'Tak. Jedno zdanie, bez tłumaczenia żartu, i idziesz dalej.' },
      { text: 'Tłumaczysz przez pięć minut, dlaczego to było śmieszne.', correct: false, feedback: 'Nie. Tłumaczenie żartu nie naprawia sytuacji, tylko ją przedłuża.' },
      { text: 'Dorzucasz kolejny żart, żeby rozluźnić atmosferę.', correct: false, feedback: 'Nie. Drugi żart po nieudanym pierwszym zwykle pogarsza sprawę.' },
      { text: 'Udajesz, że nic się nie stało.', correct: false, feedback: 'Nie. Urażona osoba to zapamięta. Jedno krótkie przeprosiny kosztuje mniej.' },
    ],
  },
  {
    id: 'ki-10',
    moduleId: 'kiedy',
    kind: 'stosownosc',
    context: 'Drukarka w biurze znowu się zacięła, tym razem przy Marku.',
    question: 'Które zdanie kieruje sarkazm w sytuację, a nie w człowieka?',
    options: [
      { text: '„Ta drukarka ma najwyraźniej własne zdanie o naszych terminach.”', correct: true, feedback: 'Tak. Cel: drukarka. Marek śmieje się razem z tobą.' },
      { text: '„Ty to nawet drukarki nie umiesz obsłużyć. Brawo.”', correct: false, feedback: 'Nie. Cel: Marek. To obraza z sarkastyczną nakładką.' },
      { text: '„Marek jak zwykle zepsuł drukarkę. Cudownie.”', correct: false, feedback: 'Nie. Nadal celuje w Marka, tylko naokoło. Wyśmiany, nie rozśmieszony.' },
    ],
  },
];

export const exercisesByModule = (moduleId: string): Exercise[] =>
  exercises.filter((e) => e.moduleId === moduleId);
