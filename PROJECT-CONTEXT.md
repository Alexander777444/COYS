# Studio Portfolio API — Project context

**Project:** COYS — Studio Portfolio API
**Type:** Individual final project for the Web Services Programming course
**Professional role (requirement 10):** Quality Assurance & Testing
**Snapshot date:** 2026-11-22
**Living plan, gates and module status:** `docs/plan/roadmap.md`

## 1. What this project is

A REST API that manages the content of a software studio's website: portfolio projects,
and later services and client inquiries. It is the backend (headless CMS) that will feed the
studio website.

```
[React + Vite website]  ->  consumes  ->  [Node.js REST API]  ->  [SQLite]
        (later client, gated)                  (graded project)
```

The API is the graded deliverable. The React client is developed only after the MVP gate.

## 2. Current status (snapshot)

| Item | Value |
|---|---|
| Branch | `feat/m0-foundation` |
| Current module | **M0 Foundation** — implementation complete, waiting developer review |
| Gate G0 | Pending (only the developer ticks gates) |
| M1–M3 | Not started |
| Tests | Not implemented (module M4) |
| OpenAPI / Swagger | Not implemented (module M5) |
| Frontend | Not started (gated behind Gate G3) |
| Database | SQLite file at `database/data/coys.sqlite` (git-ignored) |

M0 delivered the runnable foundation: validated environment, SQLite connection, migration,
deterministic seeds, reset/seed/break scripts, error classes, global 404/error handlers,
`GET /health`, and the project documentation. All M0 acceptance criteria were verified; see
`PROJECT-STATUS.md` for the evidence summary.

## 3. Professor requirements

### Must-have

| # | Requirement |
|---|---|
| 1 | REST API with CRUD, worth **35 %** of the final grade |
| 2 | Minimum **5 web services**: GET list, GET by id, POST, PUT (or PATCH), DELETE |
| 3 | All code (classes, methods, parameters) in **English** |
| 4 | Data comes from a **database** |
| 5 | Correct **OOP** |
| 6 | **Resource Oriented Design** |
| 7 | **YAML** documentation (OpenAPI) |
| 8 | Documentation with **diagrams** |
| 9 | Correct **HTTP status codes** |
| 10 | **Professional context**: at least one role plus standard industry tasks; ours is **Quality Assurance & Testing** |
| 11 | 10-minute presentation: 5 minutes free, 5 minutes of Q&A about the code |
| 12 | Presenting in English gives **+10 points** |

### Required status codes

| Endpoint | Codes |
|---|---|
| GET (list) | 200 / 400 / 401 / 500 |
| GET (by id) | 200 / 400 / 401 / 404 / 500 |
| POST | 201 / 400 / 401 / 409 / 500 |
| PUT | 200 / 400 / 401 / 404 / 500 |
| DELETE | 204 / 400 / 401 / 404 / 500 |

The **401 applies to the GETs too**: the whole API requires authentication.

## 4. Scope

### In the MVP

- Full CRUD for the main resource: `/api/v1/projects` (5 endpoints).
- `POST /api/v1/auth/login` and `GET /health`.
- SQLite database with migrations, deterministic seeds and reset scripts.
- Validation (400), authentication (401), not found (404), conflict (409), server error (500).
- Bruno contract suite for the 24 required endpoint × status-code cases.
- OpenAPI 3.0.3 YAML, Swagger UI, diagrams and README.
- QA documentation: test plan, bug log and edge-case data.

### Out of the MVP (do not build before Gate G3)

- Frontend (React public site and admin console).
- Extra resources: `/services`, `/inquiries`, `/testimonials`.
- Users table, roles, `403`, refresh tokens.
- Rate limiting, pagination beyond `limit` / `offset`.
- Docker, CI/CD and production deployment.
- ORMs and TypeScript.

### Post-MVP, explicitly gated

- **M6a** reader role: read-only credential, only `PUBLISHED` projects, `403` on writes.
- **M6b** admin console.
- **M6c** public website.

## 5. Fixed stack

| Layer | Choice | Why |
|---|---|---|
| Runtime | **Node.js 20+** | One language across the stack |
| Language | **JavaScript, ES Modules**, classes for the layers | The professor grades OOP; plain JS keeps the code explainable |
| Framework | **Express 5** | Lightweight and standard |
| Database | **SQLite** via `better-sqlite3` | Relational SQL, zero setup, reset = recreate one file |
| Validation | **Zod v4** | Produces every 400 in one place |
| Auth | **JWT** (`jsonwebtoken`, HS256), single API user from env | Enough to produce 401 everywhere |
| API docs | **OpenAPI 3.0.3 YAML** + `swagger-ui-express` | Professor requirement |
| API tests | **Bruno** (`bru run`) | Contract suite used in the live demo |
| Automation | **Playwright** | API smoke now; UI only after Gate G3 |
| Security | `helmet`, `cors`, `dotenv` | Standard good practices |

