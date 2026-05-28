# 08 — JedźMY Sądeckie: specyfikacja projektu

Specyfikacja koncepcji i MVP projektu hackathonowego dla sciezki **Dostepny transport dla kazdego**.

> Powiazane: [01-hackathon-context.md](./01-hackathon-context.md), [02-project-idea.md](./02-project-idea.md), [05-tech-stack.md](./05-tech-stack.md), [06-hackathon-playbook.md](./06-hackathon-playbook.md)

## Esencja projektu

**JedźMY Sądeckie** to webowa aplikacja pomagajaca mieszkankom i mieszkancom subregionu nowosadeckiego zaplanowac podroz wtedy, gdy tradycyjny transport publiczny jest rzadki, nieczytelny albo nie odpowiada realnym potrzebom.

Produkt laczy trzy perspektywy:

- **mieszkaniec** chce dostac sie do szkoly, pracy, lekarza, urzedu, wydarzenia lub atrakcji bez wlasnego auta,
- **lokalna spolecznosc** moze uzupelniac luki przez wspoldzielenie przejazdow,
- **samorzad** dostaje dane o miejscach i godzinach, w ktorych najczesciej brakuje polaczen.

Jednozdaniowa propozycja wartosci:

> Lokalny asystent mobilnosci, ktory pokazuje najlepsza dostepna trase, a gdy jej nie ma, pozwala zglosic realna potrzebe przejazdu i zamienia pojedyncze problemy mieszkancow w dane przydatne dla gminy.

## Wyzwanie hackathonowe

Projekt odpowiada na wyzwanie **Dostepny transport dla kazdego**:

- przeciwdzialanie wykluczeniu transportowemu,
- projektowanie dostepnego i przyjaznego transportu,
- wsparcie mobilnosci seniorow i mlodziezy,
- uzupelnianie luk w tradycyjnej siatce polaczen,
- planowanie podrozy regionalnych z wykorzystaniem wielu srodkow transportu.

Projekt ma tez element zielonej transformacji: promuje transport publiczny, wspoldzielony i multimodalny zamiast indywidualnych przejazdow autem.

## Problemy, ktore rozwiazujemy

### 1. Brak realnej alternatywy dla auta

W mniejszych miejscowosciach autobus moze kursowac rzadko, tylko w dni szkolne albo tylko w godzinach porannych. Dla osoby bez samochodu kilka kilometrow do miasta staje sie bariera w dostepie do edukacji, pracy, zdrowia i kultury.

### 2. Trudne planowanie podrozy regionalnych

Informacje o busach, kolei, przesiadkach, dojsciach pieszych i lokalnych przewoznikach bywaja rozproszone. Uzytkownik nie chce analizowac kilku stron i rozkladow, tylko potrzebuje odpowiedzi: "jak najlepiej tam dojade?".

### 3. Wykluczenie seniorow i osob mniej cyfrowych

Standardowe aplikacje transportowe czesto zakladaja sprawnosc cyfrowa, mala czcionke i szybka obsluge. Seniorzy potrzebuja prostego, spokojnego interfejsu, jasnych komunikatow i opcji poproszenia o pomoc.

### 4. Brak danych o lukach transportowych

Samorzad widzi rozklady jazdy, ale nie zawsze widzi niezaspokojone potrzeby: kto chcial jechac, skad, dokad i o ktorej godzinie, ale nie znalazl polaczenia. Bez tych danych trudno planowac pilotaż transportu na zadanie albo korekty siatki polaczen.

### 5. Niski poziom wspoldzielenia lokalnych przejazdow

Wiele osob codziennie jedzie autem do Nowego Sacza, Limanowej, Grybowa czy Krynicy-Zdroju, ale wolne miejsca w autach nie sa wykorzystywane systemowo. Lokalny carpooling moze uzupelnic transport publiczny, szczegolnie na ostatnim odcinku trasy.

## Grupy odbiorcow

### Mieszkancy bez auta

Osoby, ktore potrzebuja dotrzec do pracy, szkoly, lekarza, urzedu, sklepu lub na wydarzenie, ale nie maja wygodnego polaczenia publicznego.

### Mlodziez

