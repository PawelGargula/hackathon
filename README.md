# Hackathon Template

Production-quality Next.js starter built for a 48h hackathon. Designed around the stack in [specifications/05-tech-stack.md](specifications/05-tech-stack.md).

## Stack

| Layer     | Choice                                                                  |
| --------- | ----------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack, React 19)                            |
| Styling   | Tailwind CSS v4                                                         |
| UI        | shadcn/ui (Radix primitives, owned in-repo under `components/ui`)       |
| Auth      | Auth.js v5 (`next-auth@beta`) + Google + Prisma adapter, JWT sessions   |
| ORM       | Prisma 7 with the new `prisma-client` generator and `pg` driver adapter |
| Database  | Supabase Postgres (pooled URL at runtime, direct URL for migrations)    |
| Hosting   | Vercel (zero-config)                                                    |

## Project layout

```
app/                       # App Router pages
  (dashboard)/dashboard/   # protected route group
  api/auth/[...nextauth]/  # Auth.js route handler
components/
  ui/                      # shadcn/ui primitives
  site-nav.tsx, sign-in-button.tsx, sign-out-button.tsx
lib/
  auth.ts                  # NextAuth() init — exports auth, handlers, signIn, signOut
  prisma.ts                # PrismaClient singleton (pg adapter)
  utils.ts                 # cn() helper
  generated/prisma/        # generated Prisma client (gitignored)
prisma/
  schema.prisma            # Auth.js-compatible models
  seed.ts                  # seed script (npm run db:seed)
prisma.config.ts           # Prisma 7 CLI config (DB URL lives here, not in schema)
proxy.ts                   # Next 16 replacement for middleware.ts — refreshes session
specifications/            # hackathon planning docs
```

## Setup

### 1. Install

```bash
npm install
```

The `postinstall` hook runs `prisma generate` for you.

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in:

- `AUTH_SECRET` — generate with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — from [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials). Add these authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google`
  - `https://YOUR-DEPLOYMENT.vercel.app/api/auth/callback/google`
- `DATABASE_URL` — Supabase pooled connection string (port `6543`, `?pgbouncer=true`). Used by the app.
- `DIRECT_URL` — Supabase direct connection (port `5432`). Used by `prisma migrate`.

Find both URLs in Supabase: **Project Settings → Database → Connection string**.

### 3. Database

```bash
npm run db:migrate   # create + apply initial migration
npm run db:seed      # optional, runs prisma/seed.ts
```

Useful:

```bash
npm run db:studio    # browse data in Prisma Studio
npm run db:push      # push schema without a migration (prototyping only)
npm run db:reset     # drop, re-migrate, re-seed
```

### 4. Run

```bash
npm run dev
```

Open <http://localhost:3000>.

## Deploying to Vercel

1. Push to GitHub.
2. **Import** the repo into Vercel.
3. Add the same env vars (`AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `DATABASE_URL`, `DIRECT_URL`) under Project Settings → Environment Variables.
4. Add the production redirect URI to your Google OAuth client (see step 2 above).
5. Run migrations against the production DB once: `npx prisma migrate deploy` locally with prod `DIRECT_URL`, or wire it into the build.

`npm run build` already runs `prisma generate` first.

## Notable design choices

- **JWT session strategy** even with the Prisma adapter — keeps `proxy.ts` and every request cheap (no DB hit per request). The adapter is still used to persist users/accounts so OAuth account linking works.
- **`prisma.config.ts`** is the single source of truth for the DB URL. The schema only declares `provider`. This is required in Prisma 7+.
- **`@prisma/adapter-pg`** is the runtime driver — Prisma 7 expects a driver adapter for relational DBs.
- **`proxy.ts`** replaces `middleware.ts` in Next.js 16 and runs on Node.js, so Prisma works in it if you ever need it.
- **No Supabase JS SDK** — Prisma is the only data access path. Supabase is just managed Postgres here.

## Next steps

1. Pick your project idea (see [specifications/02-project-idea.md](specifications/02-project-idea.md)).
2. Add app-specific models to `prisma/schema.prisma` and run `npm run db:migrate`.
3. Add real seed data to `prisma/seed.ts`.
4. Build features in `app/(dashboard)/` and server actions under `lib/actions/`.
