# Auth

Read with `errors.md`. Goal: produce the required **401** on every protected endpoint (including GETs).

## Model

Single API user from environment (`API_USERNAME`, `API_PASSWORD`). No users table, no roles, no 403
(deliberately out of MVP scope — see decisions).

## Login — `POST /api/v1/auth/login` (public)

Body `{ "username": string, "password": string }` (Zod, strict).
- 200 → `{ "token": "...", "tokenType": "Bearer", "expiresIn": "1h" }`
- 400 invalid/missing body fields · 401 `INVALID_CREDENTIALS` (same message for wrong user or password)

## Implementation rules

- `AuthService.login(username, password)`: compare both values with `crypto.timingSafeEqual` over
  SHA-256 digests of each side (avoids timing leaks and length errors); sign
  `jwt.sign({ sub: username }, JWT_SECRET, { algorithm: 'HS256', expiresIn: JWT_EXPIRES_IN })`.
- `authenticate` middleware (factory `createAuthenticate(config)` in `middlewares/authenticate.js`):
  1. Header must be `Authorization: Bearer <token>`; otherwise `UnauthorizedError('MISSING_TOKEN')`.
  2. `jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] })`.
  3. `TokenExpiredError` → `TOKEN_EXPIRED`; any other verify error → `INVALID_TOKEN`. All are HTTP 401.
  4. On success set `req.user = { username: payload.sub }` and `next()`.
- 401 responses include header `WWW-Authenticate: Bearer`.
- Order on protected routes: **authenticate → validate → controller**. A request with no token and a
  malformed id must return 401, not 400.
- Public routes only: `GET /health`, `POST /api/v1/auth/login`, `/api-docs`.
- Never log passwords or tokens. Never put secrets in the repo; `JWT_SECRET` ≥ 32 chars.

## Post-MVP extension (module M6a — do NOT build before Gate G3)

Adds a second, read-only identity for the public website. Env `API_READER_USERNAME` / `API_READER_PASSWORD` (optional).
- Token claims: `{ sub, role }` with `role` = `admin` | `reader`; tokens without `role` → `INVALID_TOKEN`.
- `authenticate` sets `req.user = { username, role }`. New `authorize(...roles)` middleware: write routes use
  `authorize('admin')`; a `reader` gets `ForbiddenError` (403 `FORBIDDEN`). Order: authenticate → authorize → validate → controller.
- Visibility rule lives in `ProjectService`, not in the controller: for `reader`, list is forced to `PUBLISHED`
  and get-by-id of a non-published project is a 404 (do not reveal existence).
- The reader credential is public by design (it ships in the browser). It must never be able to write or see non-published data.
- Later replacement: Better Auth (users + roles). Keep the change confined to `AuthService` and `authenticate`.