Uczniowie i studenci dojezdzajacy do szkol, uczelni, praktyk, pracy dorywczej, zajec dodatkowych i wydarzen.

### Seniorzy

Osoby starsze, ktore chca zachowac samodzielnosc, ale potrzebuja prostego planowania podrozy i wiekszego poczucia bezpieczenstwa.

### Kierowcy lokalni

Mieszkancy, ktorzy i tak pokonuja dana trase i moga zabrac kogos po drodze, np. do miasta, przychodni, pracy lub na wydarzenie.

### Samorzady i instytucje publiczne

Gminy, powiat, jednostki transportowe i instytucje lokalne, ktore chca lepiej rozumiec popyt na mobilnosc oraz testowac elastyczne modele transportu.

## Jak to ma dzialac

### Flow 1: planowanie podrozy

1. Uzytkownik wpisuje miejsce startu, cel i preferowana godzine.
2. System sprawdza dostepne opcje w danych demonstracyjnych:
   - autobus,
   - kolej,
   - dojscie piesze,
   - rower,
   - przejazd wspoldzielony,
   - kombinacje powyzszych.
3. Uzytkownik widzi 2-3 propozycje tras, np.:
   - najszybsza,
   - najmniej przesiadek,
   - najbardziej dostepna dla seniora.
4. Kazda trasa pokazuje czas, etapy, orientacyjny koszt, poziom trudnosci i szacunkowa oszczednosc emisji CO2 wzgledem auta.
5. Uzytkownik moze zapisac trase albo wyslac prosbe o przypomnienie.

### Flow 2: brak dobrego polaczenia

1. System nie znajduje sensownej trasy albo trasa jest zbyt dluga.
2. Aplikacja pokazuje komunikat: "Nie znalezlismy wygodnego polaczenia. Mozesz zglosic potrzebe przejazdu".
3. Uzytkownik potwierdza trase, date, godzine i powod przejazdu, np. lekarz, szkola, praca, urzad, wydarzenie.
4. Zgloszenie trafia do panelu potrzeb transportowych.
5. Uzytkownik dostaje informacje, ze jego zgloszenie pomoze wskazac miejsca z najwiekszymi lukami transportowymi.

### Flow 3: przejazd wspoldzielony

1. Kierowca dodaje przejazd: skad, dokad, kiedy, liczba miejsc, ewentualny punkt odbioru.
2. Pasażer widzi przejazd jako jedna z opcji w planowaniu trasy.
3. Pasażer wysyla prosbe o miejsce.
4. W MVP status moze byc uproszczony: "oczekuje", "zaakceptowane", "odrzucone".
5. W pitchu podkreslamy, ze pelna wersja wymagalaby zasad bezpieczenstwa, weryfikacji i regulaminu.

### Flow 4: tryb seniora

1. Uzytkownik wybiera tryb "Prosty widok".
2. Interfejs pokazuje duze przyciski:
   - "Chce jechac do lekarza",
   - "Chce jechac do urzedu",
   - "Chce jechac do rodziny",
   - "Inny cel".
3. Formularz ogranicza liczbe pol i prowadzi krok po kroku.
4. Wynik pokazuje jedna rekomendowana trase i przycisk "Popros o pomoc".
5. W MVP przycisk moze prowadzic do ekranu z numerem kontaktowym lub fikcyjnym lokalnym punktem wsparcia.

### Flow 5: panel dla samorzadu

1. Przedstawiciel gminy widzi liste zgloszonych potrzeb.
2. Panel pokazuje najczestsze kierunki, godziny i miejscowosci bez dobrych polaczen.
3. System grupuje podobne zgloszenia, np. "Tymbark -> Nowy Sacz, dni robocze, 7:00-8:00".
4. Panel wskazuje potencjalne rekomendacje:
   - uruchomic kurs testowy,
   - dogadac przewoznika,
   - promowac carpooling na danej trasie,
   - dodac punkt przesiadkowy.

## Zakres MVP na hackathon

### W scope

