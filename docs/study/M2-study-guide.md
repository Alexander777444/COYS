# M2 — Projects read · Study guide

What was built, why, and how to defend it. Companion of `docs/specs/M2-projects-read.md`.

## 1. Current status

| Item | Value |
|---|---|
| Branch | `feat/m2-projects-read` (from `main`, after the M1 merge `d1b8f77`) |
| HEAD before this guide | `b1cd687 feat(server): wire projects module into composition root` |
| Roadmap status | M2 = 🔎 (waiting developer review) |
| Gate | G1 **not ticked** (only the developer ticks gates) |
| Push / merge | Not done. Local commits only. |
| Next module | M3, only after an explicit "continue to M3" |

## 2. Files

### Created

| File | What it does | Why it exists |
|---|---|---|
| `server/src/models/project.schemas.js` | `projectIdParamsSchema` (`z.uuid()`) and `listProjectsQuerySchema` (`status` enum, `limit` 1–100 default 20, `offset` ≥ 0 default 0) | Input rules in one place; the list schema is **not** strict because the contract ignores unknown query params |
| `server/src/repositories/ProjectRepository.js` | `findAll({status, limit, offset})` → `{rows, total}`, `findById(id)` → object or `null`; `toProject(row)` mapper | All SQL for `projects`; the only layer that knows column names and that `technologies` is JSON text |
| `server/src/services/ProjectService.js` | `list()` builds `{data, meta}`, `getById()` throws `NotFoundError` when there is no row | Business rules: "not found means 404" is a decision, not a SQL detail |
| `server/src/controllers/ProjectController.js` | `list`, `getById`: read `req.validated`, one service call, 200 | HTTP in / HTTP out only |
| `server/src/routes/projects.routes.js` | `GET /` and `GET /:id` with `authenticate → validate → controller` | Route table; order guarantees 401 wins over 400 |

### Modified

| File | Change | Why |
|---|---|---|
| `server/src/routes/index.js` | Signature `createApiRouter({ db, config })`; builds `authenticate`, the projects repo → service → controller chain, mounts `/projects` | Composition root: one place where dependencies are created |
| `server/src/app.js` | Imports `db`, calls `createApiRouter({ db, config })` | The router needs the connection; `app.js` stays the only place that assembles the app |

### Deleted

Nothing.

### Key lines

- `project.schemas.js` — `z.coerce.number().int().min(1).max(100).default(20)`: query strings become
  numbers (`"2"` → `2`), and a missing value becomes the documented default.
- `ProjectRepository.findAll` — `const where = status ? ' WHERE status = ?' : ''`: the **SQL text**
  is chosen from two fixed strings; the user value only ever travels as a `?` parameter.
- `ProjectRepository.findAll` — two statements: `COUNT(*)` with the same `WHERE` (gives `meta.total`)
  and the page with `LIMIT ? OFFSET ?`.
- `ProjectRepository.toProject` — `JSON.parse(row.technologies)` and `client_name` → `clientName`:
  the mapper is the boundary between DB and API shapes.
- `ProjectService.getById` — `if (!project) throw new NotFoundError('Project', id)`: the repository
  answers "no row"; only the service knows that this means HTTP 404.
- `projects.routes.js` — `authenticate` comes before `validate`, so `GET /projects/not-a-uuid`
  without a token is 401, not 400.

## 3. How the pieces connect

```
GET /api/v1/projects?status=PUBLISHED&limit=2&offset=1
  app.js            app.use('/api/v1', createApiRouter({ db, config }))
  routes/index.js   router.use('/projects', createProjectRoutes(controller, authenticate))
  projects.routes   authenticate → validate({ query }) → controller.list
  authenticate      401 MISSING_TOKEN / INVALID_TOKEN / TOKEN_EXPIRED
  validate          Zod → req.validated.query = { status, limit: 2, offset: 1 }
  ProjectController.list → ProjectService.list(req.validated.query)
  ProjectService    → ProjectRepository.findAll({ status, limit, offset })
  ProjectRepository → SQLite: COUNT(*) … + SELECT … ORDER BY created_at DESC, id ASC LIMIT ? OFFSET ?
  service           → { data, meta: { total, limit, offset } }
  controller        → 200 JSON
```

`GET /api/v1/projects/{id}` is the same chain with `validate({ params })` and `getById`, which
returns 404 when the row does not exist.

## 4. Key ideas

1. **Layers answer different questions.** Repository: "is there a row?" Service: "what does that
   mean for the API?" *Analogy:* the warehouse says "we have none in stock"; the shop assistant
   decides to tell the customer "sold out".
