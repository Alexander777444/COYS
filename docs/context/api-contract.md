# API contract (single source of truth for endpoints)

Base path `/api/v1`. JSON only. Camel-case fields. Everything except the public routes needs
`Authorization: Bearer <token>`.

## Endpoints

| Method | Path | Auth | Success | Purpose |
|---|---|---|---|---|
| GET | `/health` | public | 200 `{ "status": "ok" }` | liveness |
| POST | `/api/v1/auth/login` | public | 200 | get a JWT (see `rules/auth.md`) |
| GET | `/api/v1/projects` | yes | 200 | list (filter + pagination) |
| GET | `/api/v1/projects/{id}` | yes | 200 | detail |
| POST | `/api/v1/projects` | yes | 201 + `Location` header | create |
| PUT | `/api/v1/projects/{id}` | yes | 200 | full replacement |
| DELETE | `/api/v1/projects/{id}` | yes | 204, no body | delete |

`Location` on 201 is relative to the API root: `/api/v1/projects/{id}`.

## POST /api/v1/auth/login (public)

Request body (Zod strict, unknown fields → 400):

```json
{ "username": "admin", "password": "<value from server/.env>" }
```

```json
// 200
{ "token": "<jwt>", "tokenType": "Bearer", "expiresIn": "1h" }
```

- Token: HS256, claims `{ sub: <username>, iat, exp }`, lifetime `JWT_EXPIRES_IN`. Send it as `Authorization: Bearer <token>`.
- 400 `VALIDATION_ERROR` (missing/empty field, unknown field, body not sent as JSON) · 400 `INVALID_JSON` (malformed JSON).
- 401 `INVALID_CREDENTIALS` — identical response for a wrong username and a wrong password.
- 401 on protected routes: `MISSING_TOKEN` / `INVALID_TOKEN` / `TOKEN_EXPIRED`, always with `WWW-Authenticate: Bearer`.

## Project object

```json
{ "id": "00000000-0000-4000-8000-000000000001", "title": "Portfolio Website", "slug": "portfolio-website",
  "description": "…", "clientName": null, "technologies": ["Node.js", "React"],
  "projectUrl": null, "repositoryUrl": null, "status": "PUBLISHED",
  "createdAt": "2026-01-05T10:00:00.000Z", "updatedAt": "2026-01-05T10:00:00.000Z" }
```

## Input rules (Zod; body schemas are `.strict()` → unknown fields = 400)

| Field | Rule | Required on POST/PUT |
|---|---|---|
| `title` | string, trimmed, 1–150 | yes |
| `slug` | string, 1–100, regex `^[a-z0-9]+(?:-[a-z0-9]+)*$` | yes |
| `description` | string, trimmed, 1–5000 | yes |
| `clientName` | string 1–150 or `null` | no (default `null`) |
| `technologies` | array of strings (1–50 chars each), max 30 | no (default `[]`) |
| `projectUrl`, `repositoryUrl` | valid `http(s)` URL ≤ 2048 or `null` | no (default `null`) |
| `status` | `DRAFT` \| `PUBLISHED` \| `ARCHIVED` | no (default `DRAFT`) |

`id`, `createdAt`, `updatedAt` are server-generated; sending them in a body → 400.
PUT is **full replacement**: required fields must be sent; omitted optional fields reset to defaults.

## Path / query

- `{id}`: `z.uuid()` (strict RFC 4122, so `not-a-uuid` → 400; seed IDs are valid v4).
- List query: `status` (enum, optional) · `limit` (int 1–100, default 20) · `offset` (int ≥ 0, default 0),
  via `z.coerce.number()`. Invalid value → 400. Unknown query params are ignored.
- List response: `{ "data": [Project…], "meta": { "total": n, "limit": n, "offset": n } }`.
  Order: `created_at DESC, id ASC`. An empty table → 200 with `data: []`.
  `meta.total` counts the rows that match the filters (so with `?status=PUBLISHED` it is 3, not 5).

## Status codes (what triggers each)

| Code | Trigger |
|---|---|
| 200 / 201 / 204 | success (GET/PUT · POST · DELETE) |
| 400 | invalid UUID · invalid body/query · broken JSON (`INVALID_JSON`) · oversize body >100 kb (`PAYLOAD_TOO_LARGE`) |
| 401 | no token · invalid token · expired token (`MISSING_TOKEN` / `INVALID_TOKEN` / `TOKEN_EXPIRED`) |
| 404 | valid UUID that does not exist (GET/PUT/DELETE) · unknown route (`ROUTE_NOT_FOUND`) |
| 409 | duplicate `slug` on POST (and on PUT when it belongs to another project — documented extra) |
| 500 | unexpected failure (e.g. DB unavailable) → `INTERNAL_ERROR`, generic message |

## Order of checks (matters for tests)

`authenticate (401) → validate params (400) → validate query/body (400) → service (404) → repository (409)`.
So: no token + bad id → **401**; bad body for a non-existent id → **400** (validation runs before lookup).

Error envelope: see `.agents/rules/errors.md`.

## Post-MVP additions (module M6a, after Gate G3 — not part of the graded MVP)

| Change | Behavior |
|---|---|
| Role claim | login token carries `role` = `admin` \| `reader` |
| `403 FORBIDDEN` | `reader` calling POST / PUT / DELETE (extra: not in the professor's table) |
| Reader visibility | `GET /projects` returns only `PUBLISHED`; `GET /projects/{id}` of a non-published project → 404 |
| Admin | behavior and status codes unchanged (regression-tested) |
