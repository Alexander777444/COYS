# M3 — Projects: write endpoints

**Branch:** `feat/m3-projects-write` · **Depends on:** M2 · **Gate:** G2
**Read first:** skill `create-module`, `api-contract.md`, `database.md`, `errors.md`

## Goal
`POST`, `PUT`, `DELETE` on `/api/v1/projects` with every required code, incl. 409.

## Scope (in)
Body schemas (strict; POST and PUT share the same shape) · repository `create/replace/deleteById`
(slug UNIQUE → `ConflictError`) · service (`crypto.randomUUID()`, existence → 404) · controller
(201 + `Location`, 200, 204 no body) · routes.

## Out of scope
PATCH, soft delete, bulk operations, other resources.

## Tasks
- [x] T1 Schemas · [x] T2 Repository · [x] T3 Service · [x] T4 Controller + routes

## Acceptance criteria
- [x] A1 POST valid → 201, `Location` header, body with generated `id`; omitted optionals take defaults
- [x] A2 POST missing title / bad slug format / bad URL / unknown field / `id` in body / broken JSON → 400
- [x] A3 POST existing slug (`portfolio-website`) → 409 `CONFLICT`
- [x] A4 POST no token → 401
- [x] A5 PUT valid → 200, `updatedAt` changed, `createdAt` unchanged; PUT with its own slug → 200
- [x] A6 PUT bad body → 400 · PUT `…00ff` valid body → 404 · PUT bad uuid → 400 · no token → 401
- [x] A7 PUT slug belonging to another project → 409 (documented extra)
- [x] A8 DELETE existing → 204 empty body; same id again → 404; bad uuid → 400; no token → 401
- [x] A9 With `db:break`: POST/PUT/DELETE → 500 (then `db:reset`)