- Landing page z jasnym problemem, rozwiazaniem i CTA do aplikacji.
- Formularz planowania podrozy.
- Seedowane dane miejscowosci, przystankow, tras, przejazdow i zgloszen.
- Ekran wynikow z porownaniem kilku tras.
- Scenariusz "brak polaczenia" i zgloszenie potrzeby transportowej.
- Prosty tryb seniora.
- Lista przejazdow wspoldzielonych.
- Mini panel samorzadowy z agregacja potrzeb.
- Demo live na Vercel i awaryjny scenariusz lokalny.

### Poza scope na hackathon

- Prawdziwa integracja z rozkladami przewoznikow.
- Platnosci i rozliczenia przejazdow.
- Weryfikacja tozsamosci kierowcow i pasazerow.
- Natywna aplikacja mobilna.
- Produkcyjna geolokalizacja i routing drogowy.
- Powiadomienia SMS.
- Pelny regulamin carpoolingu.

Te elementy warto opisac w pitchu jako kierunek rozwoju, nie obiecywac ich jako gotowego produktu.

## Dane demonstracyjne

Na potrzeby MVP wystarcza kontrolowane dane, ktore dobrze pokazuja problem:

- miejscowosci: Nowy Sacz, Stary Sacz, Grybow, Krynica-Zdroj, Piwniczna-Zdroj, Limanowa, Tymbark, Lacko, Chełmiec,
- punkty celu: szpital, urzad, szkola, dworzec, rynek, centrum kultury, atrakcja turystyczna,
- kilka kursow autobusowych i kolejowych,
- kilka przejazdow wspoldzielonych,
- kilka tras, dla ktorych system celowo nie znajduje dobrego polaczenia,
- kilkanascie historycznych zgloszen potrzeb transportowych do panelu samorzadowego.

Wazne: podczas prezentacji nalezy jasno powiedziec, ze sa to dane demonstracyjne do proof of concept.

## Kluczowe ekrany

1. **Landing page** - "Odleglosc nie powinna wykluczac".
2. **Planer podrozy** - formularz skad/dokad/kiedy.
3. **Wyniki tras** - porownanie opcji, czas, przesiadki, CO2, dostepnosc.
4. **Brak polaczenia** - zgloszenie potrzeby przejazdu.
5. **Tryb seniora** - uproszczony flow z duzymi przyciskami.
6. **Przejazdy wspoldzielone** - lista ofert i prosba o miejsce.
7. **Panel samorzadu** - heatmapa/lista luk transportowych i rekomendacje.

## Priorytety produktowe

### Must have

- Uzytkownik moze zaplanowac podroz na danych demo.
- Uzytkownik widzi sensowny wynik trasy.
- Uzytkownik moze zglosic brak polaczenia.
- Panel samorzadu pokazuje zebrane potrzeby.
- Calosc da sie pokazac w 3-minutowym pitchu.

### Should have

- Tryb seniora.
- Lista przejazdow wspoldzielonych.
- Proste oznaczenie emisji CO2.
- Ranking miejscowosci z najwieksza liczba zgloszen.

### Could have

- Mapa z punktami i trasami.
- Filtrowanie po celu podrozy.
- Widok "najbardziej dostepna trasa".
- Generator rekomendacji dla gminy.

### Won't have w MVP

- Prawdziwe konta kierowcow i pasazerow.
- Chat miedzy uzytkownikami.
- Integracje z operatorami transportu.
- Produkcyjne dane osobowe.

## Jak wyroznic projekt

Najwieksza przewaga nad zwyklym planerem trasy: aplikacja nie konczy pracy komunikatem "brak polaczenia". Wlasnie ten brak staje sie wartoscia - system zbiera go jako sygnal dla samorzadu.

Najwieksza przewaga nad klasycznym carpoolingiem: projekt jest lokalny, nastawiony na potrzeby publiczne i dostepnosc, a nie tylko okazjonalne przejazdy miedzymiastowe.

Najwieksza przewaga w pitchu: mozna pokazac dwie strony tej samej historii:

- pani Maria chce jechac z mniejszej miejscowosci do lekarza,
- gmina widzi, ze podobnych potrzeb jest 37 w miesiacu na tej samej trasie.

## Metryki sukcesu

W produkcyjnej wersji warto mierzyc:

