# 04 — Deployment i demo

Strategia publikacji aplikacji na hackathonie: Vercel + Supabase, logowanie Google, QR na prezentacji i plan awaryjny.

> Powiązane: [05-tech-stack.md](./05-tech-stack.md), [03-laptop-setup.md](./03-laptop-setup.md), [06-hackathon-playbook.md](./06-hackathon-playbook.md)

## Rekomendacja: deploy tak, demo live z QR

Na hackathonie **warto deployować** — działający publiczny URL robi wrażenie na jury i umożliwia natychmiastowy test przez publiczność (skan QR).

| Aspekt           | Deploy (Vercel + Supabase)      | Tylko localhost               |
| ---------------- | ------------------------------- | ----------------------------- |
| Wrażenie na jury | Silne                           | Słabsze                       |
| QR na slajdzie   | Działa od razu                  | Bezużyteczne                  |
| Google OAuth     | Wymaga publicznego redirect URI | Uciążliwe                     |
| Ryzyko Wi-Fi     | Aplikacja już w chmurze         | Demo zależy od lokalnej sieci |

**Plan B:** krótkie nagranie ekranu (30–60 s) + możliwość odpalenia `localhost` gdyby padło Wi-Fi na sali.

## Architektura deployu

```
Developer laptop → git push → GitHub → Vercel (auto-deploy)
                                              ↓
                                        Next.js app
                                              ↓
                                    Supabase PostgreSQL
                                              ↓
                              Google OAuth (redirect URI = Vercel URL)
```

- **Vercel** — hosting Next.js (frontend + API routes / server actions)
- **Supabase** — managed PostgreSQL (`DATABASE_URL` pooled w runtime, `DIRECT_URL` do migracji)
- **Google OAuth** — Auth.js callback na publicznym URL Vercel

## Flow deployu krok po kroku

### 1. Push na GitHub

Każdy push na `main` (lub skonfigurowany branch) triggeruje auto-deploy na Vercel.

### 2. Zmienne środowiskowe w Vercel

Ustaw w Vercel → Project → Settings → Environment Variables:

| Zmienna              | Opis                                                                                          |
| -------------------- | --------------------------------------------------------------------------------------------- |
| `DATABASE_URL`       | Supabase **pooled** (port 6543, `?pgbouncer=true`) — app runtime                              |
| `DIRECT_URL`         | Supabase **direct** (port 5432) — migracje Prisma, `db:deploy`                                |
| `AUTH_SECRET`        | Losowy secret — `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `AUTH_GOOGLE_ID`     | Client ID z Google Cloud Console                                                              |
| `AUTH_GOOGLE_SECRET` | Client Secret z Google Cloud Console                                                          |

`NEXTAUTH_URL` / `AUTH_URL` — **opcjonalne** na Vercel (framework wykrywa prod URL). Pełna lista: [../.env.example](../.env.example)

Ustaw dla środowisk: **Production**, **Preview**, **Development** (tam gdzie potrzebne).

### 3. Google OAuth — redirect URI

W Google Cloud Console → Credentials → OAuth 2.0 Client:

**Authorized redirect URIs:**

```
https://TWOJ-PROJEKT.vercel.app/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

Dla preview deployów (opcjonalnie — każdy branch dostaje inny URL):

```
https://*-TWOJ-PROJEKT.vercel.app/api/auth/callback/google
```

(lub dodaj konkretne preview URL ręcznie)

### 4. Migracje Prisma (Prisma 7)

**Przed pierwszym deployem z bazą:**

```bash
npm run db:migrate   # lokalnie, z uzupełnionym DIRECT_URL w .env.local
```

**Na produkcji (hackathon):**

```bash
npm run db:deploy    # z DIRECT_URL produkcyjnym w .env.local
```

W Prisma 7 URL bazy jest w [`prisma.config.ts`](../prisma.config.ts) — migracje używają `DIRECT_URL`, nie pooled `DATABASE_URL`.

Build na Vercel uruchamia `prisma generate` automatycznie (`postinstall` + skrypt `build`).

Opcje na hackathonie:

