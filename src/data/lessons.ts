import type { Lesson } from './types';

export const lessons: Lesson[] = [
  {
    id: 'czym-jest',
    title: 'Czym jest sarkazm',
    intro:
      'Sarkazm to mówienie czegoś innego, niż się ma na myśli, po to, żeby zakpić, skrytykować albo rozbawić. Cała sztuka polega na tym, żeby słuchacz zauważył, że nie mówisz serio.',
    sections: [
      {
        heading: 'Definicja robocza',
        paragraphs: [
          'Sarkazm to wypowiedź, w której słowa mówią jedno, a sytuacja mówi drugie. Chwalisz coś, co ewidentnie jest złe. Dziękujesz za coś, co ci zaszkodziło. Zachwycasz się czymś, co cię irytuje.',
          'Słowo pochodzi z greckiego „sarkazein”, czyli „rozrywać mięso” albo „gryźć wargi ze złości”. To dobrze oddaje jego naturę: sarkazm ma ostrze. Nawet gdy jest żartobliwy, zawsze w coś celuje.',
        ],
        examples: [
          {
            text: 'Leje jak z cebra. „Piękna pogoda na grilla.”',
            note: 'Sarkazm: słowa chwalą, sytuacja zaprzecza.',
          },
          {
            text: 'Świeci słońce, 24 stopnie. „Piękna pogoda na grilla.”',
            note: 'To samo zdanie, na serio. Bez kontekstu nie odróżnisz.',
          },
        ],
      },
      {
        heading: 'Sarkazm a ironia',
        paragraphs: [
          'Ironia to pojęcie szersze. Ironia werbalna to każdy rozdźwięk między tym, co powiedziane, a tym, co znaczone. Sarkazm to ironia werbalna z ostrzem, wymierzona w kogoś lub coś.',
          'Ironia sytuacyjna to z kolei rozdźwięk między oczekiwaniem a rzeczywistością, bez żadnego mówcy. Strażak, któremu spłonął dom, to ironia losu, nie sarkazm.',
        ],
        examples: [
          {
            text: 'Instruktor BHP potyka się o własny kabel.',
            note: 'Ironia sytuacyjna. Nikt nic nie powiedział.',
          },
          {
            text: 'Kolega, patrząc na to: „Wzór do naśladowania.”',
            note: 'Sarkazm. Ktoś skomentował ironię losu z kpiną.',
          },
        ],
      },
      {
        heading: 'Sarkazm a cynizm',
        paragraphs: [
          'Cynizm to postawa: przekonanie, że ludźmi kierują niskie pobudki i nie warto na nikogo liczyć. Sarkazm to narzędzie językowe. Cynik może być sarkastyczny, ale sarkasta nie musi być cynikiem.',
          '„Ludzie zawsze zawodzą” to cynizm wypowiedziany zupełnie serio. „O, jak miło, że jednak przyszedłeś” po 40 minutach spóźnienia to sarkazm bez żadnej filozofii w tle.',
        ],
      },
      {
        heading: 'Sarkazm a kłamstwo',
        paragraphs: [
          'Kłamstwo chce, żebyś uwierzył. Sarkazm chce, żebyś NIE uwierzył, i na tym polega żart. Jeśli słuchacz bierze twoje słowa dosłownie, sarkazm nie zadziałał. Zostaje wtedy albo kłamstwo, albo nieporozumienie.',
        ],
        tip: 'Test na sarkazm: czy odbiorca ma realną szansę zorientować się, że nie mówisz serio? Jeśli nie, to nie jest sarkazm.',
      },
    ],
    takeaways: [
      'Sarkazm = słowa mówią jedno, sytuacja drugie, z kpiącym ostrzem.',
      'Ironia to szersze pojęcie; ironia losu nie potrzebuje mówcy.',
      'Cynizm to postawa, sarkazm to narzędzie.',
      'Sarkazm działa tylko wtedy, gdy odbiorca go rozpozna.',
    ],
  },
  {
    id: 'sygnaly',
    title: 'Jak rozpoznać sarkazm',
    intro:
      'Sarkazm zostawia ślady: w sytuacji, w doborze słów, w tonie głosu. Kiedy nauczysz się je widzieć, przestaniesz brać „no świetnie” za pochwałę.',
    sections: [
      {
        heading: 'Sygnał 1: rozdźwięk z sytuacją',
        paragraphs: [
          'To najważniejszy sygnał. Jeśli ktoś chwali coś, co ewidentnie poszło źle, albo dziękuje za coś, co mu zaszkodziło, prawie na pewno nie mówi serio.',
          'Dlatego sarkazm bez kontekstu nie istnieje. „Świetna robota” po podpisaniu umowy z klientem to pochwała. „Świetna robota” po wylaniu kawy na laptop klienta to sarkazm.',
        ],
      },
      {
        heading: 'Sygnał 2: przesada',
        paragraphs: [
          'Sarkazm lubi hiperbolę. „Najlepszy dzień w moim życiu” po stłuczce, „mamy przecież całe 20 minut” na trzy godziny roboty. Im większa przesada, tym wyraźniejszy sygnał.',
        ],
        examples: [
          {
            text: '„Mamy całe 20 minut na trzy godziny roboty. Spokojnie zdążymy.”',
            note: 'Liczby, które się nie zgadzają, to hiperbola w czystej postaci.',
          },
        ],
      },
      {
        heading: 'Sygnał 3: ton i mimika',
        paragraphs: [
          'W mowie: przeciągnięte samogłoski („świeeetnie”), płaski, beznamiętny ton, uniesiona brew, przewrócone oczy, ciężkie westchnienie przed zdaniem.',
          'W tekście tego wszystkiego nie ma. Zostają namiastki: „no super”, wielokropek, emotki 🙃 albo 🙄, w internecie oznaczenie „/s”. Badania nad e-mailami pokazują, że odbiorcy rozpoznają sarkazm w tekście niewiele lepiej niż rzutem monetą, choć nadawcy są przekonani, że wszystko jest jasne.',
        ],
        tip: 'W wiadomościach tekstowych zakładaj, że połowa twojego sarkazmu zostanie odczytana dosłownie.',
      },
      {
        heading: 'Sygnał 4: słowa-klucze',
        paragraphs: [
          'Polszczyzna ma swoje ulubione otwieracze sarkazmu: „no” na początku zdania („no pięknie”, „no dzięki”), „oczywiście”, „jasne”, „ależ”, „genialnie”, „no bo przecież”. Same w sobie nie przesądzają, ale w połączeniu z rozdźwiękiem sytuacyjnym są niemal pewne.',
        ],
        examples: [
          { text: '„Dzięki za pomoc.”', note: 'Neutralne, najpewniej szczere.' },
          { text: '„No dzięki za pomoc.”', note: 'Jedno „no” i zdanie zmienia znak.' },
        ],
      },
      {
        heading: 'Sygnał 5: kontrast rejestru',
        paragraphs: [
          'Nadmiernie uprzejme, oficjalne słowa w sytuacji, która na to nie zasługuje. „Bardzo dziękuję za tę niezwykle cenną uwagę” w odpowiedzi na wytknięcie literówki. Im bardziej wyszukana forma, tym wyraźniejszy sarkazm.',
        ],
      },
    ],
    takeaways: [
      'Najpierw patrz na sytuację, dopiero potem na słowa.',
      'Przesada i liczby, które się nie zgadzają, to znak ostrzegawczy.',
      'Ton zdradza sarkazm w mowie; w tekście łatwo go zgubić.',
      '„No” na początku zdania potrafi odwrócić jego sens.',
    ],
  },
  {
    id: 'rodzaje',
    title: 'Rodzaje sarkazmu',
    intro:
      'Nie każdy sarkazm brzmi tak samo. Ten sam mechanizm (mówię odwrotnie, niż myślę) może być czuły, kamienny, przesłodzony albo jadowity. Warto wiedzieć, którego używasz i który cię właśnie trafił.',
    sections: [
      {
        heading: 'Autoironiczny',
        paragraphs: [
          'Celem jesteś ty sam. „Jasne, ja i punktualność, najlepsi przyjaciele.” To najbezpieczniejszy rodzaj: nikogo nie rani, rozładowuje napięcie i pokazuje dystans do siebie. Idealny na start w nowej grupie.',
        ],
      },
      {
        heading: 'Beznamiętny (deadpan)',
        paragraphs: [
          'Wypowiedziany z kamienną twarzą, płaskim tonem, bez żadnego mrugnięcia. „Tak. Jestem zachwycony.” Najtrudniejszy do wyłapania, bo brak sygnałów tonalnych. Przez telefon i w tekście praktycznie nie do odróżnienia od powagi.',
        ],
      },
      {
        heading: 'Przesłodzony',
        paragraphs: [
          'Ociekający uprzejmością i czułością, aż do mdłości. „Kochanie, to takie urocze, że znowu zostawiłeś naczynia, uwielbiam je myć.” Im słodsze słowa, tym więcej pod nimi kwasu.',
        ],
      },
      {
        heading: 'Złośliwy',
        paragraphs: [
          'Wymierzony w konkretną osobę, żeby ją obniżyć. „Brawo, geniuszu. Nobel czeka.” Najbardziej ryzykowny: łatwo przekracza granicę między żartem a upokorzeniem. Działa tylko między ludźmi, którzy naprawdę się lubią i wiedzą, że to gra.',
        ],
      },
      {
        heading: 'Ponury (z pretensją)',
        paragraphs: [
          'Sarkazm, pod którym siedzi prawdziwy żal. „Nie, spoko, ja zostanę po godzinach. Jak zawsze.” To często pasywna agresja w przebraniu: zamiast powiedzieć, co boli, mówi się to naokoło.',
        ],
        tip: 'Jeśli łapiesz się na ponurym sarkazmie, zwykle lepiej powiedzieć rzecz wprost.',
      },
      {
        heading: 'Entuzjastyczny (maniakalny)',
        paragraphs: [
          'Przesadny zachwyt, który sam się demaskuje. „TAK! KOLEJNE SPOTKANIE! MOJE ULUBIONE!” Łatwy do rozpoznania, bo nikt nie cieszy się tak bardzo z ankiety satysfakcji.',
        ],
      },
    ],
    takeaways: [
      'Autoironia jest najbezpieczniejsza, złośliwość najbardziej ryzykowna.',
      'Beznamiętny sarkazm ginie w tekście i przez telefon.',
      'Ponury sarkazm to często pretensja, którą lepiej wypowiedzieć wprost.',
    ],
  },
  {
    id: 'riposta',
    title: 'Budowanie riposty',
    intro:
      'Dobra sarkastyczna odpowiedź jest krótka, pewna i celuje w sytuację, nie w człowieka. Oto kilka sprawdzonych technik i zasady, które odróżniają ripostę od obrazy.',
    sections: [
      {
        heading: 'Technika 1: przesadna pochwała',
        paragraphs: [
          'Chwal to, co ewidentnie jest złe, i dodaj jeden szczegół, który wszystko demaskuje. „Genialny plan. Co może pójść nie tak?”',
        ],
      },
      {
        heading: 'Technika 2: zgoda doprowadzona do absurdu',
        paragraphs: [
          'Przytaknij i pociągnij pomysł o krok dalej, aż sam się ośmieszy. „Jasne, dodajmy jeszcze trzy funkcje przed piątkiem. I przy okazji przepiszmy całość od zera.”',
        ],
      },
      {
        heading: 'Technika 3: fałszywe zaskoczenie',
        paragraphs: [
          'Udawaj, że coś przewidywalnego cię zdumiało. „Co?! Spóźniłeś się?! To zupełnie do ciebie niepodobne.”',
        ],
      },
      {
        heading: 'Technika 4: niedopowiedzenie',
        paragraphs: [
          'Odwrotność hiperboli: opisz katastrofę jak drobiazg. Serwer padł, cała firma stoi: „Mamy mały problem.” Działa najlepiej z kamienną twarzą.',
        ],
      },
      {
        heading: 'Technika 5: dosłowność',
        paragraphs: [
          'Weź czyjeś słowa dokładnie tak, jak zostały powiedziane. „Wyślę to do końca dnia.” (mówione od tygodnia) „Jasne. Którego?”',
        ],
      },
      {
        heading: 'Zasady dobrej riposty',
        paragraphs: [
          'Krótko. Jedno zdanie bije na głowę trzy. Riposta, którą trzeba dokończyć, już przegrała.',
          'Nie tłumacz żartu. „Mówię to ironicznie, bo…” zabija sarkazm na miejscu. Jeśli trzeba tłumaczyć, to nie był dobry moment.',
          'Jedna riposta, nie seria. Ciąg sarkastycznych zdań przestaje być żartem, a zaczyna być kłótnią.',
          'Celuj w sytuację, nie w osobę. „Drukarka dziś wybrała przemoc” to żart, z którego wszyscy się śmieją. „Ty nawet drukarki nie ogarniasz” to obraza z sarkastyczną nakładką.',
          'Ton pewny. Sarkazm powiedziany niepewnie brzmi jak pomyłka.',
        ],
        tip: 'Obraza z uśmiechem to nadal obraza. Sarkazm ma śmieszyć, nie ranić.',
      },
    ],
    takeaways: [
      'Pięć technik: przesadna pochwała, absurdalna zgoda, fałszywe zaskoczenie, niedopowiedzenie, dosłowność.',
      'Krótko, pewnie, bez tłumaczenia.',
      'Jedna riposta na sytuację. Seria to już kłótnia.',
      'Cel: sytuacja, nie człowiek.',
    ],
  },
  {
    id: 'kiedy',
    title: 'Kiedy (nie) używać sarkazmu',
    intro:
      'Sarkazm to sól: szczypta poprawia smak, garść psuje danie. Najlepsi sarkaści nie są najbardziej sarkastyczni. Są najlepsi w wyczuwaniu, kiedy przestać.',
    sections: [
      {
        heading: 'Zielone światło',
        paragraphs: [
          'Bliscy znajomi, którzy znają twój styl. Sytuacje o niskiej stawce: zepsuta drukarka, słaby film, długie spotkanie. Cel: absurd sytuacji, nie konkretny człowiek. Wspólny „kod”: gdy wiesz, że druga strona się zaśmieje razem z tobą, a nie zostanie wyśmiana.',
        ],
      },
      {
        heading: 'Żółte światło',
        paragraphs: [
          'Praca: zależy od kultury zespołu. Testuj ostrożnie, zaczynając od autoironii. Nowe znajomości: nie wiesz jeszcze, jak ktoś czyta ton. Różnice kulturowe: w niektórych kręgach kulturowych i językach komunikacja jest bardziej dosłowna i sarkazm brzmi po prostu jak nieuprzejmość. Tekst: brak tonu, brak mimiki, ryzyko nieporozumienia rośnie dwukrotnie.',
        ],
      },
      {
        heading: 'Czerwone światło',
        paragraphs: [
          'Ktoś przeżywa trudny moment: choroba, strata, zwolnienie. Informacja zwrotna dla kogoś, kto od ciebie zależy (stażysta, podwładny, uczeń): sarkazm zamiast jasnego komunikatu uczy tylko lęku. Małe dzieci: do mniej więcej 8–10 roku życia często rozumieją sarkazm dosłownie. Osoby, które mogą odbierać język dosłownie, w tym część osób w spektrum autyzmu. Formalne pisma i wiadomości do ludzi, którzy cię nie znają.',
        ],
      },
      {
        heading: 'Sarkazm zamiast rozmowy',
        paragraphs: [
          'Najczęstsze nadużycie: sarkazm jako zastępnik szczerej rozmowy. „Nie, nie, w porządku, sam pozmywam, jak zawsze.” To pasywna agresja. Druga strona słyszy pretensję, ale nie wie, o co dokładnie chodzi, i nie może na nią odpowiedzieć.',
          'Jeśli masz pretensję, powiedz ją wprost. Sarkazm zostaw na sytuacje, w których naprawdę chcesz rozśmieszyć.',
        ],
      },
      {
        heading: 'Gdy sarkazm nie wypalił',
        paragraphs: [
          'Zdarzy się każdemu. Nie tłumacz żartu w nieskończoność, nie dorzucaj kolejnego i nie udawaj, że nic się nie stało. Jedno zdanie: „Żartowałem, przepraszam, zabrzmiało gorzej, niż chciałem.” I idziesz dalej.',
        ],
        tip: 'Test wspólnego śmiechu: czy ta osoba zaśmieje się razem ze mną, czy zostanie wyśmiana? Tylko pierwsza opcja to dobry sarkazm.',
      },
    ],
    takeaways: [
      'Zielone: bliscy, niska stawka, cel w sytuacji.',
      'Czerwone: kryzys, feedback dla zależnych, małe dzieci, obcy, formalne pisma.',
      'Sarkazm nie zastępuje szczerej rozmowy.',
      'Gdy nie wypali: jedno zdanie przeprosin i dalej.',
    ],
  },
];

export const lessonsById: Record<string, Lesson> = Object.fromEntries(lessons.map((l) => [l.id, l]));
