# COYS — Studio Portfolio API

REST API that manages the portfolio projects of a software studio. It is the backend
(headless CMS) that will feed the studio website.

**Stack:** Node.js 20+ · Express 5 · plain JavaScript (ES Modules) · SQLite via `better-sqlite3`.

## Requirements

- Node.js 20 or newer (developed and verified with Node 20.20.2)
- npm

## Quick start

```bash
cd server
npm install
cp .env.example .env        # Windows PowerShell: Copy-Item .env.example .env
npm run db:reset
npm run dev
```

Before starting, replace `JWT_SECRET` (32+ characters) and `API_PASSWORD` in `server/.env`.
`npm start` runs the server without auto-reload.

- API: <http://localhost:3000>
- Liveness: `GET /health` → `200 {"status":"ok"}`
- All `/api/v1` endpoints require `Authorization: Bearer <token>` (added in module M1).

## Database commands (run from `server/`)

| Command | What it does |
|---|---|
| `npm run db:reset` | Delete the database, apply every migration, load `dev-data.sql` (5 rows) |
| `npm run db:reset -- --empty` | Same, but skip the seed (0 rows) |
| `npm run db:seed:edge` | Add the edge-case rows on top of the current data |
| `npm run db:break` | Drop the `projects` table to provoke a 500 (repair with `db:reset`) |

## Folder map

```text
COYS/
├── server/              Express app, config, DB connection, errors and scripts
│   ├── src/             config · db · errors · middlewares · (models, repositories,
│   │                    services, controllers, routes in later modules)
│   ├── scripts/         db-reset.js · db-seed-edge.js · db-break.js
│   └── .env.example
├── database/            migrations/ · seed/ · data/ (generated, git-ignored)
├── client/              React client (gated: after Gate G3, not part of the MVP)
├── docs/                plan/ · specs/ · context/ · qa/
└── .agents/             rules/ · skills/
```

## Documentation

- Roadmap and gates: `docs/plan/roadmap.md`
- API contract: `docs/context/api-contract.md`
- Database schema and seeds: `docs/context/database-structure.md`
- QA plan: `docs/qa/test-plan.md`
- Engineering rules: `.agents/rules/`

## Notes

- `.env` and `database/data/` are git-ignored; never commit credentials or `.sqlite` files.
- The professor grades the API. The React client is developed only after the MVP gate.