- Uruchomić `npm run db:deploy` lokalnie z prod `DIRECT_URL` (najszybsze)
- Dodać `prisma migrate deploy` do build script (ostrożnie — wydłuża build)
- Użyć Supabase SQL Editor do ręcznego zastosowania migracji (awaryjnie)

**Rekomendacja:** migracje zrób przed hackathonem; w trakcie tylko `npm run db:push` w razie drobnych zmian schematu.

### 5. Weryfikacja deployu

- [ ] URL Vercel otwiera się bez błędu
- [ ] Logowanie Google działa end-to-end
- [ ] Operacje na bazie (odczyt/zapis) działają
- [ ] Sprawdź na telefonie (inna sieć) — symulacja jury skanującego QR

## QR code na prezentacji

1. Skopiuj production URL z Vercel
2. Wygeneruj QR (np. wbudowany generator w Google Slides / PowerPoint, lub [qr-code-generator.com](https://www.qr-code-generator.com))
3. Umieść QR na slajdzie „Live demo" lub na ostatnim slajdzie
4. Pod QR: krótka etykieta, np. „Przetestuj aplikację"

**Tip:** wygeneruj QR jeszcze w niedzielę rano po ostatnim deployu — URL musi być aktualny.

## Domena własna — pominąć

Na hackathon **nie ma sensu** kupować ani konfigurować własnej domeny:

- Subdomena Vercel (`projekt-xyz.vercel.app`) wystarczy
- Oszczędzasz czas (DNS, SSL, konfiguracja)
- Jeden punkt mniej do zepsucia przed prezentacją

Po hackathonie można dodać domenę, jeśli projekt idzie dalej.

## Plan awaryjny (fallback)

| Problem               | Rozwiązanie                                             |
| --------------------- | ------------------------------------------------------- |
| Padło Wi-Fi na sali   | Nagrane demo wideo (30–60 s) + slajdy ze screenshotami  |
| OAuth nie działa live | Pokaż flow na nagraniu; wyjaśnij jury co poszło nie tak |
| Vercel down (rzadkie) | `npm run dev` na laptopie + hotspot                     |
| Baza Supabase limit   | Seed minimalny; unikaj ciężkich zapytań na demo         |
| Cold start wolny      | Otwórz app w przeglądarce 2 min przed demo              |

Przygotuj nagranie ekranu w niedzielę przed południem — koszt 10 minut, duży spokój ducha.

## Typowe pułapki

1. **Zły redirect URI** — najczęstszy błąd OAuth; URL musi być identyczny (https, bez trailing slash)
2. **Brak `AUTH_SECRET` na Vercel** — sesja nie działa
3. **Brak `DIRECT_URL` na Vercel** — migracje / `db:deploy` failują (pooler nie obsługuje DDL)
4. **Connection string Supabase** — `DATABASE_URL` = pooled (:6543); `DIRECT_URL` = direct (:5432)
5. **Env vars tylko w Production** — preview deployy nie mają bazy
6. **Migracja nie uruchomiona** — aplikacja startuje, ale zapytania do DB failują
7. **Prisma client nie wygenerowany** — na Vercel pokryte przez `postinstall`; lokalnie: `npm install`

## Checklista deployu — sobota ~17:00

- [ ] MVP na `main`, auto-deploy OK
- [ ] Wszystkie env vars ustawione na Vercel
- [ ] Google OAuth działa na production URL
- [ ] Seed / dane demo w bazie
- [ ] Test z telefonu (QR)

## Checklista deployu — niedziela ~12:00

- [ ] Ostatni deploy stabilny (freeze features ~11:30)
- [ ] QR wygenerowany z aktualnym URL
- [ ] Nagranie fallback gotowe
- [ ] Ktoś z zespołu odpowiada za „otwarcie app 2 min przed demo"

---

## TODO / do rozbudowy

- [ ] Konkretny URL produkcyjny projektu
- [x] Pełna lista env vars — [../.env.example](../.env.example) (wartości w `.env.local`, nie w repo)
- [ ] Procedura rollback (Vercel → Deployments → Promote previous)
- [x] Decyzja: `migrate deploy` w build vs ręcznie — **ręcznie (`npm run db:deploy`) przed/po deploy**
- [ ] Screenshot działającego flow OAuth do slajdów backupowych