- liczbe zaplanowanych podrozy,
- liczbe tras bez dobrego polaczenia,
- najczestsze kierunki zgloszen,
- godziny z najwiekszym niezaspokojonym popytem,
- liczbe przejazdow wspoldzielonych,
- szacowana redukcje przejazdow autem,
- liczbe mieszkancow korzystajacych z trybu seniora.

Na hackathonie wystarczy pokazac, jakie metryki panel moglby zbierac.

## Ryzyka i odpowiedzi

### "Przeciez istnieja Jakdojade i Google Maps"

Odpowiedz: te narzedzia dobrze dzialaja tam, gdzie dane transportowe sa kompletne i transport jest gesty. Nasz projekt skupia sie na lukach: gdy polaczenia nie ma, jest zbyt rzadkie albo nie odpowiada realnym potrzebom mieszkancow.

### "Carpooling wymaga zaufania i bezpieczenstwa"

Odpowiedz: zgoda. Dlatego w MVP pokazujemy model i wartosc spoleczna, a produkcyjnie konieczne bylyby weryfikacja, regulamin, oceny, moderacja i wspolpraca z samorzadem lub zaufanymi instytucjami.

### "Skad wezmiemy prawdziwe dane?"

Odpowiedz: MVP dziala na danych demonstracyjnych. Wdrozenie mozna zaczac od otwartych rozkladow, danych od przewoznikow, formularzy zgloszen mieszkancow i pilotażu w jednej gminie.

### "Czy seniorzy beda uzywac aplikacji?"

Odpowiedz: nie zakladamy, ze kazdy senior samodzielnie obsluzy aplikacje. Tryb prosty moze byc uzywany przez seniora, ale tez przez opiekuna, pracownika biblioteki, centrum aktywnosci, urzedu lub czlonka rodziny.

## Model wdrozenia po hackathonie

1. Pilotaż w jednej gminie lub na jednej trasie problemowej.
2. Zbieranie zgloszen potrzeb przez 4-8 tygodni.
3. Analiza najczestszych kierunkow i godzin.
4. Test kursu na zadanie, wspoldzielonego busa lub lokalnej akcji carpoolingu.
5. Rozszerzenie na kolejne gminy subregionu.

Potencjalni partnerzy:

- gminy i powiat,
- lokalni przewoznicy,
- szkoly i uczelnie,
- przychodnie i szpitale,
- biblioteki, domy kultury, kluby seniora,
- organizacje spoleczne.

## Pitch 30 sekund

W subregionie nowosadeckim brak auta czesto oznacza brak dostepu do lekarza, szkoly, pracy czy wydarzen. **JedźMY Sądeckie** to lokalny asystent mobilnosci: pokazuje najlepsza dostepna trase, laczy transport publiczny z przejazdami wspoldzielonymi, a gdy polaczenia nie ma - pozwala zglosic potrzebe. Dla mieszkanca to prostsza droga z punktu A do B. Dla gminy to mapa realnych luk transportowych, ktore mozna wykorzystac do lepszego planowania uslug.

## Pitch 3 minuty - struktura

1. **Problem** - historia konkretnej osoby, np. seniorki jadacej do lekarza.
2. **Skala** - wykluczenie transportowe dotyczy seniorow, mlodziezy i osob bez auta.
3. **Rozwiazanie** - pokazanie planera podrozy.
4. **Moment wartosci** - gdy nie ma polaczenia, system zbiera zgloszenie zamiast zostawiac uzytkownika bez odpowiedzi.
5. **Panel samorzadowy** - dane o lukach transportowych i rekomendacje.
6. **Wplyw** - dostepnosc, edukacja, praca, zdrowie, mniej przejazdow autem.
7. **Wdrozenie** - pilotaż w jednej gminie, potem skalowanie.

## Definicja gotowosci demo

Projekt jest gotowy do prezentacji, jezeli:

- landing page jasno tlumaczy problem i rozwiazanie,
- da sie przejsc jeden pelny scenariusz uzytkownika,
- da sie pokazac scenariusz braku polaczenia,
- panel samorzadowy ma przykladowe dane i czytelny wniosek,
- pitch miesci sie w 3 minutach,
- demo dziala z deployu lub lokalnego fallbacku.
