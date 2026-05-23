---
name: nextjs hackathon template
overview: Scaffold a production-quality Next.js 16 hackathon template at the repo root using App Router + TypeScript + Tailwind v4, Auth.js v5 with Google + Prisma adapter, Prisma ORM against Supabase Postgres, and shadcn/ui — wired for Vercel deploy.
todos:
  - id: scaffold
    content: Run create-next-app at repo root (TS, Tailwind v4, App Router, ESLint, no src/)
    status: in_progress
  - id: shadcn
    content: Initialize shadcn/ui and add button + card components
    status: pending
  - id: authjs
    content: Install next-auth@beta + prisma-adapter; create lib/auth.ts, route handler, proxy.ts, sign-in/out components
    status: pending
  - id: prisma
    content: Install Prisma, init schema with Auth.js models + Supabase dual-URL datasource, create lib/prisma.ts singleton and seed stub
    status: pending
  - id: pages
    content: Build landing, protected dashboard route, and SiteNav with auth-aware UI
    status: pending
  - id: env-docs
    content: Write .env.example, README setup guide, and package.json db:* scripts
    status: pending
  - id: verify
    content: Run npm run lint and npm run build to confirm a clean baseline
    status: pending
isProject: false
---

## Target stack (latest as of 2026-05)

- Next.js 16 (App Router, Turbopack, React 19)
- TypeScript strict, ESLint flat config
- Tailwind CSS v4 (CSS-first, `@import "tailwindcss"`)
- shadcn/ui (Radix + class-variance-authority)
- Auth.js v5 (`next-auth@beta`) + Google provider + `@auth/prisma-adapter`
- Prisma 7 (`prisma@latest` / `@prisma/client@latest`) with the new `prisma-client` generator and explicit `output`; no Accelerate — direct Supabase Postgres
- Supabase: **Postgres only** via `DATABASE_URL` / `DIRECT_URL` (no `@supabase/*` SDK)

## Layout

Created at workspace root (`c:/Projekty/my/hackathon/`). `specifications/` stays untouched. Final tree:

```
/
├── specifications/            # existing, untouched
├── app/
│   ├── (auth)/sign-in/page.tsx
│   ├── (dashboard)/page.tsx
│   ├── api/auth/[...nextauth]/route.ts
│   ├── layout.tsx
│   └── page.tsx               # landing
├── components/
│   ├── ui/                    # shadcn primitives (button, card)
│   ├── sign-in-button.tsx
│   ├── sign-out-button.tsx
│   └── site-nav.tsx
├── lib/
│   ├── auth.ts                # NextAuth config export
│   ├── prisma.ts              # singleton PrismaClient
│   └── utils.ts               # cn() helper
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── proxy.ts                   # Next 16 replacement for middleware.ts
├── .env.example
├── .env.local                 # gitignored, generated values
├── README.md
├── components.json            # shadcn config
├── tsconfig.json
├── next.config.ts
└── package.json
```

## Execution order

1. **Scaffold** `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --yes` from the repo root. Resolve any `specifications/` conflict by keeping it (create-next-app will not touch it).
2. **Init shadcn/ui** `npx shadcn@latest init -d` then `npx shadcn@latest add button card`. Confirm it writes to `components/ui/` and a `lib/utils.ts` with `cn()`.
3. **Auth.js v5**
   - `npm install next-auth@beta @auth/prisma-adapter`
   - `npx auth secret` (writes `AUTH_SECRET` to `.env.local`)
   - Create `lib/auth.ts` exporting `{ handlers, signIn, signOut, auth }` with Google provider + PrismaAdapter, `session: { strategy: "jwt" }` (keeps `proxy.ts` edge-safe and avoids DB hits on every request).
   - Create `app/api/auth/[...nextauth]/route.ts` re-exporting `{ GET, POST }` from `@/lib/auth`.
   - Create `proxy.ts` at root (Next 16 replaces `middleware.ts`): `export { auth as proxy } from "@/lib/auth"`.
4. **Prisma + Supabase Postgres**
   - `npm install @prisma/client@latest && npm install -D prisma@latest tsx`
   - `npx prisma init` then replace the generated schema with Auth.js-required models (`User`, `Account`, `Session`, `VerificationToken`) using `snake_case` `@map`s, the new Prisma 7 generator block, and the dual-URL Supabase pattern:

     ```prisma
     generator client {
       provider = "prisma-client"
       output   = "../lib/generated/prisma"
     }

     datasource db {
       provider  = "postgresql"
       url       = env("DATABASE_URL")      // pooled (pgbouncer:6543)
       directUrl = env("DIRECT_URL")        // direct (5432) for migrations
     }
     ```

   - `lib/prisma.ts` singleton importing `PrismaClient` from `./generated/prisma` (Prisma 7 no longer publishes from `@prisma/client` by default), guarded against hot-reload duplication in dev.
   - Add `lib/generated/` to `.gitignore`.
   - `prisma/seed.ts` minimal placeholder + `"prisma": { "seed": "tsx prisma/seed.ts" }` in `package.json`.

5. **UI wiring**
   - `app/layout.tsx`: SessionProvider-free (Auth.js v5 uses server `auth()`), include `<SiteNav />`.
   - `components/sign-in-button.tsx` / `sign-out-button.tsx`: server-action forms calling `signIn("google")` / `signOut()`.
   - `app/page.tsx`: landing with shadcn `Card` showing signed-in user via `await auth()`.
   - `app/(dashboard)/page.tsx`: protected route — `const session = await auth(); if (!session) redirect("/api/auth/signin")`.
6. **Env + docs**
   - `.env.example` documenting `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_URL` (optional on Vercel).
   - `README.md`: 1-page setup (clone → `npm i` → fill `.env.local` → `npx prisma migrate dev` → `npm run dev` → Vercel deploy notes + Google OAuth callback URLs for `localhost` and prod).
   - `package.json` scripts: `dev`, `build`, `start`, `lint`, `db:migrate` (`prisma migrate dev`), `db:push`, `db:seed`, `db:studio`.
7. **Verify** `npm run lint && npm run build` succeed. Don't run `prisma migrate dev` in the plan — that requires a real Supabase URL the user will supply.

## Key decisions / non-obvious choices

- **JWT session strategy** even with PrismaAdapter — keeps `proxy.ts` fast, no DB roundtrip per request, sidesteps any residual edge concerns. Adapter still persists `User`/`Account` so OAuth linking works.
- **No Accelerate extension** — adds a paid dependency and a second URL; not needed for a hackathon, and direct Supabase Postgres is fine.
- **`proxy.ts` not `middleware.ts`** — Next 16 renamed it and `proxy.ts` runs on Node.js runtime, so Prisma edge concerns are gone.
- **No `src/` dir** — matches the structure in [specifications/05-tech-stack.md](specifications/05-tech-stack.md).
- **Skip Supabase JS SDKs** — Prisma is the single data access layer.

## Out of scope (deliberately)

- Google Cloud OAuth client registration (manual, doc'd in README)
- Creating the Supabase project / pasting connection strings (manual, doc'd in README)
- Vercel project creation (manual, doc'd in README)
- App-specific Prisma models — left for after the project idea is locked in per [specifications/02-project-idea.md](specifications/02-project-idea.md)
