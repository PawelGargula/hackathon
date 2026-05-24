# 02 — Pomysł projektu

Jak wybrać i doprecyzować pomysł na hackathonie — od ścieżki tematycznej do zamrożonego MVP.

> Powiązane: [01-hackathon-context.md](./01-hackathon-context.md), [05-tech-stack.md](./05-tech-stack.md), [06-hackathon-playbook.md](./06-hackathon-playbook.md)

## Wasza sytuacja startowa

| Parametr                | Wartość                                         |
| ----------------------- | ----------------------------------------------- |
| Zespół                  | 3 osoby (+ ewentualnie dołożona osoba)          |
| Ścieżka przy zgłoszeniu | **Dostępny transport dla każdego**              |
| Wiążącość wyboru        | **Nie** — można zmienić po briefie / z mentorem |

> **Regulamin §2 pkt 15:** Uczestnik musi mieć pomysł wpisujący się w **jedno z wyzwań** opisanych na stronie wydarzenia. Przy zgłoszeniu wybraliśmy transport — finalny projekt musi do tego wyzwania (lub innego, jeśli zmienicie) jednoznacznie pasować.

## Proces wyboru pomysłu

```
Sobota 9:00  → Brief organizatora, prezentacja ścieżek
Sobota 9:30  → Burza mózgów w zespole (3 kierunki max)
Sobota 10:00 → Konsultacja z mentorem (15–20 min)
Sobota 10:30 → Zamrożenie pomysłu + scope MVP
Sobota ~14:00 → Scope lock — dalsze zmiany tylko jeśli krytyczne
```

**Zasada:** lepiej wąski, działający MVP niż szeroka wizja bez demo.

## Ramy MVP na 48h

Realistyczny MVP na hackathon:

- **1 główna funkcja** — to, co pokazujecie na demo
- **Landing page** — problem, rozwiązanie, CTA (logowanie / wejście w app)
- **1 flow użytkownika end-to-end** — np. zaloguj → wykonaj akcję → zobacz wynik
- **Dane demo (seed)** — sensowne przykłady, nie pusty ekran
- **Deploy live** — URL + QR na prezentacji

## Szablon pomysłu (do wypełnienia)

### Nazwa projektu

_TODO: np. „MobilniSącz", „RideShare Małopolska"_

### Ścieżka tematyczna

- [ ] Dostępny transport dla każdego ← start
- [ ] Czyste powietrze dla regionu
- [ ] Zostań, nie wyjeżdżaj
- [ ] Turystyka przyszłości

### Problem (dla kogo?)

_Kogo dotyczy problem w subregionie nowosądeckim / Małopolsce?_

_TODO: np. „Seniorzy w gminach wiejskich nie mają dostępu do transportu publicznego po 16:00..."_

### Propozycja wartości (1 zdanie)

_TODO: np. „Aplikacja łącząca seniorów z kierowcami jadącymi tą samą trasą do miasta."_

### Rozwiązanie (co budujemy?)

_TODO: web app / platforma / narzędzie — 2–3 zdania_

### Zakres MVP (w scope)

- [ ] _TODO_
- [ ] _TODO_
- [ ] _TODO_

### Poza scope (świadomie nie robimy)

- _TODO: np. płatności, aplikacja mobilna natywna, integracja z API MPK_

### Hipoteza do walidacji z mentorem

_TODO: np. „Czy carpooling ma sens w regionie z niską gęstością ludności?"_

### Elevator pitch (30 sekund)

_TODO: Problem → rozwiązanie → dla kogo → dlaczego teraz_

---

## Kierunki startowe — obszar transportu

Inspiracja z briefu organizatora. **To nie są wiążące propozycje** — wybierzcie jeden kierunek lub zmiksujcie elementy po rozmowie z mentorem.

### A. Planer podróży multimodalnych

**Problem:** Trudno zaplanować podróż regionem łącząc autobus, pociąg i rower.

