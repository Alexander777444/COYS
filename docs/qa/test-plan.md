# QA test plan — COYS

**Role declared (requirement 10): Quality Assurance & Testing.** Tasks adopted from the professor's list:
API tests that verify status codes · deterministic test data with edge cases (empty table, max-length
fields, special characters, SQL-injection text, oversize payload) · repeatable runs (`db:reset`) ·
automation (Bruno contract suite now; Playwright smoke and CI pipeline = future work) · bug log.

## Strategy

Black-box tests against the running API. Bruno is the contract suite (24 required cases + extras);
Playwright automates a smoke subset and later the UI. Rules and run order: `.agents/rules/testing.md`.
Seed IDs and edge data: `docs/context/database-structure.md`. Expected behavior: `docs/context/api-contract.md`.

**Entry:** M3 merged, `db:reset` works. **Exit (Gate G3):** all Required rows pass, extras pass or are
logged in `bug-log.md`, two consecutive full passes give identical results.

## Required matrix (24 = the professor's table). Result: ⬜ not run · ✅ pass · ❌ fail

The 24 required cases are exactly: **9 list/get** (4 list + 5 get, including the two list/get 500s that
live in `server-error/` but count in this group) + **12 write** (4 POST + 4 PUT + 4 DELETE) + **3 write
500s** (POST, PUT, DELETE).

| ID | Endpoint | Case | Expected | Folder | Result |
|---|---|---|---|---|---|
| LIST-200-01 | GET /projects | valid token, seeded DB | 200, `meta.total` 5 | main | ✅ |
| LIST-400-01 | GET /projects | `?limit=abc` | 400 `VALIDATION_ERROR` | main | ✅ |
| LIST-401-01 | GET /projects | no token | 401 `MISSING_TOKEN` | main | ✅ |
| LIST-500-01 | GET /projects | table dropped | 500 `INTERNAL_ERROR` | server-error | ✅ |
| GET-200-01 | GET /projects/{id} | seed id `…0001` | 200, full shape | main | ✅ |
| GET-400-01 | GET /projects/{id} | `not-a-uuid` | 400 `VALIDATION_ERROR` | main | ✅ |
| GET-401-01 | GET /projects/{id} | no token | 401 `MISSING_TOKEN` | main | ✅ |
| GET-404-01 | GET /projects/{id} | valid uuid `…00ff` | 404 `NOT_FOUND` | main | ✅ |
| GET-500-01 | GET /projects/{id} | table dropped | 500 `INTERNAL_ERROR` | server-error | ✅ |
| POST-201-01 | POST /projects | valid body (unique slug) | 201 + `Location` | main | ✅ |
| POST-400-01 | POST /projects | missing `title` | 400 `VALIDATION_ERROR` | main | ✅ |
| POST-401-01 | POST /projects | no token | 401 `MISSING_TOKEN` | main | ✅ |
| POST-409-01 | POST /projects | slug `portfolio-website` | 409 `CONFLICT` | main | ✅ |
| POST-500-01 | POST /projects | table dropped | 500 `INTERNAL_ERROR` | server-error | ✅ |
| PUT-200-01 | PUT /projects/{id} | replace a project created by the test | 200, `updatedAt` changed | main | ✅ |
| PUT-400-01 | PUT /projects/{id} | invalid body | 400 `VALIDATION_ERROR` | main | ✅ |
| PUT-401-01 | PUT /projects/{id} | no token | 401 `MISSING_TOKEN` | main | ✅ |
| PUT-404-01 | PUT /projects/{id} | valid body, id `…00ff` | 404 `NOT_FOUND` | main | ✅ |
| PUT-500-01 | PUT /projects/{id} | table dropped | 500 `INTERNAL_ERROR` | server-error | ✅ |
| DELETE-204-01 | DELETE /projects/{id} | delete a project created by the test | 204 empty | main | ✅ |
| DELETE-400-01 | DELETE /projects/{id} | `not-a-uuid` | 400 `VALIDATION_ERROR` | main | ✅ |
| DELETE-401-01 | DELETE /projects/{id} | no token | 401 `MISSING_TOKEN` | main | ✅ |
| DELETE-404-01 | DELETE /projects/{id} | delete the same id twice | 404 on 2nd | main | ✅ |
| DELETE-500-01 | DELETE /projects/{id} | table dropped | 500 `INTERNAL_ERROR` | server-error | ✅ |

