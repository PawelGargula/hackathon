# 06 — Hackathon playbook (48h)

Operacyjny plan na oba dni hackathonu — timeline, role, prezentacja, ryzyka.

> Powiązane: wszystkie pozostałe specyfikacje. Zacznij od [README.md](./README.md).

## Zespół i role (propozycja startowa)

Doprecyzujcie imiona i role w sobotę rano po podziale zadań.

| Rola                | Odpowiedzialność                                              | Osoba  |
| ------------------- | ------------------------------------------------------------- | ------ |
| **Dev lead**        | Next.js, Prisma, Auth.js, deploy Vercel, migracje             | _TODO_ |
| **Product / UX**    | Flow użytkownika, copy, UI (Tailwind), slajdy                 | _TODO_ |
| **Research / demo** | Dane regionu, seed data, scenariusz demo, QR, nagranie backup | _TODO_ |

**Zasady współpracy:**

- Co 2–3h krótki sync (5 min): co zrobione, co blokuje, co ciąć
- Push na GitHub minimum co kilka godzin — backup i historia
- Jedna osoba „ownuje" deploy (Dev lead)
- Jedna osoba „ownuje" prezentację (Product/UX)

---

## Dzień I — sobota 30.05

| Godzina         | Co robimy                                                 | Output                                |
| --------------- | --------------------------------------------------------- | ------------------------------------- |
| **08:00–09:00** | Rejestracja, kawa, networking                             | Kontakt z mentorem (luźny)            |
| **09:00–10:00** | **Brief organizatora** — wysłuchaj ścieżek, zadaj pytania | Decyzja: transport czy zmiana ścieżki |
| **10:00–10:30** | Burza mózgów → wybór pomysłu → konsultacja mentora        | Zamrożony pomysł, podział ról         |
| **10:30–11:00** | Setup: repo, env, schemat Prisma v0, pierwszy commit      | `npm run dev` działa u wszystkich     |
| **11:00–13:30** | Core dev: auth + główny ekran + modele DB                 | Logowanie Google OK, szkielet UI      |
| **13:30–14:15** | **Obiad + sync**                                          | Co działa? Co ciąć z scope?           |
| **14:15–17:00** | Feature complete MVP + seed data                          | Główny flow end-to-end                |
| **17:00–17:30** | **Pierwszy deploy produkcyjny**                           | Live URL, OAuth na Vercel             |
| **17:30–18:00** | Retrospekta dnia, plan niedzieli                          | Lista: polish, bugfixy, slajdy        |

### Checkpointy soboty (must-have)