**MVP:** Formularz trasy A→B → propozycja połączeń (nawet na seed data / statycznych danych) → zapis trasy po zalogowaniu.

**Plus:** Czytelny problem, łatwe demo, pasuje do briefu.
**Minus:** Bez prawdziwych API rozkładów — trzeba uczciwie powiedzieć jury, że to proof of concept.

### B. Carpooling / transport na żądanie

**Problem:** Luki w siatce połączeń — brak busów, odległe wsie.

**MVP:** Ogłoszenie przejazdu (skąd, dokąd, kiedy) → lista przejazdów → rezerwacja miejsca po zalogowaniu.

**Plus:** Silny social impact, dobrze wygląda na hackathonie społecznym.
**Minus:** Problem „pustej platformy" — seed z przykładowymi przejazdami obowiązkowy.

### C. Asystent mobilności dla seniorów

**Problem:** Seniorzy nie korzystają z transportu publicznego — skomplikowane rozkłady, brak informacji.

**MVP:** Uproszczony interfejs (duże przyciski) → wybór „Chcę jechać do..." → propozycja połączenia + numer telefonu do taksówki / lokalnego przewoźnika.

**Plus:** Wyróżnia się na tle „kolejnej appki dla młodych".
**Minus:** UX musi być naprawdę prosty — poświęć na to czas.

### D. Mapa barier transportowych

**Problem:** Nie wiadomo, gdzie brakuje przystanków, chodników, dostępności.

**MVP:** Mapa (np. Leaflet) → zgłoszenie problemu (pin + opis) → lista zgłoszeń → prosty ranking „najpilniejsze".

**Plus:** Dane od użytkowników, potencjał społeczny.
**Minus:** Mapa + geolokalizacja — upewnij się, że zdążycie w 48h.

---

## Co jury oceni w naszym pomyśle (§3)

Przy wyborze i doprecyzowaniu pomysłu myślcie przez pryzmat oficjalnych kryteriów:

1. **Trafność (10 pkt)** — Czy problem jest realny dla subregionu nowosądeckiego? Czy rozwiązanie pasuje do wyzwania transportowego?
2. **Innowacyjność (10 pkt)** — Czym różnimy się od Jakdojade, Blablacar, lokalnych przewoźników? Co nowego w technologii lub podejściu?
3. **Realizacja (10 pkt)** — Czy zdążymy z działającym prototypem? Czy pitch 3-min będzie przekonujący?

Szczegóły kryteriów: [01-hackathon-context.md](./01-hackathon-context.md)

## Kryteria wyboru pomysłu (w zespole)

Przed zamrożeniem scope oceńcie każdy kierunek (1–5):

| Kryterium wewnętrzne                             | Waga    | Mapowanie na jury (§3) |
| ------------------------------------------------ | ------- | ---------------------- |
| Czy da się zrobić działające demo w 48h?         | Wysoka  | Zespół i realizacja    |
| Czy pasuje do wyzwania transportowego?           | Wysoka  | Trafność i wartość     |
| Czy zespół ma kompetencje (dev + UX + research)? | Wysoka  | Zespół i realizacja    |
| Czy wyróżni się vs istniejące rozwiązania?       | Średnia | Innowacyjność          |
| Czy mentor/jury zobaczą realny wpływ na region?  | Wysoka  | Trafność i wartość     |

---

## TODO / do rozbudowy

- [ ] Finalny wybór pomysłu (po briefie 30.05)
- [ ] Nazwa projektu i domena brandingowa (tylko nazwa — bez kupowania domeny)
- [ ] Elevator pitch — wersja finalna
- [ ] Schemat Prisma dopasowany do pomysłu → [05-tech-stack.md](./05-tech-stack.md)
- [ ] Research: dane o transporcie w subregionie nowosądeckim (do sekcji „Problem")
- [ ] Analiza konkurencji (Blablacar, Jakdojade, local apps) — 3 bullet points