## Extra cases (edge / robustness)

| ID | Case | Expected | Folder | Result |
|---|---|---|---|---|
| LIST-200-02 | `?status=PUBLISHED` | 200, 3 items | main | ✅ |
| LIST-200-03 | `?limit=2&offset=1` | 200, 2 items, meta matches | main | ✅ |
| LIST-200-04 | empty table | 200, `data: []`, `total: 0` | empty-state | ✅ |
| LIST-400-02 | `?limit=0` | 400 `VALIDATION_ERROR` | main | ✅ |
| LIST-400-03 | `?limit=101` | 400 `VALIDATION_ERROR` | main | ✅ |
| LIST-400-04 | `?offset=-1` | 400 `VALIDATION_ERROR` | main | ✅ |
| LIST-400-05 | `?status=XYZ` | 400 `VALIDATION_ERROR` | main | ✅ |
| LIST-401-02 | garbage token | 401 `INVALID_TOKEN` | main | ✅ |
| LIST-401-03 | expired token | 401 `TOKEN_EXPIRED` | main | ✅ |
| GET-200-02 | edge seed `…0101`: accents, quotes, `ñ` | 200, text returned literally | edge | ✅ |
| GET-200-03 | edge seed `…0102`: `'; DROP TABLE projects; --` | 200, text literal, table intact | edge | ✅ |
| GET-200-04 | edge seed `…0103`: max-length title/description | 200, 150 and 5000 chars | edge | ✅ |
| GET-200-05 | edge seed `…0104`: empty `technologies`, null optionals | 200 | edge | ✅ |
| GET-200-06 | edge seed `…0105`: 100-char slug | 200 | edge | ✅ |
| GET-200-07 | seed `…0001` after the injection text | 200, table intact | edge | ✅ |
| POST-201-02 | omitted optionals | defaults (`[]`, `null`, `DRAFT`) | main | ✅ |
| POST-201-03 | accents + quotes + `'; DROP TABLE projects; --` | 201, text literal | main | ✅ |
| POST-400-02 | bad slug format (`Bad Slug`) | 400 `VALIDATION_ERROR` | main | ✅ |
| POST-400-03 | `projectUrl` uses `ftp://` | 400 `VALIDATION_ERROR` | main | ✅ |
| POST-400-04 | unknown field in body | 400 `VALIDATION_ERROR` | main | ✅ |
| POST-400-05 | `id` sent in the body | 400 `VALIDATION_ERROR` | main | ✅ |
| POST-400-06 | broken JSON | 400 `INVALID_JSON` | main | ✅ |
| POST-400-07 | body > 100 kb | 400 `PAYLOAD_TOO_LARGE` (not 413) | main | ✅ |
| PUT-200-02 | PUT keeping its own slug | 200 | main | ✅ |
| PUT-409-01 | PUT with another project's slug | 409 `CONFLICT` | main | ✅ |
| LOGIN-200-01 | valid credentials | 200 + `Bearer` token | main | ✅ |
| LOGIN-400-01 | missing password | 400 `VALIDATION_ERROR` | main | ✅ |
| LOGIN-401-01 | wrong password | 401 `INVALID_CREDENTIALS` | main | ✅ |
| HEALTH-200-01 | `/health` | 200 `{ status: "ok" }` | main | ✅ |
| ROUTE-404-01 | unknown route `/nope` | 404 `ROUTE_NOT_FOUND` | main | ✅ |

## Run order (deterministic, from a fresh database)

The suite is order-safe inside each folder: `main/` starts and cleans up its own rows, so a fresh
`db:reset` always gives the same result. Run the whole sequence **twice**; both passes must be identical.

Credentials come from `server/.env` and are passed with `--env-var` at run time. Nothing secret is
stored in the collection: `api-tests/environments/local.bru` only holds placeholders, and `{{token}}`
is captured by `00-login.bru` at run time.

