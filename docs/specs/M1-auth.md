# M1 — Auth

**Branch:** `feat/m1-m3-projects-api` (the developer asked for one branch for M1–M3) · **Depends on:** M0 · **Gate:** G1
**Read first:** `rules/auth.md`, `errors.md`, `architecture.md`, `docs/context/api-contract.md`

## Assumptions (recorded before implementation)

1. **One branch for M1–M3.** The developer's session prompt overrides the per-module branch names.
2. **No temporary `_ping` route in the codebase.** `authenticate` was verified with a throwaway
   Express harness outside the repository (same middleware + same `errorHandler`, real HTTP),
   then deleted. A4/A5/A6 were verified that way; M2 verifies the middleware again on a real route.
3. **A3 "non-JSON".** Malformed JSON is answered by the existing `errorHandler` with 400 `INVALID_JSON`
   (documented in `api-contract.md` and `rules/errors.md`); a body sent with a non-JSON
   `Content-Type` reaches `validate` as `undefined` and returns 400 `VALIDATION_ERROR`.
4. **Expired token.** A5 used a token signed with `expiresIn: '-1s'` instead of editing
   `JWT_EXPIRES_IN=1s`, so no local `.env` edit was needed; the code path in `authenticate` is identical.

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
- [x] T1 `validate` middleware + `auth.schemas.js`
- [x] T2 `AuthService`, `AuthController`, `auth.routes.js`
- [x] T3 `createAuthenticate(config)` middleware
- [x] T4 Composition root `routes/index.js`; mount in `app.js`; temp `_ping` replaced by an external harness (see Assumptions)
- [x] T5 No temporary route left in the codebase (the harness was deleted, nothing to remove)

## Acceptance criteria
- [x] A1 login with `.env` credentials → 200 with `token`
- [x] A2 wrong password → 401 `INVALID_CREDENTIALS`; wrong username → identical response
- [x] A3 login with missing field / extra field / non-JSON → 400 `VALIDATION_ERROR`
- [x] A4 no token → 401 `MISSING_TOKEN`; garbage token → 401 `INVALID_TOKEN`; with valid token → 200
- [x] A5 a token signed with expiry in the past (e.g. temporarily `JWT_EXPIRES_IN=1s`, wait) → 401 `TOKEN_EXPIRED`
- [x] A6 401 responses carry `WWW-Authenticate: Bearer`