Allowed server dependencies: `express`, `cors`, `helmet`, `dotenv`, `zod`, `jsonwebtoken`,
`better-sqlite3`, `swagger-ui-express`, `yaml`. Anything else needs developer approval.
`pg` is not used.

## 6. Architecture

Request flow:

```
Route -> authenticate -> validate (Zod) -> Controller -> Service -> Repository -> SQLite
                                              |
                                              +--> errors -> errorHandler
```

| Layer | Responsibility | Must not |
|---|---|---|
| Route | Map method + path to middlewares and one controller method | Contain logic |
| Middleware | Cross-cutting concerns: auth, validation, errors | Talk to the database |
| Controller | Read `req.validated`, call one service method, set status and send | Contain business rules or SQL |
| Service | Business rules: generate IDs, decide 404, orchestrate repositories | Know about `req` / `res` |
| Repository | SQL with prepared statements, row ↔ domain mapping, DB error translation | Contain business rules or HTTP |

Controllers, services and repositories are **classes** with constructor injection and `#private`
fields. Wiring happens in one composition root: `server/src/routes/index.js` in later modules.

Folder map:

```text
COYS/
├── server/
│   ├── src/        app.js · server.js · config/ · db/ · errors/ · middlewares/
│   │               models/ · repositories/ · services/ · controllers/ · routes/
│   ├── scripts/    db-reset.js · db-seed-edge.js · db-break.js
│   └── .env.example
├── database/       migrations/ · seed/ · data/ (generated, git-ignored)
├── api-tests/      Bruno collection (module M4)
├── e2e/            Playwright API/UI tests (module M4)
├── client/         React client (gated, after Gate G3)
├── docs/           plan/ · specs/ · context/ · qa/
└── .agents/        rules/ · skills/
```

## 7. Data model

One MVP table: `projects`.

| Field | Type | Notes |
|---|---|---|
| `id` | TEXT PK | UUID generated by the service |
| `title` | TEXT | Required, 1–150 |
| `slug` | TEXT UNIQUE | Required, 1–100; source of the 409 |
| `description` | TEXT | Required, 1–5000 |
| `client_name` | TEXT | Optional |
| `technologies` | TEXT | JSON array text, default `[]` |
| `project_url` | TEXT | Optional, valid `http(s)` URL |
| `repository_url` | TEXT | Optional, valid `http(s)` URL |
| `status` | TEXT | `DRAFT` \| `PUBLISHED` \| `ARCHIVED`, default `DRAFT` |
| `created_at` / `updated_at` | TEXT | ISO-8601 UTC |

The database enforces `UNIQUE slug`, length checks, valid JSON for `technologies` and the allowed
statuses. Schema, seeds and edge cases are defined in `docs/context/database-structure.md`.

- **Dev seed:** 5 projects with fixed UUIDs (`...0001`–`...0005`) and explicit timestamps.
- **Edge seed:** accents/quotes, SQL-injection text, 150/5000-character fields, empty arrays,
  100-character slug (`...0101`–`...0105`).
- **Valid but missing UUID for 404 tests:** `00000000-0000-4000-8000-0000000000ff`.
- **Malformed id for 400 tests:** `not-a-uuid`.

## 8. Endpoints and HTTP status codes

Base path `/api/v1`. JSON only, camelCase fields.

| Method | Path | Auth | Success | Purpose |
|---|---|---|---|---|
| GET | `/health` | Public | 200 | Liveness |
| POST | `/api/v1/auth/login` | Public | 200 | Get a JWT |
| GET | `/api/v1/projects` | Yes | 200 | List with filter + pagination |
| GET | `/api/v1/projects/{id}` | Yes | 200 | Detail |
| POST | `/api/v1/projects` | Yes | 201 + `Location` | Create |
| PUT | `/api/v1/projects/{id}` | Yes | 200 | Full replacement |
| DELETE | `/api/v1/projects/{id}` | Yes | 204, no body | Delete |

Triggers:

