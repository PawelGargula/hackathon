# 07 — Smoke test laptopa (~30 min)

Dress rehearsal na **pożyczonym laptopie** — symulacja tego, co zrobicie w hotelu w sobotę rano. Template budujecie na PC; na lapku **tylko weryfikujecie**, że cały łańcuch działa.

> **Kiedy:** pierwszy raz gdy macie laptop (najlepiej do ~27.05), powtórka **29.05 wieczorem** (~10 min).
>
> **Kto:** dev lead (osoba, która robi deploy w weekend). Reszta zespołu może później zrobić własny krótszy test (`clone` + `npm run dev`).
>
> Powiązane: [03-laptop-setup.md](./03-laptop-setup.md), [04-deployment-demo.md](./04-deployment-demo.md), [05-tech-stack.md](./05-tech-stack.md)

## Strategia: PC vs laptop

| Gdzie                 | Co                                                     |
| --------------------- | ------------------------------------------------------ |
| **PC (teraz)**        | Template, repo, Vercel/Supabase/OAuth, pierwszy deploy |
| **GitHub**            | Jedno repo — most między maszynami                     |
| **Laptop (ten test)** | Pełna weryfikacja środowiska hackathonowego            |
| **Laptop (30–31.05)** | Pomysł, MVP, feature’y — **nie** setup od zera         |

---

## Wymagania wstępne (zanim zaczniesz timer)

Upewnij się, że **na PC** już istnieje:

- [ ] Repo na GitHub z template’em (Next.js 16 + Tailwind v4 + Auth.js v5 + Prisma 7 + shadcn/ui)
- [ ] Projekt Vercel podpięty do repo
- [ ] Projekt Supabase + `DATABASE_URL` (pooled) i `DIRECT_URL` (direct)
- [ ] Google OAuth Client ID z redirect URI na localhost **i** Vercel
- [ ] `.env.example` w repo (bez secretów)
- [ ] Co najmniej jeden udany deploy produkcyjny z PC

Na laptopie **przed startem timera**:

- [ ] Zalogowany na konto Windows `Hackathon` (lub profil przeglądarki „Hackathon”)
- [ ] Zainstalowane: Git, Node.js LTS (ta sama wersja co na PC), Cursor, Chrome/Edge
- [ ] Plik `.env.local` przygotowany (skopiuj z `.env.example`, wklej wartości z menedżera haseł — **nie** z repo)

### Szybka weryfikacja narzędzi (~2 min, przed timerem)

```powershell
git --version
node --version    # oczekiwane: v20.x lub v22.x — jak na PC
npm --version
git config user.name
git config user.email
```

---

## Smoke test — 30 minut (krok po kroku)

**Zasada:** każdy krok ma checkbox **OK** / **FAIL**. Przy **FAIL** — zatrzymaj timer, napraw, uruchom test od początku sekcji.

### Faza 1 — Repo i dev lokalny (0–10 min)

| ☐   | Min  | Krok                                                                               | Oczekiwany wynik                       |
| --- | ---- | ---------------------------------------------------------------------------------- | -------------------------------------- |
| ☐   | 0–2  | Otwórz terminal w folderze roboczym (np. `C:\Projects`)                            | Terminal gotowy                        |
| ☐   | 2–4  | `git clone https://github.com/TWOJ-ZESPOL/hackathon-repo.git`                      | Clone bez błędu auth                   |
| ☐   | 4–6  | `cd hackathon-repo` → `npm install`                                                | `node_modules` bez błędów              |
| ☐   | 6–7  | Skopiuj `.env.example` → `.env.local`, wklej prawdziwe wartości                    | Plik `.env.local` istnieje lokalnie    |
| ☐   | 7–8  | (Opcjonalnie) `npx prisma generate` — domyślnie na `npm install` via `postinstall` | Client wygenerowany                    |
| ☐   | 8–10 | `npm run dev` → otwórz `http://localhost:3000`                                     | Landing widoczny, brak 500 w terminalu |

**PASS Faza 1:** strona otwiera się lokalnie na lapku.

---

### Faza 2 — Auth i baza lokalnie (10–18 min)

| ☐   | Min   | Krok                                                                         | Oczekiwany wynik                   |
| --- | ----- | ---------------------------------------------------------------------------- | ---------------------------------- |
| ☐   | 10–12 | Kliknij „Sign in with Google” (profil Hackathon w przeglądarce)              | Redirect do Google → powrót do app |
| ☐   | 12–14 | Po zalogowaniu: sesja aktywna — navbar pokazuje email; `/dashboard` dostępny | Użytkownik zalogowany              |
| ☐   | 14–16 | Wyloguj → zaloguj ponownie                                                   | Drugie logowanie OK                |
| ☐   | 16–18 | (Opcjonalnie) akcja zapisująca do DB — np. profil / prosty rekord            | Brak błędu Prisma w terminalu      |

**PASS Faza 2:** OAuth + DB działają lokalnie **na lapku**, nie tylko na PC.

Typowe FAIL:

- `redirect_uri_mismatch` → brak `http://localhost:3000/api/auth/callback/google` w Google Console
- błąd Prisma → zły `DATABASE_URL` / brak `DIRECT_URL` w `.env.local`, lub brak `npm run db:migrate`

---

### Faza 3 — Git push z laptopa (18–24 min)

| ☐   | Min   | Krok                                                                                  | Oczekiwany wynik    |
| --- | ----- | ------------------------------------------------------------------------------------- | ------------------- |
| ☐   | 18–19 | W Cursor/VS Code: zmień coś widocznego (np. tekst na landing: „Smoke test laptop OK”) | Diff w edytorze     |
| ☐   | 19–21 | `git checkout -b smoke-test-laptop`                                                   | Branch utworzony    |
| ☐   | 21–22 | `git add .` → `git commit -m "chore: laptop smoke test"`                              | Commit bez `.env`   |
| ☐   | 22–24 | `git push -u origin smoke-test-laptop`                                                | Push bez błędu auth |

