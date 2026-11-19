# M1 — Auth

**Branch:** `feat/m1-auth` · **Depends on:** M0 · **Gate:** G1
**Read first:** `rules/auth.md`, `errors.md`, `architecture.md`, `docs/context/api-contract.md`

## Goal
Login that issues a JWT and a middleware that returns 401 on every protected route.

## Scope (in)
`models/auth.schemas.js` · `middlewares/validate.js` (generic: params/query/body → `req.validated`, Zod
issues → `ValidationError.details`) · `AuthService` · `AuthController` · `auth.routes.js` ·
`middlewares/authenticate.js` · `routes/index.js` composition root · a temporary protected route `GET /api/v1/_ping`
(delete before finishing).

## Out of scope
Roles, 403, refresh tokens, users table, rate limiting.

## Tasks
- [ ] T1 `validate` middleware + `auth.schemas.js`
- [ ] T2 `AuthService`, `AuthController`, `auth.routes.js`
- [ ] T3 `createAuthenticate(config)` middleware
- [ ] T4 Composition root `routes/index.js`; mount in `app.js`; temp `_ping`
- [ ] T5 Remove `_ping` after verification

## Acceptance criteria
- [ ] A1 login with `.env` credentials → 200 with `token`
- [ ] A2 wrong password → 401 `INVALID_CREDENTIALS`; wrong username → identical response
- [ ] A3 login with missing field / extra field / non-JSON → 400 `VALIDATION_ERROR`
- [ ] A4 `_ping` without token → 401 `MISSING_TOKEN`; garbage token → 401 `INVALID_TOKEN`; with valid token → 200
- [ ] A5 a token signed with expiry in the past (e.g. temporarily `JWT_EXPIRES_IN=1s`, wait) → 401 `TOKEN_EXPIRED`
- [ ] A6 401 responses carry `WWW-Authenticate: Bearer`
