# Testing (QA role)

The QA role is the graded "professional context". Tests are a deliverable, not an afterthought.
Matrix and procedures: `docs/qa/test-plan.md`. How to write them: skill `write-tests`.

## Layers

| Layer | Tool | Where | Purpose |
|---|---|---|---|
| API contract (primary) | **Bruno** + `bru run` | `api-tests/` | the 24 required endpoint × status-code cases + extras; used in the live demo |
| API smoke (automation) | **Playwright** `request` fixture | `e2e/api/` | small fast suite (health, login, auth guard, CRUD happy path) runnable with one command |
| UI end-to-end | **Playwright** | `e2e/ui/` | only after the MVP gate, only if `client/` exists |

## Rules

1. Every test targets exactly one behavior and is named `<ENDPOINT>-<STATUS>-<NN>`
   (e.g. `GET-LIST-400-01`, `POST-409-01`). Same ID appears in `test-plan.md`.
2. **Deterministic:** tests start from a known DB (`npm run db:reset`). Use the fixed seed IDs in
   `database-structure.md`.
3. **Independent:** a mutating test creates its own data (unique slug such as `qa-<timestamp>`) and
   never depends on another test's leftovers. Never delete or edit the seed rows.
4. Every test asserts at least the **status code** and the **error `code`** (for errors) or the
   **response shape** (for successes).
5. Auth cases (401) are tested on **every** endpoint, including GETs.
6. Special runs: *empty state* (`db:reset -- --empty`) and *server error* (`db:break`) are separate
   folders/runs because they need a different DB state. Always restore with `db:reset`.
7. A failing test is a result: record it in `docs/qa/bug-log.md`; do not weaken the assertion to pass.
8. Evidence: paste the run summary (passed/failed counts) in your report.

## Run order (full QA pass)

```
cd server && npm run db:reset && (start server: npm run dev)
cd api-tests && bru run main --env local        # main folders
cd server && npm run db:reset -- --empty        # restart server not required
cd api-tests && bru run empty-state --env local
cd server && npm run db:break
cd api-tests && bru run server-error --env local
cd server && npm run db:reset                   # restore
cd e2e && npx playwright test api               # smoke
```
