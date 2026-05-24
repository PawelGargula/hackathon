# 03 — Setup laptopa (Windows)

Pożyczony laptop wymaga przygotowania **przed** hackathonem. Ten dokument opisuje izolację środowiska, instalację narzędzi, logowanie do serwisów i checklisty.

> **Regulamin §2 pkt 15:** Organizator **nie zapewnia sprzętu komputerowego** — każdy uczestnik korzysta z własnego urządzenia. Pożyczony laptop + wcześniejszy setup to konieczność, nie opcja.

> Powiązane: [05-tech-stack.md](./05-tech-stack.md), [04-deployment-demo.md](./04-deployment-demo.md), [07-laptop-smoke-test.md](./07-laptop-smoke-test.md)

## Strategia izolacji

### Rekomendacja: osobne konto Windows

Utwórz lokalne konto użytkownika Windows, np. `Hackathon`:

**Zalety:**

- Izolacja od plików, historii i haseł właściciela laptopa
- Własny profil przeglądarki (GitHub, Google, Vercel, Supabase)
- Łatwe sprzątanie po evencie — usunięcie konta = czysty stan

**Jak utworzyć (Windows 10/11):**

1. Ustawienia → Konta → Rodzina i inni użytkownicy → Dodaj użytkownika
2. „Nie mam danych logowania tej osoby" → „Dodaj użytkownika bez konta Microsoft"
3. Nazwa: `Hackathon`, hasło opcjonalne (ustaw dla bezpieczeństwa)
4. Zaloguj się na nowe konto i skonfiguruj wszystko poniżej

### Alternatywa: profil przeglądarki

Jeśli właściciel nie chce nowego konta Windows:

- Chrome/Edge → nowy profil „Hackathon"
- Osobne logowania do serwisów tylko w tym profilu

**Wada:** mniejsza izolacja (ten sam system plików, inne aplikacje).

---

## Narzędzia do zainstalowania

| Narzędzie               | Wersja          | Po co                                |
| ----------------------- | --------------- | ------------------------------------ |
| **Git**                 | najnowszy       | Kontrola wersji, push na GitHub      |
| **Node.js**             | LTS (20 lub 22) | Next.js, npm                         |
| **Cursor**              | najnowszy       | Edytor kodu (AI-assisted)            |
| **Chrome** lub **Edge** | najnowszy       | OAuth, DevTools, osobny profil       |
| **GitHub CLI** (`gh`)   | opcjonalnie     | Szybkie operacje na repo z terminala |

### Weryfikacja instalacji

```powershell
git --version
node --version
npm --version
```

### Cursor

