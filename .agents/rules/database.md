# Database rules

Schema, constraints, seeds and ER diagram live in `docs/context/database-structure.md` (single source
of truth). This file says **how to write code** against it.

## Connection (`db/database.js`)

- `better-sqlite3`, path from `config.databasePath`. Create the parent folder if missing.
- On open: `PRAGMA foreign_keys = ON`. Export one connection, created once and injected (see architecture).
- `server.js` closes the connection on `SIGINT`/`SIGTERM`.

## Repository rules

- All SQL lives in `repositories/`. Controllers and services never see SQL.
- **Prepared statements with `?` placeholders only.** Never concatenate or template user input into SQL.
- Methods are `async`, return plain domain objects (camelCase), never raw rows.
- `toProject(row)` mapper: snake_case → camelCase, `JSON.parse(technologies)`; the inverse on write
  (`JSON.stringify`). `NULL` columns are returned as `null`.
- `findAll({ status, limit, offset })` → `{ rows, total }` with a deterministic
  `ORDER BY created_at DESC, id ASC`; build the optional `status` filter with a fixed SQL fragment
  (never from user text) plus a bound parameter.
- Write methods: `create(project)`, `replace(id, data)` (sets `updated_at` via
  `strftime('%Y-%m-%dT%H:%M:%fZ','now')`; returns `null` if `changes === 0`), `deleteById(id)` → boolean.
- Catch only `err.code === 'SQLITE_CONSTRAINT_UNIQUE'` (slug) and throw `ConflictError`; rethrow the rest.
- IDs are generated in the **service** with `crypto.randomUUID()`.

## Scripts (`server/scripts/`)

| Script | Behavior |
|---|---|
| `db-reset.js` | delete the DB file → apply every `database/migrations/*.sql` in name order → load `database/seed/dev-data.sql` (skip with `--empty`). Idempotent: runnable twice in a row |
| `db-seed-edge.js` | execute `database/seed/edge-cases.sql` on the current DB |
| `db-break.js` | `DROP TABLE projects` — only to provoke the 500 test; repair with `db:reset` |

Scripts use `better-sqlite3`'s `db.exec()`; they never need the `sqlite3` CLI. Migrations are plain `.sql`
files, numbered, never edited after being merged (add `002_...` instead).