| Code | Trigger |
|---|---|
| 400 | Invalid UUID, invalid body/query, broken JSON (`INVALID_JSON`), body > 100 kb (`PAYLOAD_TOO_LARGE`) |
| 401 | Missing, invalid or expired token (`MISSING_TOKEN`, `INVALID_TOKEN`, `TOKEN_EXPIRED`) |
| 404 | Valid UUID that does not exist, or unknown route (`ROUTE_NOT_FOUND`) |
| 409 | Duplicate `slug` on POST (and on PUT when it belongs to another project) |
| 500 | Unexpected failure such as an unavailable database (`INTERNAL_ERROR`) |

Order of checks: `authenticate (401) -> validate params (400) -> validate query/body (400) ->
service (404) -> repository (409)`. PUT is a full replacement; omitted optional fields reset to
defaults. Error responses always use the envelope in `.agents/rules/errors.md`.

## 9. Authentication

- Single API user from `API_USERNAME` / `API_PASSWORD`.
- `POST /api/v1/auth/login` returns a JWT signed with `JWT_SECRET` (HS256).
- Protected endpoints require `Authorization: Bearer <token>`.
- Missing/invalid/expired tokens produce 401 with `WWW-Authenticate: Bearer`.
- No users table and no roles in the MVP. The reader role and `403` belong to post-MVP M6a.

## 10. QA role (requirement 10)

Declared role: **Quality Assurance & Testing**.

- Bruno collection covers the 24 required endpoint × status-code cases plus extra edge cases.
- Playwright automates a small API smoke suite; UI tests only after Gate G3.
- `db:reset` guarantees a known database before every run; `db:seed:edge` adds edge data;
  `db:break` provokes the 500 cases.
- Every failure is recorded in `docs/qa/bug-log.md`.
- The full matrix and run order live in `docs/qa/test-plan.md`.

## 11. Plan, modules and gates

The roadmap is the living source of truth; this file only summarizes it.

| Module | Status |
|---|---|
| M0 Foundation | 🔎 implementation complete, waiting developer review |
| M1 Auth | ⬜ not started |
| M2 Projects read | ⬜ not started |
| M3 Projects write | ⬜ not started |
| M4 QA suite | ⬜ not started |
| M5 Docs | ⬜ not started |
| M6a Reader role | ⬜ after Gate G3 |
| M6b Admin console | ⬜ after Gate G3 |
| M6c Public site | ⬜ after Gate G3 |

Gates: **G0** foundation, **G1** auth + reads, **G2** full CRUD, **G3** QA + docs (MVP freeze),
**G4** frontend. Only the developer ticks gates after reviewing.

## 12. Documentation map

| Document | Purpose |
|---|---|
| `docs/plan/roadmap.md` | Phases, gates, module status and open items |
| `docs/specs/M0-foundation.md` … `M6c-public-site.md` | One spec per module |
| `docs/context/professor-requirements.md` | Authoritative professor requirements |
| `docs/context/api-contract.md` | Endpoints, payloads and status codes |
| `docs/context/database-structure.md` | Schema, seeds and edge data |
| `docs/context/code-structure.md` | Diagrams and request flow |
| `docs/context/decisions.md` | Architecture decision log |
| `docs/qa/test-plan.md` | 24-case matrix and QA procedures |
| `docs/qa/bug-log.md` | Defect log |
| `PROJECT-STATUS.md` | Current snapshot and verification evidence |

## 13. Open items (developer / professor)

- [ ] Message the professor: Is Node.js + SQLite accepted? What is the final presentation date?
      How is requirement 10 graded?
- [ ] Review M0 and tick Gate G0.
- [ ] Rehearse the 10-minute presentation in English (5 free + 5 Q&A on the code).
- [ ] Provide the studio name and hero copy for `client/src/config/site.js` (frontend, after G3).
- [ ] Confirm the admin visual style: bright workspace panels; danger red as the only extra hue.
- [ ] Ask for feedback on the October 26 progress presentation.

## 14. Deferred ideas (out of scope — do not build)

- Additional resources: `/services`, `/inquiries`, `/testimonials`.
- PATCH instead of PUT, and richer pagination/filtering.
- Reader/admin roles and a users table (M6a; Better Auth later).
- CI/CD, Docker, deployment.
- Frontend beyond the gated modules.

## 15. Engineering rules in one place

- Everything in the repository is **English**: code, comments, docs, UI text, commits.
- Plain JavaScript; no TypeScript and no ORM.
- Layered OOP; all SQL lives in repositories with prepared statements.
- `process.env` is read only in `server/src/config/env.js`.
- Specs are the source of truth; code follows specs, never the opposite.
- One branch per module, one commit per logical section, no pushes or merges by agents.
- Never commit `.env` or `.sqlite` files; never log secrets.