- [ ] 10:30 — pomysł zamrożony, mentor skonsultowany
- [ ] 14:00 — scope lock (brak nowych feature'ów bez dyskusji)
- [ ] 17:30 — deploy live, logowanie działa
- [ ] 18:00 — wszyscy wiedzą, kto co robi w niedzielę

---

## Dzień II — niedziela 31.05

| Godzina         | Co robimy                                                  | Output                                     |
| --------------- | ---------------------------------------------------------- | ------------------------------------------ |
| **08:30–09:00** | Kawa, krótki sync                                          | Priorytety dnia                            |
| **09:00–11:30** | Bugfixy, polish UI, uzupełnienie seed, stabilizacja deploy | Stabilna aplikacja                         |
| **11:30**       | **Feature freeze**                                         | Koniec nowych funkcji                      |
| **09:00–12:15** | Równolegle: slajdy + scenariusz demo + nagranie backup     | Prezentacja v1                             |
| **12:15–13:00** | **Obiad + próba sucha** (bez mentora)                      | Timing **3:00** (regulamin §3)             |
| **13:00–14:30** | Slajdy final, QR, trening Q&A, konsultacja mentora         | Pitch 2:45–3:00 + odpowiedzi na pytania    |
| **14:30–15:00** | Próba generalna, otwarcie app przed demo                   | Gotowość                                   |
| **15:00–17:00** | **FINAŁ — prezentacje**                                    | —                                          |
| **17:00+**      | Networking, ewentualne czyszczenie laptopa                 | [03-laptop-setup.md](./03-laptop-setup.md) |

### Checkpointy niedzieli (must-have)

- [ ] 11:30 — feature freeze
- [ ] 12:00 — nagranie backup demo (30–60 s)
- [ ] 13:30 — QR na slajdzie z aktualnym URL
- [ ] 14:00 — pitch mieści się w **2:45–3:00** (timer!)
- [ ] 14:30 — próba generalna z timerem 3:00 + symulacja Q&A 3 min
- [ ] 14:55 — otwarcie app w przeglądarce (warm-up)

---

## Prezentacja finałowa

> **Regulamin §3:** max **3 minuty** prezentacji + **3 minuty** na pytania jury. Brak udziału = brak oceny.

### Format 3-minutowego pitcha

| Segment                | Czas  | Treść                                                                  |
| ---------------------- | ----- | ---------------------------------------------------------------------- |
| **Problem**            | ~30 s | Dla kogo, jaki ból w regionie, dopasowanie do wyzwania                 |
| **Rozwiązanie + demo** | ~90 s | Co zbudowaliście, live demo lub QR — **nie próbujcie obu na max czas** |
| **Wpływ + next step**  | ~30 s | Wpływ społeczny/środowiskowy, co dalej                                 |

Przygotujcie też **wersję 2-minutową** (backup gdy pitch się rozleje).

### Slajdy — max 4–5 slajdów

1. Tytuł + zespół
2. Problem (konkretny, lokalny)
3. Rozwiązanie + screenshot
4. Demo (**QR code** + URL) — slajd widoczny podczas demo
5. Wpływ na region (opcjonalnie, jeśli mieści się w 3 min)

**Tip:** przy 3 minutach jury ocenia głównie to, co **pokażecie i powiecie** — prototyp i pitch liczą się w kryterium „Zespół i realizacja" (10 pkt).

### Mapowanie pitcha na kryteria jury

| Kryterium jury (§3)              | Co powiedzieć / pokazać w pitchu                                                                   |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Trafność i wartość** (10 pkt)  | Konkretny problem regionu; dlaczego wasze rozwiązanie pasuje do wyzwania transportu; kto skorzysta |
| **Innowacyjność** (10 pkt)       | Co jest nowe vs istniejące rozwiązania (Jakdojade, Blablacar…); jakie technologie użyliście        |
| **Zespół i realizacja** (10 pkt) | Live demo / QR; jakość prototypu; płynność prezentacji; kto co robił (krótko)                      |

### Q&A — 3 minuty

Przygotujcie odpowiedzi na typowe pytania:

- Skąd dane? (seed vs API — bądźcie uczciwi)
- Czy da się to wdrożyć w regionie? (model, partnerzy)
- Co byście zrobili z 3 miesiącami więcej?
- Jak wyróżniacie się od konkurencji?

### Scenariusz demo (przygotujcie na piśmie — max ~90 s)

```
1. Otwórz landing → pokaż value prop
2. Kliknij "Zaloguj przez Google" → zaloguj
3. [Główna akcja MVP — np. dodaj przejazd / zaplanuj trasę]
4. Pokaż wynik → "To realna aplikacja, możecie zeskanować QR"
5. (Opcjonalnie) pokaż widok mobile
```

Przećwiczcie **minimum 5 razy z timerem 3:00**. Ustalcie kto klika, kto mówi.

---

## Ryzyka i mitygacja

| Ryzyko                   | Prawdopod.    | Mitygacja                                                    |
| ------------------------ | ------------- | ------------------------------------------------------------ |
| **Pitch za długi**       | Wysoka        | Timer przy każdej próbie; wersja 2-min backup; mniej slajdów |
| Scope creep              | Wysoka        | Scope lock sobota 14:00; feature freeze niedziela 11:30      |
| OAuth nie działa na demo | Średnia       | Test na Vercel sobota; backup nagranie                       |
| Padło Wi-Fi              | Niska–średnia | Hotspot; nagranie; screenshoty na slajdach                   |
| Jeden dev, reszta czeka  | Średnia       | Product robi slajdy/seed; Research robi dane                 |
| Za mało snu              | Wysoka        | Priorytetyzuj MVP w sobotę; niedziela polish, nie rewrite    |
| Spór o pomysł w zespole  | Średnia       | Decyzja do 10:30 z mentorem jako tie-breaker                 |
| Laptop / env problem     | Średnia       | Setup przed hackathonem; `.env.example`; push często         |

---

## Komunikacja w zespole

- **Kanał:** ustalcie na start (WhatsApp / Discord / Slack)
- **Sync points:** 10:30, 14:00 (obiad), 17:30, 09:00 niedziela, 12:00, 14:30
- **Blokery:** zgłaszaj natychmiast, nie czekaj na sync
- **Decyzje:** dev lead = technika; product = scope UX; demokracja na zmianę pomysłu (ale tylko do 10:30)

---

## Co spakować / mieć pod ręką

- [ ] Laptop + ładowarka
- [ ] Hotspot (telefon z pakietem danych)
- [ ] Mysz (opcjonalnie — wygodniej niż touchpad)
- [ ] Powerbank
- [ ] Notatnik / kartki na burzę mózgów
- [ ] Linki: repo, Vercel, Supabase, Google Console (zakładki w przeglądarce)

---

## TODO / do rozbudowy

- [ ] Imiona i przypisane role w tabeli
- [ ] Szablon slajdów (Google Slides / PowerPoint / Canva)
- [ ] Scenariusz demo — wersja finalna po wyborze pomysłu
- [ ] Notatki po konsultacji z mentorem (sobota i niedziela)
- [ ] Debrief po hackathonie — co poszło dobrze, co poprawić