1. Pobierz z [cursor.com](https://cursor.com)
2. Zaloguj się na swoje konto Cursor
3. Opcjonalnie: zsynchronizuj ustawienia z własnego komputera

---

## Konta i serwisy — co skonfigurować

| Serwis                   | Po co                                       | Kiedy             |
| ------------------------ | ------------------------------------------- | ----------------- |
| **GitHub**               | Repo, współpraca zespołu, integracja Vercel | Przed hackathonem |
| **Vercel**               | Hosting Next.js, auto-deploy                | Przed hackathonem |
| **Supabase**             | PostgreSQL (managed), opcjonalnie storage   | Przed hackathonem |
| **Google Cloud Console** | OAuth Client ID dla logowania Google        | Przed hackathonem |
| **Cursor**               | Edytor                                      | Przed hackathonem |

### GitHub

- [ ] Konto z włączonym **2FA**
- [ ] Skonfigurowany Git (`git config user.name`, `git config user.email`)
- [ ] Dostęp do repo zespołu (współwłaściciel / collaborator)
- [ ] Autentykacja: GitHub CLI (`gh auth login`) lub SSH key / Personal Access Token

### Vercel

- [ ] Konto połączone z GitHub
- [ ] Projekt Vercel powiązany z repo (można utworzyć przed hackathonem na pustym/szkieletowym repo)
- [ ] Zespół ma dostęp do projektu Vercel

### Supabase

- [ ] Projekt utworzony (free tier)
- [ ] Skopiowany **`DATABASE_URL`** — Transaction pooler (port **6543**, `?pgbouncer=true`) — używany przez app w runtime
- [ ] Skopiowany **`DIRECT_URL`** — direct connection (port **5432**) — używany przez `npm run db:migrate` i Prisma CLI
- [ ] Hasło bazy zapisane w menedżerze haseł / `.env.local` (nie commitować!)

> Oba URL-e: Supabase → Project Settings → Database → Connection string. Szczegóły: [../README.md](../README.md)

### Google Cloud Console (OAuth)

- [ ] Projekt w Google Cloud
- [ ] OAuth consent screen skonfigurowany (External, test users jeśli w trybie testowym)
- [ ] OAuth 2.0 Client ID (typ: **Web application**)
- [ ] Authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google` (dev)
  - `https://TWOJ-PROJEKT.vercel.app/api/auth/callback/google` (prod)
  - `https://TWOJ-PROJEKT-*.vercel.app/api/auth/callback/google` (preview — opcjonalnie)

> Szczegóły env vars: [04-deployment-demo.md](./04-deployment-demo.md)

---

## Przygotowanie repo (przed hackathonem)

**Template gotowy w root repo** — pełny setup: [../README.md](../README.md).

Nie budujcie od zera w sobotę rano. Przed wydarzeniem:

1. Push repo na GitHub (ten projekt)
2. Sklonuj na laptopie hackathonowym
3. Uruchom poniższe — upewnij się, że działa
4. `.env.example` już w repo — skopiuj do `.env.local` i uzupełnij wartości
5. Pierwszy deploy na Vercel — sprawdź, że pipeline działa

```powershell
npm install          # postinstall → prisma generate
copy .env.example .env.local
# uzupełnij AUTH_SECRET, AUTH_GOOGLE_*, DATABASE_URL, DIRECT_URL w .env.local
npm run db:migrate   # po uzupełnieniu URL-i Supabase
npm run dev
```

### Przykładowy `.env.example` (w repo)

```env
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
DATABASE_URL=    # pooled, port 6543 — app runtime
DIRECT_URL=      # direct, port 5432 — migracje Prisma
```

Lokalnie kopiuj do **`.env.local`** (konwencja Next.js). `NEXTAUTH_URL` opcjonalne — Vercel wykrywa prod URL automatycznie.

---

## Checklista — tydzień przed (do ~23.05)

- [ ] Ustalono z właścicielem laptopa: nowe konto Windows vs profil przeglądarki
- [ ] Git, Node.js, Cursor zainstalowane i działają
- [ ] GitHub + 2FA
- [ ] Dostęp do repo zespołu

## Smoke test (~30 min)

Po sklonowaniu repo i skonfigurowaniu `.env.local` uruchom pełny dress rehearsal według **[07-laptop-smoke-test.md](./07-laptop-smoke-test.md)** — clone, dev, OAuth, push, deploy prod.

## Checklista — dzień przed (29.05)

- [ ] Konto Windows `Hackathon` gotowe (lub profil przeglądarki)
- [ ] `node`, `git`, `cursor` — smoke test OK
- [ ] GitHub zalogowany, `git pull` działa
- [ ] Vercel połączony z GitHub, ostatni deploy OK
- [ ] Supabase projekt utworzony, `DATABASE_URL` i `DIRECT_URL` w `.env.local`
- [ ] Google OAuth Client ID — redirect URI wskazuje na Vercel URL
- [ ] Repo sklonowane, `npm install`, `npm run dev` — aplikacja startuje
- [ ] `.env.local` skonfigurowany (nie w repo!)
- [ ] Hotspot telefonu przetestowany jako backup internetu
- [ ] Ładowarka, mysz (opcjonalnie), powerbank

## Checklista — po hackathonie

- [ ] Wyloguj się ze wszystkich serwisów w profilu hackathonowym
- [ ] Usuń konto Windows `Hackathon` (jeśli tworzone) — po uzgodnieniu z właścicielem
- [ ] Usuń profil przeglądarki (alternatywa)
- [ ] Rozważ rotację kluczy OAuth / tokenów jeśli były współdzielone
- [ ] Zdecyduj: repo zostaje u kogoś z zespołu, projekt Vercel/Supabase — kto adminem

---

## TODO / do rozbudowy

- [ ] Konkretne wersje Node.js i komendy instalacji (winget/chocolatey)
- [ ] Tutorial Google OAuth krok po kroku ze screenami
- [x] Link do repo template / boilerplate zespołu — **ten repo (root)**
- [ ] Procedura dodawania współpracowników do Vercel i Supabase
- [ ] Backup: co zrobić gdy laptop padnie (push na GitHub co godzinę)