**PASS Faza 3:** push z laptopa działa (HTTPS + token / `gh auth` / SSH — to, czego użyjesz w hotelu).

**UWAGA:** upewnij się, że `.env.local` jest w `.gitignore` — `git status` nie powinien go pokazywać.

---

### Faza 4 — Deploy i prod (24–30 min)

| ☐   | Min   | Krok                                                                                         | Oczekiwany wynik          |
| --- | ----- | -------------------------------------------------------------------------------------------- | ------------------------- |
| ☐   | 24–25 | Merge do `main` **lub** otwórz PR i merge (albo push bezpośrednio na `main` jeśli tak macie) | Trigger deploy Vercel     |
| ☐   | 25–27 | Vercel Dashboard → ostatni deploy **Ready**                                                  | Zielony status            |
| ☐   | 27–28 | Otwórz prod URL — widać zmianę z smoke testu                                                 | Tekst z fazy 3 na stronie |
| ☐   | 28–30 | Logowanie Google na **prod URL** (nie localhost)                                             | Sesja działa na Vercel    |

**PASS Faza 4:** pełny łańcuch laptop → GitHub → Vercel → OAuth prod.

Po teście (1 min):

- [ ] Usuń branch `smoke-test-laptop` (opcjonalnie)
- [ ] Cofnij tekst testowy lub zostaw — nieważne

---

## Test bonusowy (+5 min, przed 29.05)

Nie wlicza się w 30 min, ale warto zrobić raz:

| ☐   | Krok                                                                          | Po co                |
| --- | ----------------------------------------------------------------------------- | -------------------- |
| ☐   | Włącz hotspot telefonu, wyłącz Wi-Fi domowe, powtórz Fazę 3–4 (push + deploy) | Symulacja hotelu     |
| ☐   | Otwórz prod URL na telefonie, zeskanuj „QR” (otwórz URL ręcznie)              | Demo mobile dla jury |
| ☐   | `git pull` na laptopie po pushu **innej osoby** z zespołu                     | Współpraca multi-dev |

---

## Powtórka 29.05 (~10 min)

Wieczorem przed wyjazdem — **tylko** to:

```powershell
cd C:\Projects\hackathon-repo   # ścieżka, którą już masz
git pull
npm install                     # na wypadek nowych zależności
npm run dev                     # 30 s — strona wstaje
```

- [ ] Prod URL otwiera się w przeglądarce
- [ ] Logowanie Google na prod — 1 próba
- [ ] Hotspot — krótki test `git push` (opcjonalnie)
- [ ] `.env.local` na miejscu, ładowarka w plecaku

---

## Checklist PASS / FAIL — podsumowanie

Wpisz datę i wynik po teście:

| Test                 | Data | OK? | Notatki |
| -------------------- | ---- | --- | ------- |
| Faza 1 — dev lokalny |      | ☐   |         |
| Faza 2 — OAuth + DB  |      | ☐   |         |
| Faza 3 — git push    |      | ☐   |         |
| Faza 4 — deploy prod |      | ☐   |         |
| Bonus hotspot        |      | ☐   |         |

**Gotowość na hackathon:** wszystkie 4 fazy **OK** na koncie/profilu, z którego pracujesz w hotelu.

---

## Szybkie naprawy (gdy coś padnie)

| Objaw                      | Prawdopodobna przyczyna    | Fix                                                               |
| -------------------------- | -------------------------- | ----------------------------------------------------------------- |
| `git push` — auth failed   | Brak tokenu / SSH na lapku | `gh auth login` lub skonfiguruj PAT / SSH key                     |
| `npm install` — EBADENGINE | Inna wersja Node niż na PC | Zainstaluj ten sam LTS (20 lub 22)                                |
| OAuth localhost fail       | Zły redirect URI           | Google Console → dodaj localhost callback                         |
| OAuth prod fail            | Brak Vercel URL w redirect | Dodaj `https://*.vercel.app/.../callback/google`                  |
| Prisma connection error    | Zły URL — pooled vs direct | `DATABASE_URL` (:6543) dla app; `DIRECT_URL` (:5432) dla migracji |
| Migracja fail              | Brak `DIRECT_URL`          | Ustaw direct URL z Supabase; nie używaj poolera do `db:migrate`   |
| Vercel build fail          | Brak env vars              | Vercel → Settings → Environment Variables (oba URL-e + AUTH\_\*)  |
| Strona 500 po deploy       | Migracje nie zastosowane   | `npm run db:deploy` z prod `DIRECT_URL`                           |
| Wolny `npm install`        | Antywirus / słabe Wi-Fi    | Użyj kabla / wyłącz skanowanie folderu projektu tymczasowo        |

---

## Czego **nie** robić w smoke teście

- Nie implementuj feature’ów produktowych (transport, carpooling itd.)
- Nie zmieniaj schematu Prisma poza drobnym testem — to zostaje na hackathon
- Nie commituj `.env.local`
- Nie konfiguruj wszystkiego od zera na lapku, jeśli template jest już na PC — to marnowanie czasu

---

## TODO / do rozbudowy

- [ ] Wpisać konkretny URL repo zespołu
- [ ] Wpisać prod URL Vercel po pierwszym deployu
- [ ] Data i wynik pierwszego smoke testu w tabeli PASS/FAIL
- [ ] Data powtórki 29.05
