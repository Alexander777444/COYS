# M0 — Foundation

**Branch:** `feat/m0-foundation` · **Depends on:** — · **Gate:** G0
**Read first:** `rules/project.md`, `architecture.md`, `database.md`, `errors.md`, `docs/context/database-structure.md`

## Goal
A runnable server skeleton: validated config, SQLite connection, migration + seeds + reset scripts,
error classes and global handlers.

## Scope (in)
`config/env.js` · `db/database.js` · migration · seeds · 3 scripts · `errors/*` · `notFound` + `errorHandler`
· `app.js` wiring order · `server.js` · `.env.example` · `.gitignore` · `database/README.md` · root `README.md`.

## Out of scope
Auth, projects endpoints, Zod schemas, tests, OpenAPI.

## Tasks
- [x] T1 Install `better-sqlite3`; remove `pg` and `db/pool.js`; update `package.json` scripts (`db:reset`, `db:seed:edge`, `db:break`)
- [x] T2 `config/env.js`: read + validate env (see `project.md`), throw a clear error on missing/short `JWT_SECRET`; update `.env.example`
- [x] T3 `db/database.js` + `database/migrations/001_create_projects.sql` (copy from `database-structure.md`)
- [x] T4 `database/seed/dev-data.sql` and `edge-cases.sql` exactly as in `database-structure.md`
- [x] T5 `scripts/db-reset.js`, `db-seed-edge.js`, `db-break.js` (behavior in `rules/database.md`)
- [x] T6 `errors/` classes (`rules/errors.md`)
- [x] T7 `middlewares/notFound.js`, `errorHandler.js`; wire `app.js` in the order from `architecture.md`; `server.js` closes the DB on SIGINT
- [x] T8 `.gitignore` (`database/data/`), `database/README.md`, root `README.md` (what it is, how to run, folder map)

## Acceptance criteria
- [x] A1 Removing `JWT_SECRET` makes `npm start` exit with a clear message
- [x] A2 `npm run db:reset` twice in a row succeeds and the table has 5 rows (verify with a one-line script or DBeaver)
- [x] A3 `npm run db:reset -- --empty` leaves 0 rows; `db:seed:edge` adds 5 rows
- [x] A4 Inserting a duplicate slug directly fails with `SQLITE_CONSTRAINT_UNIQUE`
- [x] A5 `curl -i localhost:3000/health` → 200 `{"status":"ok"}`
- [x] A6 `curl -i localhost:3000/nope` → 404 envelope `ROUTE_NOT_FOUND`
- [x] A7 `curl -i -X POST localhost:3000/nope -H 'Content-Type: application/json' -d '{bad'` → 400 `INVALID_JSON`
- [x] A8 A body > 100 kb → 400 `PAYLOAD_TOO_LARGE`
