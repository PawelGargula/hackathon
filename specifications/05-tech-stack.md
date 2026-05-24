# 05 — Stack technologiczny

Decyzje techniczne na 48h hackathonu. Stack oparty o technologie, które zespół zna — minimalizujemy niespodzianki.

> Powiązane: [03-laptop-setup.md](./03-laptop-setup.md), [04-deployment-demo.md](./04-deployment-demo.md), [02-project-idea.md](./02-project-idea.md)
>
> **Template gotowy** w root repo — pełny setup: [../README.md](../README.md)

## Stack — podsumowanie

| Warstwa       | Wybór                   | Uzasadnienie                                        |
| ------------- | ----------------------- | --------------------------------------------------- |
| **Framework** | Next.js 16 (App Router) | Znany stack, szybki start, natywny deploy na Vercel |
| **Styling**   | Tailwind CSS v4         | Szybki UI bez budowania design systemu              |
| **UI**        | shadcn/ui               | Gotowe komponenty (Base UI), kopiowane do repo      |
| **Auth**      | Auth.js v5 + Google     | Znany; wymaga public URL (Vercel)                   |
| **ORM**       | Prisma 7                | Type-safe queries, migracje                         |
| **Baza**      | PostgreSQL via Supabase | Managed, darmowy tier, zero admina                  |
| **Hosting**   | Vercel                  | Zero-config z Next.js, auto-deploy z GitHub         |

### Wersje (z `package-lock.json`, maj 2026)

| Pakiet         | Wersja        |
| -------------- | ------------- |
| next           | 16.2.6        |
| react          | 19.2.4        |
| tailwindcss    | ^4            |
| next-auth      | 5.0.0-beta.31 |
| prisma         | 7.8.0         |
| @prisma/client | 7.8.0         |

## Decyzje architektoniczne

### Auth.js vs Supabase Auth

**Rekomendacja: Auth.js v5 + Google**

- Zespół zna Auth.js — mniej czasu na debug w weekend
- Supabase używamy **tylko jako PostgreSQL**, nie jako auth provider
- Jeden provider (Google) wystarczy na MVP hackathonowe

### Monorepo vs single app

**Rekomendacja: single Next.js app**

- Jeden repo, jeden deploy, mniej konfiguracji
- API routes / server actions w tym samym projekcie co frontend

### Seed data vs ręczne wprowadzanie

**Rekomendacja: seed script (`npm run db:seed`)**

- Przewidywalne demo — jury widzi sensowne dane, nie pusty ekran
- Przygotuj seed przed hackathonem; uzupełnij w trakcie o dane specyficzne dla pomysłu

### Server Actions vs REST API

**Rekomendacja: Server Actions tam gdzie proste mutacje**

- Mniej boilerplate niż osobne API routes
- API routes zostaw na webhooki / Auth.js callback

## Struktura projektu (zaimplementowana)

```
/
├── app/
│   ├── (dashboard)/dashboard/page.tsx   # chroniona trasa /dashboard
│   ├── api/auth/[...nextauth]/route.ts  # Auth.js
│   ├── layout.tsx
│   ├── page.tsx                         # landing /
│   └── globals.css
├── components/
│   ├── ui/                              # shadcn (button, card)
│   ├── site-nav.tsx
│   ├── sign-in-button.tsx
│   └── sign-out-button.tsx
├── lib/
│   ├── auth.ts                          # NextAuth() config
│   ├── prisma.ts                        # PrismaClient singleton (pg adapter)
│   ├── utils.ts                         # cn() helper
│   └── generated/prisma/                # gitignored — z prisma generate
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── prisma.config.ts                     # Prisma 7 — URL bazy tutaj, nie w schema
├── proxy.ts                             # Next 16 — odświeżanie sesji (ex middleware)
├── specifications/                      # dokumentacja hackathonu
├── .env.example
└── package.json
```

Logowanie odbywa się przez przycisk z server action (`SignInButton`), bez osobnej strony `(auth)/sign-in`.

## Prisma 7 — schemat i konfiguracja

W Prisma 7 connection string **nie trafia do `schema.prisma`** — jest w [`prisma.config.ts`](../prisma.config.ts). Runtime używa driver adaptera (`@prisma/adapter-pg` + `pg`).

### Generator i datasource (schema)