2. **Two queries per page.** `COUNT(*)` for the total, then the page itself. *Analogy:* counting how
   many people are in the queue, then calling the next two — the count does not change because you
   only let two in.
3. **Fixed SQL, bound values.** The filter text is chosen in code; the value is a parameter.
   *Analogy:* a printed form with a blank line — you write on the line, you never rewrite the form.

## 5. What was NOT created in this module

- No `POST`, `PUT`, `DELETE`, no body schemas, no `ConflictError` (M3).
- No search text, no sorting options, no `PATCH`, no soft delete.
- No OpenAPI/Swagger (M5), no Bruno or Playwright tests (M4).
- No roles/403/reader visibility (post-MVP, M6a).
- `docs/qa/test-plan.md` unchanged: its LIST/GET rows are Bruno cases executed in M4.

## 6. Verification evidence

DB reset with `npm run db:reset` before the pass (5 rows). Token obtained from `/auth/login` with
`.env` credentials inside the shell; never printed.

| Criterion | Request | Real result |
|---|---|---|
| A1 | `GET /projects` + token | 200 · `items: 5` · `meta: total=5 limit=20 offset=0` |
| A2 | `?status=PUBLISHED` | 200 · 3 items (`mobile-booking-app, inventory-api, portfolio-website`) · `total=3` |
| A2 | `?limit=2&offset=1` | 200 · 2 items · `meta: total=5 limit=2 offset=1` |
| A3 | `?limit=abc` | 400 `VALIDATION_ERROR` · `limit: expected number, received NaN` |
| A3 | `?limit=0` · `?limit=101` | 400 · `>=1` · `<=100` |
| A3 | `?offset=-1` · `?status=XYZ` | 400 · `>=0` · `Invalid option: expected one of "DRAFT"\|"PUBLISHED"\|"ARCHIVED"` |
| A4 | `GET /projects` no token | 401 `MISSING_TOKEN` |
| A5 | `GET /projects/…0001` | 200 · `Portfolio Website` · `technologies: Node.js/React` · 11 camelCase keys |
| A6 | `GET /projects/not-a-uuid` | 400 `VALIDATION_ERROR` · `id must be a valid UUID` |
| A6 | `GET /projects/…00ff` | 404 `NOT_FOUND` · `Project '…00ff' was not found` |
| A6 | `GET /projects/not-a-uuid` no token | 401 `MISSING_TOKEN` (401 wins over 400) |
| A7 | `db:reset -- --empty`, then list | 200 · `{"data":[],"meta":{"total":0,"limit":20,"offset":0}}` |
| A8 | `db:break`, then list and get | 500 both · `{"code":"INTERNAL_ERROR","message":"Unexpected server error"}` (no SQL in the body; the stack is only in the server log) |
| Repair | `db:reset`, then list and get | 200 · 5 items · 200 |
| Order | `?limit=abc` no token | 401 (authenticate before validate) |

## 7. Commits

| Hash | Message |
|---|---|
| `09a853c` | `feat(projects): add project read schemas` |
| `a78826a` | `feat(projects): add project repository read methods` |
| `807dbf0` | `feat(projects): add project service read methods` |
| `d7214ad` | `feat(projects): add project controller and read routes` |
| `b1cd687` | `feat(server): wire projects module into composition root` |

## 8. Environment note (not a code change)

After the M1 merge the `better-sqlite3` native binary was missing (`node_modules/.../build/Release`
did not exist, so every DB access failed with "Could not locate the bindings file"). It was
rebuilt with the package's own `prebuild-install` inside `server/node_modules`; no repository file
changed. If it happens again: `cd server/node_modules/better-sqlite3 && node ../.pnpm/prebuild-install@7.1.3/node_modules/prebuild-install/bin.js`.

## 9. Three questions the professor could ask

1. **Why two SQL statements instead of one for the list?**
   The total must not depend on `limit`/`offset`, so it needs its own aggregate. A window function
   (`COUNT(*) OVER ()`) could do both in one query, but two prepared statements are simpler to read
   and SQLite executes them cheaply.
2. **How is the `status` filter protected against SQL injection?**
   The optional `WHERE` clause is one of two fixed strings chosen in code; the status value is bound
   as a parameter (`?`). User text never becomes part of the SQL string.
3. **Why does the repository return `null` instead of throwing 404?**
   The repository knows SQL, not HTTP. Returning `null` keeps it reusable by any caller; the service
   decides that "no row" means `NotFoundError`, which the error handler turns into the 404 envelope.