```powershell
# 0. Read the credentials without printing them
$creds = @{}
Get-Content server/.env | ForEach-Object { if ($_ -match '^([A-Z_]+)=(.*)$') { $creds[$matches[1]] = $matches[2] } }

# 1. main pass — 5 seed rows
#    stop the server if it is running
cd server; npm run db:reset; npm start          # terminal A
cd api-tests
npx @usebruno/cli run main --env local `
  --env-var "username=$($creds['API_USERNAME'])" `
  --env-var "password=$($creds['API_PASSWORD'])" `
  --env-var "expiredToken=<token signed with expiresIn: -1s>"

# 2. edge pass — the same database plus the edge seeds
cd server; npm run db:seed:edge
cd api-tests
npx @usebruno/cli run edge --env local --env-var "username=$($creds['API_USERNAME'])" --env-var "password=$($creds['API_PASSWORD'])"

# 3. server-error pass — the projects table is dropped
#    stop the server
cd server; npm run db:break; npm start          # terminal A
cd api-tests
npx @usebruno/cli run server-error --env local --env-var "username=$($creds['API_USERNAME'])" --env-var "password=$($creds['API_PASSWORD'])"

# 4. empty-state pass — schema without seed data
#    stop the server
cd server; npm run db:reset -- --empty; npm start   # terminal A
cd api-tests
npx @usebruno/cli run empty-state --env local --env-var "username=$($creds['API_USERNAME'])" --env-var "password=$($creds['API_PASSWORD'])"

# 5. leave the workspace clean
#    stop the server
cd server; npm run db:reset
```

The expired token is generated without printing it:

```powershell
$expired = node --input-type=module -e "import jwt from 'jsonwebtoken'; import { config } from './src/config/env.js'; process.stdout.write(jwt.sign({ sub: config.apiUsername }, config.jwtSecret, { algorithm: 'HS256', expiresIn: '-1s' }));"
```

`npx` downloads the Bruno CLI into the npm cache; it is **not** a dependency of `server/package.json`.

## Evidence — two consecutive passes (identical)

| Folder | Requests | Assertions | Pass 1 | Pass 2 |
|---|---|---|---|---|
| main | 46 | 145/145 | ✅ | ✅ |
| edge | 7 | 22/22 | ✅ | ✅ |
| server-error | 6 | 22/22 | ✅ | ✅ |
| empty-state | 2 | 7/7 | ✅ | ✅ |
| **total** | **61** | **196/196** | ✅ | ✅ |

Negative control (A4): deleting one seed row made `LIST-200-01` fail (`expected 4 to equal 5`); the row
was restored with `db:reset`. No production code was changed.

## Bruno layout

```
api-tests/
  bruno.json
  environments/local.bru       baseUrl + placeholder credentials (no secrets committed)
  main/        00-login · LOGIN-400-01 · LOGIN-401-01 · LIST/GET · POST · PUT · DELETE
  edge/        00-login · GET-200-02 … GET-200-07   (after npm run db:seed:edge)
  server-error/00-login · LIST-500-01 … DELETE-500-01 (after npm run db:break)
  empty-state/ 00-login · LIST-200-04               (after npm run db:reset -- --empty)
```

## UI tests (only after Gate G3)

ADMIN-01 … ADMIN-11 and WEB-01 … WEB-04 are defined in `docs/context/screens.md`; run with `cd e2e && npx playwright test ui`.

## Post-MVP API extras (module M6a, after Gate G3)

| ID | Case | Expected | Folder | Result |
|---|---|---|---|---|
| RBAC-200-01 | reader lists projects | 200, only PUBLISHED | rbac | ⬜ |
| RBAC-403-01/02/03 | reader POST / PUT / DELETE | 403 `FORBIDDEN` | rbac | ⬜ |
| RBAC-404-01 | reader GET of a DRAFT id | 404 | rbac | ⬜ |
| RBAC-REG-01 | full 24-case matrix again with admin | all pass | main | ⬜ |

## Defect reporting

Any failure or surprise → `docs/qa/bug-log.md` (template inside), then fix in the right layer and re-run.
