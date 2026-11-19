# M6a — Reader role (API extension, after Gate G3)

**Branch:** `feat/m6a-reader-role` · **Depends on:** G3 · **Gate:** G4
**Read first:** `rules/auth.md` (post-MVP section), `rules/errors.md`, `docs/context/api-contract.md` (post-MVP section), `rules/testing.md`

## Goal
A read-only credential the public site can ship in the browser, enforced by the API.

## Scope (in)
Optional env `API_READER_USERNAME` / `API_READER_PASSWORD` · login returns a token with a `role` claim
(`admin` | `reader`) · `authenticate` sets `req.user = { username, role }` · `authorize('admin')` middleware on
POST/PUT/DELETE · `ForbiddenError` (403, `FORBIDDEN`) · reader visibility rule in `ProjectService`
(list forced to `PUBLISHED`; get-by-id of a non-published project → 404) · tests · docs.

## Out of scope
Users table, registration, more roles, rate limiting, Better Auth (later).

## Assumptions
Tokens without a `role` claim are rejected as `INVALID_TOKEN`. If reader env vars are absent, reader login is disabled.

## Tasks
- [ ] T1 env + `AuthService` role resolution + token claim · [ ] T2 `authenticate` sets role; `authorize` + `ForbiddenError`
- [ ] T3 apply `authorize('admin')` to write routes; pass `req.user.role` to the service; visibility rule
- [ ] T4 Bruno `rbac/` tests (RBAC-200-01, RBAC-403-01…03, RBAC-404-01) · [ ] T5 update `api-contract.md`, `test-plan.md`, OpenAPI

## Acceptance criteria
- [ ] A1 reader login → 200; wrong reader password → 401
- [ ] A2 reader `GET /projects` → 200 with only PUBLISHED (3 on fresh seed); `?status=DRAFT` still returns only PUBLISHED
- [ ] A3 reader `GET` of a DRAFT id → 404
- [ ] A4 reader POST / PUT / DELETE → 403 `FORBIDDEN`
- [ ] A5 **regression:** the full 24-case matrix and all earlier extras still pass with the admin credential (paste summary)
