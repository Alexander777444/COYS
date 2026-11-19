# Errors

Every non-2xx response has this exact envelope — no exceptions:

```json
{ "error": { "code": "NOT_FOUND", "message": "Project 'x' was not found", "details": null } }
```

## Classes (`server/src/errors/`)

| Class | HTTP | Default `code` | Notes |
|---|---|---|---|
| `AppError` (base) | any | — | `constructor(statusCode, code, message, details = null)`; `isOperational = true` |
| `ValidationError` | 400 | `VALIDATION_ERROR` | `details` = array of `{ path, message }` from Zod |
| `UnauthorizedError` | 401 | `UNAUTHORIZED` | code overridable: `MISSING_TOKEN`, `INVALID_TOKEN`, `TOKEN_EXPIRED`, `INVALID_CREDENTIALS` |
| `NotFoundError` | 404 | `NOT_FOUND` | `constructor(resource, id)` → message `"<resource> '<id>' was not found"` |
| `ConflictError` | 409 | `CONFLICT` | e.g. duplicate slug |
| `ForbiddenError` | 403 | `FORBIDDEN` | **post-MVP (M6a only)**: authenticated but not allowed (reader writing) |

## Where each error is created

| Situation | Layer that throws |
|---|---|
| Zod fails (params, query, body) | `validate` middleware → `ValidationError` |
| Missing/invalid token, bad credentials | `authenticate` / `AuthService` → `UnauthorizedError` |
| Row does not exist | **Service** (repository returns `null`/`false`) → `NotFoundError` |
| `SQLITE_CONSTRAINT_UNIQUE` on `projects.slug` | **Repository** → `ConflictError` |
| Anything else | not caught: bubbles to the global handler → 500 |

## Global `errorHandler` (last middleware, 4 args)

1. `err instanceof AppError` → use its status/code/message/details.
2. body-parser errors (by `err.type`): `entity.parse.failed` → 400 `INVALID_JSON`;
   `entity.too.large` → **400** `PAYLOAD_TOO_LARGE` (convert 413 → 400: 413 is not in the professor's table).
3. Anything else → log the real error (`console.error`, with stack) and answer 500
   `INTERNAL_ERROR` with the generic message `"Unexpected server error"`.
4. If `res.headersSent`, delegate with `next(err)`.
5. **Never** leak stack traces, SQL or file paths in a response.

`notFound` middleware (before `errorHandler`): any unmatched route → 404 `ROUTE_NOT_FOUND`.
A `CHECK`-constraint failure or any unexpected DB error is a programming bug → 500, not 400.
