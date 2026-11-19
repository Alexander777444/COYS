# QA test plan — COYS

**Role declared (requirement 10): Quality Assurance & Testing.** Tasks adopted from the professor's list:
API tests that verify status codes · deterministic test data with edge cases (empty table, max-length
fields, special characters, SQL-injection text, oversize payload) · repeatable runs (`db:reset`) ·
automation (Playwright smoke; CI pipeline = future work) · bug log.

## Strategy

Black-box tests against the running API. Bruno is the contract suite (24 required cases + extras);
Playwright automates a smoke subset and later the UI. Rules and run order: `.agents/rules/testing.md`.
Seed IDs and edge data: `docs/context/database-structure.md`. Expected behavior: `docs/context/api-contract.md`.

**Entry:** M3 merged, `db:reset` works. **Exit (Gate G3):** all Required rows pass, extras pass or are
logged in `bug-log.md`, two consecutive full passes give identical results.

## Required matrix (24 = the professor's table). Result: ⬜ not run · ✅ pass · ❌ fail

| ID | Endpoint | Case | Expected | Folder | Result |
|---|---|---|---|---|---|
| LIST-200-01 | GET /projects | valid token, seeded DB | 200, `meta.total` 5 | main | ⬜ |
| LIST-400-01 | GET /projects | `?limit=abc` | 400 `VALIDATION_ERROR` | main | ⬜ |
| LIST-401-01 | GET /projects | no token | 401 `MISSING_TOKEN` | main | ⬜ |
| LIST-500-01 | GET /projects | table dropped | 500 `INTERNAL_ERROR` | server-error | ⬜ |
| GET-200-01 | GET /projects/{id} | seed id `…0001` | 200, full shape | main | ⬜ |
| GET-400-01 | GET /projects/{id} | `not-a-uuid` | 400 | main | ⬜ |
| GET-401-01 | GET /projects/{id} | no token | 401 | main | ⬜ |
| GET-404-01 | GET /projects/{id} | valid uuid `…00ff` | 404 `NOT_FOUND` | main | ⬜ |
| GET-500-01 | GET /projects/{id} | table dropped | 500 | server-error | ⬜ |
| POST-201-01 | POST /projects | valid body (unique slug) | 201 + `Location` | main | ⬜ |
| POST-400-01 | POST /projects | missing `title` | 400 | main | ⬜ |
| POST-401-01 | POST /projects | no token | 401 | main | ⬜ |
| POST-409-01 | POST /projects | slug `portfolio-website` | 409 `CONFLICT` | main | ⬜ |
| POST-500-01 | POST /projects | table dropped | 500 | server-error | ⬜ |
| PUT-200-01 | PUT /projects/{id} | replace a project created by the test | 200, `updatedAt` changed | main | ⬜ |
| PUT-400-01 | PUT /projects/{id} | invalid body | 400 | main | ⬜ |
| PUT-401-01 | PUT /projects/{id} | no token | 401 | main | ⬜ |
| PUT-404-01 | PUT /projects/{id} | valid body, id `…00ff` | 404 | main | ⬜ |
| PUT-500-01 | PUT /projects/{id} | table dropped | 500 | server-error | ⬜ |
| DELETE-204-01 | DELETE /projects/{id} | delete a project created by the test | 204 empty | main | ⬜ |
| DELETE-400-01 | DELETE /projects/{id} | `not-a-uuid` | 400 | main | ⬜ |
| DELETE-401-01 | DELETE /projects/{id} | no token | 401 | main | ⬜ |
| DELETE-404-01 | DELETE /projects/{id} | delete the same id twice | 404 on 2nd | main | ⬜ |
| DELETE-500-01 | DELETE /projects/{id} | table dropped | 500 | server-error | ⬜ |

## Extra cases (edge / robustness)

| ID | Case | Expected | Folder | Result |
|---|---|---|---|---|
| LIST-200-02 | `?status=PUBLISHED` | 200, 3 items | main | ⬜ |
| LIST-200-03 | `?limit=2&offset=1` | 200, 2 items, meta matches | main | ⬜ |
| LIST-200-04 | empty table | 200, `data: []`, `total: 0` | empty-state | ⬜ |
| LIST-400-02…05 | `limit=0`, `limit=101`, `offset=-1`, `status=XYZ` | 400 each | main | ⬜ |
| LIST-401-02/03 | garbage token / expired token | 401 `INVALID_TOKEN` / `TOKEN_EXPIRED` | main | ⬜ |
| GET-200-02 | edge seeds `…0101`…`…0105` (accents, SQL-injection text, max length, empty arrays) | 200, text returned literally | main (after `db:seed:edge`) | ⬜ |
| POST-201-02 | omitted optionals | defaults (`[]`, `null`, `DRAFT`) | main | ⬜ |
| POST-201-03 | accents + quotes + `'; DROP TABLE projects; --` | 201 and DB intact | main | ⬜ |
| POST-400-02…06 | bad slug format · bad URL · unknown field · `id` in body · broken JSON | 400 (`INVALID_JSON` for JSON) | main | ⬜ |
| POST-400-07 | body > 100 kb | 400 `PAYLOAD_TOO_LARGE` (not 413) | main | ⬜ |
| PUT-200-02 | PUT keeping its own slug | 200 | main | ⬜ |
| PUT-409-01 | PUT with another project's slug | 409 (extra, documented) | main | ⬜ |
| LOGIN-200-01 / 400-01 / 401-01 | valid · missing field · wrong password | 200 · 400 · 401 `INVALID_CREDENTIALS` | main | ⬜ |
| HEALTH-200-01 / ROUTE-404-01 | `/health` · `/nope` | 200 · 404 `ROUTE_NOT_FOUND` | main | ⬜ |

## UI tests (only after Gate G3)

ADMIN-01 … ADMIN-11 and WEB-01 … WEB-04 are defined in `docs/context/screens.md`; run with `cd e2e && npx playwright test ui`.

## Post-MVP API extras (module M6a, after Gate G3)

| ID | Case | Expected | Folder | Result |
|---|---|---|---|---|
| RBAC-200-01 | reader lists projects | 200, only PUBLISHED | rbac | ⬜ |
| RBAC-403-01/02/03 | reader POST / PUT / DELETE | 403 `FORBIDDEN` | rbac | ⬜ |
| RBAC-404-01 | reader GET of a DRAFT id | 404 | rbac | ⬜ |
| RBAC-REG-01 | full 24-case matrix again with admin | all pass | main | ⬜ |

## Bruno layout

```
api-tests/
  bruno.json · environments/local.bru   (baseUrl, username, password; token is set at runtime)
  main/  00-login.bru · list/ · get/ · post/ · put/ · delete/ · auth/
  empty-state/   00-login.bru · LIST-200-04.bru
  server-error/  00-login.bru · LIST-500-01.bru … DELETE-500-01.bru
```

## Defect reporting

Any failure or surprise → `docs/qa/bug-log.md` (template inside), then fix in the right layer and re-run.
