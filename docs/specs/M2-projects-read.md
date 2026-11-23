# M2 — Projects: read endpoints

**Branch:** `feat/m2-projects-read` · **Depends on:** M1 · **Gate:** G1
**Read first:** skill `create-module`, `api-contract.md`, `database.md`, `errors.md`, `architecture.md`

## Goal
`GET /api/v1/projects` and `GET /api/v1/projects/{id}` with all their required status codes.

## Scope (in)
`project.schemas.js` (id params, list query) · `ProjectRepository` (`findAll`, `findById`, mapper) ·
`ProjectService` (`list`, `getById`) · `ProjectController` · `projects.routes.js` · wire in the composition root.

## Out of scope
POST/PUT/DELETE, search text, sorting options, OpenAPI.

## Tasks
- [x] T1 Schemas · [x] T2 Repository · [x] T3 Service · [x] T4 Controller + routes + wiring

## Acceptance criteria
- [x] A1 list with token → 200 `{data, meta}`; `meta.total` = 5 on a fresh `db:reset`
- [x] A2 `?status=PUBLISHED` → 3 items; `?limit=2&offset=1` → 2 items, `meta.limit=2`
- [x] A3 `?limit=abc`, `?limit=0`, `?limit=101`, `?offset=-1`, `?status=XYZ` → 400 `VALIDATION_ERROR`
- [x] A4 list without token → 401
- [x] A5 get `…0001` → 200 with the full Project shape (camelCase, `technologies` is an array)
- [x] A6 get `not-a-uuid` → 400 · get `…00ff` → 404 · get without token (even with bad id) → 401
- [x] A7 after `db:reset -- --empty`, list → 200 with `data: []`, `total: 0`
- [x] A8 after `db:break`, list and get → 500 `INTERNAL_ERROR`, generic message, no SQL leaked (then `db:reset`)

