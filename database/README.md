# Database

SQLite database used by the API. The file is generated at `database/data/coys.sqlite` and is
git-ignored. No SQLite CLI is required: the scripts use `better-sqlite3`.

## Contents

```text
database/
├── migrations/   001_create_projects.sql (numbered, applied in name order)
├── seed/         dev-data.sql · edge-cases.sql
└── data/         generated at runtime (git-ignored)
```

- **Migrations** are plain numbered `.sql` files. Never edit one after it has been merged;
  add the next number instead (for example `002_add_services.sql`).
- **`dev-data.sql`** loads 5 projects with fixed UUIDs. QA tests depend on those IDs.
- **`edge-cases.sql`** loads 5 extra rows: accents/quotes, SQL-injection text, maximum lengths,
  empty arrays and a 100-character slug.

## Commands (run from `server/`)

| Command | What it does |
|---|---|
| `npm run db:reset` | Deletes the database, applies every migration and loads `dev-data.sql` |
| `npm run db:reset -- --empty` | Same, but leaves the table empty |
| `npm run db:seed:edge` | Adds `edge-cases.sql` on top of the current data |
| `npm run db:break` | Drops the `projects` table to provoke a 500 |

`db:reset` is idempotent: running it twice in a row leaves the same known state. Always restore
the database with `db:reset` after an empty-state or server-error test.

## Inspecting the data

Any SQLite client can open `database/data/coys.sqlite` (for example DBeaver). The connection uses
`PRAGMA foreign_keys = ON`; uniqueness and `CHECK` constraints are enforced by the database itself.
