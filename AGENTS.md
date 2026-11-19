# AGENTS.md — rules for the coding agent

Read this file, `docs/constitution.md` and the current task brief in `docs/tasks/` before doing anything.

## Project
COYS: a REST API (Node.js + Express, JavaScript ES Modules) with PostgreSQL on Supabase. Graded for the course *Web Services Programming*. The professor's requirements are in `docs/reference/professor-requirements.md`.

## Rules
1. Work on **one task at a time**, on its own branch. Do exactly what the brief says; anything else is out of scope. If a task seems to need more, **ask first**.
2. **Language:** all code, comments, file names, commits and docs in English.
3. **Architecture:** Route -> Controller -> Service -> Repository -> PostgreSQL. Use classes. Follow `docs/architecture.md` and `docs/development-standards.md`.
4. **API contract:** follow `docs/api-design.md` exactly (paths, fields, status codes, error format).
5. **Database:** Supabase is used ONLY as PostgreSQL through the `pg` driver. Do NOT use `supabase-js` or Supabase's auto-generated API. All SQL is parameterized. Schema changes are new files in `database/migrations/`.
6. **Dependencies:** do not install any package that is not in the task brief or `docs/decisions.md`. Ask first.
7. **Secrets:** never write real credentials anywhere. Use `.env` (ignored) and `.env.example`.
8. **Git:** conventional commits in English; never run `git push`; never merge. Open nothing on `main` directly.
9. **Do not edit** `docs/constitution.md` or `AGENTS.md`. Propose changes in your report instead.
10. **No extras:** no features, folders or files that were not requested. Do not create `e2e/`, `api-tests/` or `client/` code before their sprint.
11. Before finishing, run lint and the checks named in the brief, and report results honestly, including anything you are unsure about.

## Final report format
Files changed · commands run and their results · acceptance criteria checked (yes/no each) · open doubts.