```prisma
generator client {
  provider = "prisma-client"
  output   = "../lib/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

### Supabase — dwa URL-e

| Zmienna        | Port | Użycie                                    |
| -------------- | ---- | ----------------------------------------- |
| `DATABASE_URL` | 6543 | Pooled (pgbouncer) — app runtime          |
| `DIRECT_URL`   | 5432 | Direct — `npm run db:migrate`, Prisma CLI |

### Modele Auth.js (już w schemacie)

`User`, `Account`, `Session`, `VerificationToken` — wymagane przez `@auth/prisma-adapter`.

**Modele specyficzne dla pomysłu** — doprecyzuj po wyborze kierunku w [02-project-idea.md](./02-project-idea.md), potem `npm run db:migrate`.

### Skrypty npm (baza)

```bash
npm run db:migrate   # dev — tworzy i stosuje migracje
npm run db:deploy    # prod — stosuje migracje
npm run db:push      # prototypowanie bez migracji
npm run db:seed      # seed data
npm run db:studio    # Prisma Studio
```

`postinstall` uruchamia `prisma generate`. Skrypt `build` uruchamia `prisma migrate deploy`, potem `prisma generate`, potem `next build` — migracje stosują się automatycznie przy deployu na Vercel (wymaga `DIRECT_URL` w env).

## Auth.js — konfiguracja (zaimplementowana)

Kluczowe elementy w [`lib/auth.ts`](../lib/auth.ts):

- Provider: **Google**
- Adapter: **PrismaAdapter** (persistuje User/Account)
- Session strategy: **JWT** (brak DB hit per request; szybszy `proxy.ts`)
- Env: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
- Callback URL: `/api/auth/callback/google`
- [`proxy.ts`](../proxy.ts) — odświeżanie sesji (Next 16 zamiast `middleware.ts`)

## Tailwind + shadcn/ui

**Decyzja: shadcn/ui — tak.**

- Komponenty kopiowane do `components/ui/` — niski lock-in, łatwa edycja
- Obecnie: `button`, `card` (+ `SiteNav`, formularze sign-in/out)
- Nie trac czasu na pixel-perfect — czytelność > estetyka
- Responsywność: sprawdź widok mobile (jury może skanować QR telefonem)

## Boilerplate — status

**Template gotowy w root repo.** Setup: [../README.md](../README.md).

### Checklist boilerplate (przed 30.05)

- [x] Next.js 16 App Router + TypeScript
- [x] Tailwind CSS v4
- [x] Auth.js v5 + Google provider (wymaga env vars + Vercel do pełnego testu)
- [x] Prisma 7 + połączenie z Supabase (dual URL)
- [x] `.env.example`
- [x] Podstawowy layout (navbar via `SiteNav`)
- [x] Landing page + chroniony `/dashboard`
- [ ] Pierwszy deploy na Vercel OK

### Kluczowe zależności (npm)

```
next react react-dom
tailwindcss @tailwindcss/postcss
next-auth @auth/prisma-adapter
@prisma/client @prisma/adapter-pg prisma pg dotenv
tsx (dev — seed script)
```

Pełna lista w [`package.json`](../package.json).

## Czego unikać na hackathonie

- Nowy framework / język, którego zespół nie zna
- Mikroserwisy, Kubernetes, własny Docker setup
- Wiele providerów auth (Google wystarczy)
- Skomplikowany CI/CD poza Vercel auto-deploy
- Real-time (WebSockets) — chyba że to core pomysłu
- Supabase JS SDK (`@supabase/supabase-js`) — Prisma wystarczy jako jedyna warstwa danych

## Scope techniczny na MVP (48h)

Realistyczny zakres dla zespołu 3-osobowego:

| W scope                     | Poza scope                                    |
| --------------------------- | --------------------------------------------- |
| Landing + 1–2 główne ekrany | Panel admina                                  |
| Logowanie Google            | Wiele ról użytkowników                        |
| CRUD na 1–2 encjach         | Zaawansowane wyszukiwanie / filtry            |
| Seed data                   | Import z zewnętrznych API (chyba że kluczowe) |
| Deploy Vercel + Supabase    | Własna domena                                 |
| Responsywny layout          | Pixel-perfect design                          |

---

## TODO / do rozbudowy

- [x] Link do repo template / boilerplate zespołu — **ten repo (root)**
- [ ] Finalny schemat Prisma po wyborze pomysłu
- [ ] Lista endpointów / server actions MVP
- [x] Decyzja: shadcn/ui tak/nie — **tak**
- [x] Wersje pakietów z lockfile (`package-lock.json`)
