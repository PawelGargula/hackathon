# Hackathon dla Małopolski — specyfikacje

Zestaw dokumentów przygotowawczych do **Hackathonu dla Małopolski** (30–31 maja 2026, Hotel Ibis, Nowy Sącz).

Cel: zebrać w jednym miejscu wiedzę o wydarzeniu, setupie laptopa, stacku technologicznym, strategii deployu i operacyjnym planie na 48h hackathonu. Dokumenty zaczynają od esencji — będziemy je rozbudowywać w miarę zbliżania się do wydarzenia.

## Zespół

| Parametr         | Wartość                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------- |
| Wielkość         | 3 osoby (+ ewentualnie dołożona osoba)                                                  |
| Ścieżka startowa | **Dostępny transport dla każdego** (niewiążąca — można zmienić po briefie / z mentorem) |

## Mapa dokumentów

| Dokument                                                   | Opis                                          | Status                   |
| ---------------------------------------------------------- | --------------------------------------------- | ------------------------ |
| [01-hackathon-context.md](./01-hackathon-context.md)       | Wydarzenie, agenda, wyzwania, mentoring       | Szkic                    |
| [02-project-idea.md](./02-project-idea.md)                 | Pomysł projektu, MVP, wybór ścieżki           | Szkic                    |
| [03-laptop-setup.md](./03-laptop-setup.md)                 | Setup Windows, narzędzia, konta, checklisty   | Szkic                    |
| [04-deployment-demo.md](./04-deployment-demo.md)           | Vercel, Supabase, OAuth, QR, fallback         | Szkic                    |
| [05-tech-stack.md](./05-tech-stack.md)                     | Next.js, Auth.js, Prisma, Tailwind, shadcn/ui | Gotowy (template w repo) |
| [06-hackathon-playbook.md](./06-hackathon-playbook.md)     | Timeline 48h, role, prezentacja, ryzyka       | Szkic                    |
| [07-laptop-smoke-test.md](./07-laptop-smoke-test.md)       | Dress rehearsal laptopa (~30 min)             | Szkic                    |
| [08-jedzmy-sadeckie-spec.md](./08-jedzmy-sadeckie-spec.md) | Finalna specyfikacja projektu JedźMY Sądeckie | Szkic                    |

## Źródła surowe

- [page.md](./page.md) — treść ze strony wydarzenia (wyzwania, mentorzy, program)
- [newest-agenda.md](./newest-agenda.md) — agenda w skrócie
- [regulamin.md](./regulamin.md) — regulamin wydarzenia (kryteria jury, zasady uczestnictwa)

## Następne kroki (przed 30.05)

- [ ] Przeczytać skrót regulaminu w [01-hackathon-context.md](./01-hackathon-context.md) (kryteria jury, **3+3 min** pitch)
- [ ] Skonfigurować pożyczony laptop według [03-laptop-setup.md](./03-laptop-setup.md)
- [ ] Smoke test laptopa (~30 min): [07-laptop-smoke-test.md](./07-laptop-smoke-test.md)
- [x] Przygotować boilerplate Next.js według [05-tech-stack.md](./05-tech-stack.md) — **template w root repo**, setup: [../README.md](../README.md)
- [ ] Uzupełnić env vars (Google OAuth, Supabase) i pierwszy deploy na Vercel
- [ ] Przeglądnąć wyzwania i przygotować 2–3 kierunki pomysłu w [02-project-idea.md](./02-project-idea.md)
- [ ] Przeczytać [06-hackathon-playbook.md](./06-hackathon-playbook.md) z całym zespołem
- [ ] Hotspot telefonu jako backup internetu

## Zależności między dokumentami

```
README (ten plik)
├── 01-hackathon-context ──► 02-project-idea
├── 05-tech-stack ──► 03-laptop-setup ──► 07-laptop-smoke-test
├── 05-tech-stack ──► 04-deployment-demo
└── 02 + 03 + 04 ──► 06-hackathon-playbook
```
