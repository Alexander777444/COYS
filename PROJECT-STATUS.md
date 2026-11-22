# PROJECT-STATUS — COYS

**Snapshot date:** 2026-11-22
**Branch:** `feat/m0-foundation`
**Last code commit:** `2fd47bd` (M0 foundation complete)
**Working tree:** expects to be clean after this documentation commit
**Push / merge:** not done — the developer reviews every diff

## Current module

| Item | Status |
|---|---|
| M0 Foundation | 🔎 Implementation complete, waiting developer review |
| Gate G0 | ⬜ Pending (only the developer ticks gates) |
| M1 Auth | ⬜ Not started |
| M2 Projects read | ⬜ Not started |
| M3 Projects write | ⬜ Not started |
| M4 QA suite | ⬜ Not started |
| M5 Docs | ⬜ Not started |
| M6a Reader role | ⬜ Gated after G3 |
| M6b Admin console | ⬜ Gated after G3 |
| M6c Public site | ⬜ Gated after G3 |

Legend: ⬜ todo · 🟡 in progress · 🔎 waiting developer review · ✅ merged by developer.

## What M0 delivers

- Express 5 application with the documented middleware order:
  `helmet -> cors -> express.json({ limit: '100kb' }) -> /health -> routes -> notFound -> errorHandler`.
- Validated environment (`config/env.js`); startup fails clearly on missing or short values.
- SQLite connection (`db/database.js`) using `better-sqlite3`, with `PRAGMA foreign_keys = ON`.
- Migration `001_create_projects.sql` with length checks, allowed statuses, JSON validation and
  `UNIQUE slug` (the future 409).
- Deterministic dev seeds (5 fixed-UUID projects) and edge-case seeds (accents, SQL-injection
  text, max lengths, empty arrays, 100-character slug).
- Database scripts: `db:reset`, `db:reset -- --empty`, `db:seed:edge`, `db:break`.
- Error classes (`AppError`, `ValidationError`, `UnauthorizedError`, `NotFoundError`,
  `ConflictError`).
- Global `notFound` and `errorHandler`; standard envelope for 400/401/404/409/500.
- `GET /health` returning `200 {"status":"ok"}`.
- Graceful shutdown: `SIGINT` / `SIGTERM` close the HTTP server and the SQLite connection.
- Root `README.md`, `database/README.md` and English `PROJECT-CONTEXT.md`.

## What does not exist yet

- `POST /api/v1/auth/login` and the `authenticate` middleware (M1).
- `/api/v1/projects` CRUD, Zod schemas, repositories, services and controllers (M2 / M3).
- Bruno collection and Playwright tests (M4).
- OpenAPI YAML, Swagger UI and diagrams (M5).
- React admin console and public site (M6, gated after G3).
- CI/CD and deployment (out of MVP scope).

## Verification evidence (M0)

| Criterion | Result |
|---|---|
| A1 missing `JWT_SECRET` | Clear error message, exit code 1 |
| A2 `db:reset` twice in a row | `Applied migration...` + `Loaded dev data: 5 rows` both times |
| A3 `db:reset -- --empty` | 0 rows; then `db:seed:edge` leaves 5 edge rows |
| A4 duplicate slug insert | `SQLITE_CONSTRAINT_UNIQUE` |
| A5 `GET /health` | 200 `{"status":"ok"}` |
| A6 `GET /nope` | 404 `ROUTE_NOT_FOUND` envelope |
| A7 broken JSON body | 400 `INVALID_JSON` envelope |
| A8 body larger than 100 kb | 400 `PAYLOAD_TOO_LARGE` envelope |
| `db:break` + `db:reset` | Table dropped, then repaired with 5 seed rows |
| Edge lengths | Title 150, description 5000, slug 100 characters |

## Known constraints and risks

- **Node version:** verified on Node **20.20.2**. `better-sqlite3` is pinned to `^11.10.0` because
  v13 requires Node ≥22 and the machine has no Windows C++ SDK for a local build.
- **Professor confirmation:** Node.js + SQLite instead of Java + MySQL is still unconfirmed, as is
  the final presentation date and how requirement 10 is graded.
- **Local environment:** `server/.env` exists locally and is git-ignored. A fresh clone must copy
  `server/.env.example` to `server/.env` and replace the placeholders.
- **Tests:** the 24-case QA matrix has not been executed yet; the test plan is ready, the suite
  belongs to M4.
- **Frontend:** not started and must not start before Gate G3.

## Next actions

1. Developer reviews the M0 diff and ticks **G0** in `docs/plan/roadmap.md` if it passes.
2. After G0, implement **M1 Auth** (`POST /api/v1/auth/login`, JWT, `authenticate`).
3. Then **M2 Projects read** and **M3 Projects write**.
4. Keep `docs/context/api-contract.md`, `docs/qa/test-plan.md` and the OpenAPI file in sync as
   behavior changes.
5. Ask the professor the open questions listed in `PROJECT-CONTEXT.md` and the roadmap.

## Key links

- `PROJECT-CONTEXT.md` — full project context and fixed stack.
- `docs/plan/roadmap.md` — living phases, gates and module status.
- `docs/specs/M0-foundation.md` — M0 scope and acceptance criteria.
- `docs/context/api-contract.md` — endpoint and status-code contract.
- `docs/context/database-structure.md` — schema, seeds and edge data.
- `docs/qa/test-plan.md` — 24-case QA matrix and run order.
