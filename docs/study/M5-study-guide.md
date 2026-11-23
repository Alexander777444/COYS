# M5 — Docs · Study guide

What was built, why, and how to defend it. Companion of `docs/specs/M5-docs.md`.

## 1. Current status

| Item | Value |
|---|---|
| Branch | `feat/m5-docs` (from `main`, after the M4 merge) |
| Roadmap status | M5 = 🔎 (waiting developer review) |
| Gate | G3 **not ticked** (only the developer ticks gates) |
| Push / merge | Not done. Local commits only. |
| Business logic | No server business-logic behavior changed; only documentation and Swagger UI wiring were added |
| Next module | M6a, only after G3 and an explicit "continue" |

## 2. Files

### Created

| File | What it does | Why it exists |
|---|---|---|
| `docs/openapi.yaml` | OpenAPI 3.0.3 contract for `/health`, `POST /api/v1/auth/login`, and the 5 project endpoints | The professor requires YAML API documentation; it also makes the real contract reviewable and testable |
| `docs/diagrams/layered-architecture.mmd` | Mermaid diagram of Route → middleware → Controller → Service → Repository → SQLite | Shows the layered architecture and error flow |
| `docs/diagrams/projects-er.mmd` | Mermaid ER diagram for the `projects` table | Documents the database shape and constraints |
| `docs/diagrams/login-create-sequence.mmd` | Mermaid sequence for login + POST `/projects` (201/409/401 branches) | Shows real request flow and error branches |
| `docs/diagrams/class-diagram.mmd` | Mermaid class diagram for controllers/services/repositories/errors | Supports the OOP and dependency-injection explanation |
| `docs/diagrams/status-code-flow.mmd` | Mermaid status-code decision flow | Makes the check order explicit: 401 → 400 → 404 → 409 → 500 |
| `docs/study/M5-study-guide.md` | This file | Defence material |

### Modified

| File | Change | Why |
|---|---|---|
| `server/src/app.js` | Loads `docs/openapi.yaml`, mounts Swagger UI at `/api-docs` before `helmet()` | Swagger UI needs its scripts/styles; mounting before helmet avoids CSP breakage while keeping helmet on API routes |
| `README.md` | Rewritten with install/run, DB scripts, Bruno order, `/api-docs`, diagrams, troubleshooting | Gives the professor and reviewer a complete runbook |
| `docs/qa/bug-log.md` | Added ENV-01/02/03 as environment/process findings | Records real incidents without inventing API defects |
| `docs/specs/M5-docs.md` | Ticked verified tasks/criteria and added verification notes | Keeps the spec as the source of truth |
| `docs/plan/roadmap.md` | M5 set to 🔎 | Signals waiting for developer review; G3 left unticked |

### Not changed (important)

No route, controller, service, repository, schema, auth, error, or database behavior was changed. Bruno main pass stayed green after the docs/UI wiring.

## 3. How the pieces connect

```
docs/openapi.yaml  --read at startup-->  server/src/app.js
                                         ├─ app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(doc))
                                         ├─ app.use(helmet())   (after Swagger UI)
                                         ├─ /health and /api/v1 routes
                                         └─ notFound + errorHandler

README.md embeds Mermaid diagrams and links to /api-docs + docs/openapi.yaml
docs/diagrams/*.mmd are the diagram source files
Bruno + code are the reality check for every OpenAPI status code
```

The OpenAPI document describes the real middleware order: `authenticate (401) → validate (400) → service (404) → repository (409) → unexpected (500)`. It also documents real extras: `PUT 409` for slug conflicts with another project, and `ROUTE_NOT_FOUND` as a real 404 code.

## 4. Key ideas

1. **Docs must describe reality, not intention.** The YAML was written from routes, schemas, controllers, services, repositories, and the error handler. *Analogy:* a map is useful only if it matches the streets, not the architect's first sketch.
2. **Swagger UI is a client, so it has its own security needs.** Helmet's CSP protects normal API responses, but it blocks Swagger UI's assets. Mounting `/api-docs` before `helmet()` is a narrow exception. *Analogy:* you open the museum door for visitors, but you still lock the staff rooms.
3. **A status code is a contract.** The OpenAPI file lists the professor's required codes and the documented extras, and the Bruno suite proves them. *Analogy:* a traffic light is not decoration; drivers and tests both depend on the same colors.

## 5. What was NOT created in this module

- No new endpoint, no auth/role change, no DB migration, no new dependency.
- No code generation from OpenAPI, no Redoc, no CI pipeline.
- No automatic external OpenAPI linter run via `npx` (not requested/approved).
- No gate tick: G3 remains the developer's decision.

## 6. Verification evidence

| Check | Result |
|---|---|
| YAML parse (`yaml` package) | `parsed OK`, `openapi: 3.0.3`, paths `/health, /api/v1/auth/login, /api/v1/projects, /api/v1/projects/{id}` |
| Served spec (`/api-docs/swagger-ui-init.js`) | `served spec parsed OK`, same 7 operations and status-code sets |
| `GET /api-docs` | `200`, `Content-Type: text/html; charset=utf-8`, contains `Swagger UI`, no CSP header on docs route |
| Helmet still active on API routes | `GET /api/v1/projects` without token returned `401 MISSING_TOKEN` with helmet headers including `X-Content-Type-Options: nosniff` and `WWW-Authenticate: Bearer` |
| Bruno main pass (fresh `db:reset`, Invoke-Suite block) | `46 requests, 145/145 assertions, PASS`; first line `main\00-login (200 OK)` |
| Mermaid render | Static syntax sanity-check passed for all 5 `.mmd` files; full GitHub render not verified in this environment |

## 7. Commits

| Hash | Message |
|---|---|
| `becf1f5` | `feat(docs): add OpenAPI spec and Swagger UI route` |
| `a0c8ec5` | `docs(readme): document setup, API docs, and diagrams` |
| `6f3770e` | `docs(qa): log environment and process findings` |
| (this section commit) | `docs(m5): add study guide and mark module review-ready` |

## 8. Three questions the professor could ask

1. **Why is Swagger UI mounted before `helmet()`?**
   Helmet sets a Content-Security-Policy that blocks the inline scripts/styles Swagger UI needs. Mounting `/api-docs` before helmet lets the documentation UI load, while `helmet()` still protects `/health` and all `/api/v1` routes.
2. **How do you know the OpenAPI file matches the real API?**
   I derived it from the real routes, schemas, controllers, services, repositories, and error handler, then checked it against the Bruno contract suite and parsed both the YAML file and the served Swagger spec. Any mismatch would be reported, not hidden by changing code.
3. **Why document `PUT 409` if the professor table lists 200/400/401/404/500 for PUT?**
   The table is the minimum required set. The implementation also rejects a slug that belongs to another project; that is a real conflict, so OpenAPI documents it as a documented extra instead of pretending it cannot happen.