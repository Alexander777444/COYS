# PROJECT-STATUS — COYS

**Snapshot date:** 2026-11-23
**Branch:** `main` (all modules M0–M5 merged)
**Last code commit on main:** `800f70e` (merge of PR #9)
**Source of truth for phases and gates:** `docs/plan/roadmap.md`

## Current state

The MVP is **frozen and stable** (Gate G3 passed). Nothing from M6 (frontend) has started.

| Item | Status |
|---|---|
| M0 Foundation | ✅ Merged (G0 passed) |
| M1 Auth | ✅ Merged (G1 passed) |
| M2 Projects read | ✅ Merged (G1 passed) |
| M3 Projects write | ✅ Merged (G2 passed) |
| M4 QA suite | ✅ Merged |
| M5 Docs | ✅ Merged (G3 = MVP frozen) |
| M6a Reader role | ⬜ Not started (gated, optional) |
| M6b Admin console | ⬜ Not started (gated, optional) |
| M6c Public site | ⬜ Not started (gated, optional) |
| Gate G4 | ⬜ Pending |

Legend: ⬜ todo · 🟡 in progress · 🔎 waiting developer review · ✅ merged by developer.

## What exists

- **API** (Express 5, ES Modules, SQLite via `better-sqlite3`): `GET /health`, `POST /api/v1/auth/login`,
  and the 5 `/api/v1/projects` endpoints (list, get by id, create, PUT, delete) with every status code
  required by the professor (200/201/204/400/401/404/409/500).
- **Layers:** routes → `authenticate` → `validate` (Zod) → controller → service → repository; objects wired
  in one composition root (`server/src/routes/index.js`); single error envelope via `errorHandler`.
- **Database:** migration `001_create_projects.sql`, deterministic dev seed (5 projects), edge-case seed,
  scripts `db:reset`, `db:reset -- --empty`, `db:seed:edge`, `db:break`.
- **QA (Bruno):** collection in `api-tests/` (`main`, `edge`, `empty-state`, `server-error`) covering the
  24 required cases: 61 requests, 196 assertions, two full passes green (see `docs/qa/bug-log.md`).
- **Documentation:** `docs/openapi.yaml` served by Swagger UI at `/api-docs`; 5 Mermaid diagrams in
  `docs/diagrams/` and the README; `docs/qa/test-plan.md` and `bug-log.md`; study guides in `docs/study/`.

## What does not exist yet

- CI pipeline (`.github/workflows/` only contains `.gitkeep`).
- Playwright tests (`e2e/` does not exist); automation is Bruno only.
- Frontend: `client/` is only a React + Vite scaffold (design tokens and a starter `App.jsx`).
- Reader role / 403, users table, PATCH, deployment (all post-MVP).

## Latest verification (2026-11-23, manual)

After `npm run db:reset` (5 rows) and `npm start`:

| Check | Result |
|---|---|
| `GET /health` | 200 |
| `GET /api-docs/` | 200 |
| Login with `.env` credentials | 200, token returned |
| `GET /api/v1/projects` without token | 401 |
| `GET /api/v1/projects` with token | 200, `meta.total` = 5 |
| `GET /api/v1/projects/xyz` with token | 400 |
| `GET /api/v1/projects/<unknown uuid>` with token | 404 |

The Bruno suite was not re-run on this date.

## Known constraints and risks

- **Node version:** verified on Node **20.20.2**. `better-sqlite3` is pinned to `^11.10.0` because v13
  requires Node ≥22 (ENV-03 in the bug log).
- **Local environment:** `server/.env` is git-ignored. A fresh clone must copy `server/.env.example`
  to `server/.env` and replace the placeholders.
- **Test data lifecycle:** after `db:break` the API answers 500 until `npm run db:reset` is run with the
  server stopped (ENV-02).
- **Professor confirmation:** Node.js + SQLite instead of Java + MySQL, the presentation date and how
  requirement 10 is graded remain unconfirmed in `docs/context/professor-requirements.md`.

## Next actions

1. Study and rehearse the presentation (stack, layers, flow of a POST, status codes, Swagger, Bruno, DBeaver).
2. Optional QA extra: a CI pipeline that runs the Bruno suite and fails the build on a failed test.
3. Optional, only if time remains: minimal frontend (M6), always after G3 and never at the cost of the MVP.

## Key links

- `PROJECT-CONTEXT.md` — project context and fixed stack.
- `docs/plan/roadmap.md` — phases, gates and module status.
- `docs/context/api-contract.md` — endpoint and status-code contract.
- `docs/context/database-structure.md` — schema, seeds and edge data.
- `docs/qa/test-plan.md` — 24-case QA matrix and run order.
- `docs/openapi.yaml` — OpenAPI 3.0.3 specification.
