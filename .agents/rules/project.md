# Project — COYS

Always applies. Read before doing anything.

## Stack (fixed)

| Layer | Choice |
|---|---|
| Runtime | Node.js 20+ |
| Language | JavaScript, ES Modules (`"type": "module"`), classes for the layers |
| Framework | Express 5 |
| Database | SQLite via `better-sqlite3` (file on disk) |
| Validation | Zod (v4 API: use `z.uuid()`, `z.url()`) |
| Auth | JWT (`jsonwebtoken`, HS256) |
| API docs | OpenAPI 3.0.3 YAML + `swagger-ui-express` |
| API tests | Bruno (collection in `api-tests/`, CLI `bru run`) |

## Allowed dependencies (server)

`express`, `cors`, `helmet`, `dotenv`, `zod`, `jsonwebtoken`, `better-sqlite3`,
`swagger-ui-express`, `yaml`. Anything else needs the developer's approval.
`pg` is NOT used (remove it if present).

## Folder layout

```
AGENTS.md
.agents/rules/        workflow, project, architecture, auth, database, errors, testing, frontend
.agents/skills/       create-module/SKILL.md, write-tests/SKILL.md
server/
  src/  app.js · server.js · config/env.js · db/database.js · errors/ · middlewares/
        models/ (Zod) · repositories/ · services/ · controllers/ · routes/
  scripts/            db-reset.js · db-seed-edge.js · db-break.js
database/             migrations/ · seed/ · data/ (generated, git-ignored)
api-tests/            Bruno collection (main/ · empty-state/ · server-error/)
e2e/                  Playwright (api/ always; ui/ only after MVP gate)
client/               React + Vite: public site + admin console (GATED, see rules/frontend.md)
docs/
  context/            code-structure · database-structure · api-contract · screens · design-system · design-reference · decisions · professor-requirements
  plan/roadmap.md     phases, gates, status tracker
  specs/              one spec per module (M0–M6)
  qa/                 test-plan.md · bug-log.md
  openapi.yaml        (created in M5)
```

## Commands (run from `server/`)

| Command | Purpose |
|---|---|
| `npm run dev` | start with auto-reload |
| `npm start` | start without reload |
| `npm run db:reset` | delete DB file, apply migrations, load `dev-data.sql` |
| `npm run db:reset -- --empty` | same but without seed (empty table) |
| `npm run db:seed:edge` | add `edge-cases.sql` rows on top of current data |
| `npm run db:break` | drop the `projects` table to provoke a 500 (repair with `db:reset`) |

From `e2e/` (after M4): `npx playwright test api`. From `api-tests/`: `bru run main --env local`.

## Environment variables (`server/.env.example`)

| Var | Example | Notes |
|---|---|---|
| `PORT` | `3000` | |
| `DATABASE_PATH` | `../database/data/coys.sqlite` | relative to `server/` |
| `JWT_SECRET` | 32+ chars | required, server refuses to start without it |
| `JWT_EXPIRES_IN` | `1h` | |
| `API_USERNAME` | `admin` | the single API user |
| `API_PASSWORD` | `change-me` | required |

`config/env.js` validates all of them at startup and throws a clear error if one is missing.
Never read `process.env` anywhere else.

## Scope

**In (MVP):** `/api/v1/projects` CRUD (5 endpoints), `POST /api/v1/auth/login`, `GET /health`,
SQLite DB + seeds + reset, Bruno suite for the 24 required status-code cases, OpenAPI + Swagger UI,
diagrams, QA documents. **MVP freeze (Gate G3): Saturday. Frontend: Sunday, only if G3 passed.**

**Out (do not build):** frontend, other resources, users table, roles/403, refresh tokens,
rate limiting, pagination beyond `limit/offset`, Docker, CI/CD, deployment, ORMs.

## Boundaries

- **Ask first:** new dependency, changing a status code, changing the error envelope or any
  response shape, adding an endpoint not in `docs/context/api-contract.md`.
- **Never:** SQL outside repositories, string-concatenated SQL, business logic in controllers,
  `process.env` outside `config/env.js`, `console.log` of secrets, committing `.env` or `.sqlite`.
