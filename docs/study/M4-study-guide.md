# M4 — QA suite · Study guide

What was built, why, and how to defend it. Companion of `docs/specs/M4-qa.md`.

## 1. Current status

| Item | Value |
|---|---|
| Branch | `feat/m4-qa-suite` (from the M3 line, `21eb032`) |
| Roadmap status | M4 = 🔎 (waiting developer review) |
| Gate | G3 **not ticked** (only the developer ticks gates) |
| Push / merge | Not done. Local commits only. |
| Playwright (T5) | Deferred by the developer: M4 covers Bruno only |
| Next module | M5, only after an explicit "continue to M5" |

## 2. Files

### Created

| File | What it does | Why it exists |
|---|---|---|
| `api-tests/bruno.json` | Marks the folder as a Bruno collection | The CLI needs a collection root |
| `api-tests/environments/local.bru` | `baseUrl` + placeholder credentials | One environment per machine; no secret is committed |
| `api-tests/main/00-login.bru` | Logs in and stores the token in `{{token}}` | Every protected case reuses the token instead of hard-coding it |
| `api-tests/main/00b-LOGIN-400-01.bru` | Login without `password` | Contract case for the auth endpoint |
| `api-tests/main/00c-LOGIN-401-01.bru` | Login with a wrong password | Proves `INVALID_CREDENTIALS` and the generic message |
| `api-tests/main/01…11-LIST-*.bru` | 4 required list cases + 7 list extras | The list endpoint contract |
| `api-tests/main/12…17-GET-*.bru` | 4 required get cases + health/route extras | The get endpoint contract |
| `api-tests/main/18…29-POST-*.bru` | POST 201/400/401/409 + extras | The create contract |
| `api-tests/main/30…35-PUT-*.bru` | PUT 200/400/401/404/409 + extras | The replace contract |
| `api-tests/main/36…43-DELETE-*.bru` | Delete setup, 204/400/401/404, cleanup | The delete contract; the folder cleans up its own rows |
| `api-tests/edge/*.bru` | Reads the five edge seeds (`…0101`…`…0105`) | Proves accents, quotes, SQL text, max lengths and empty arrays survive a round trip |
| `api-tests/server-error/*.bru` | The five 500 cases | Run only after `db:break`; proves the sanitized envelope |
| `api-tests/empty-state/*.bru` | List with zero rows | Proves `data: []` and `total: 0` |
| `docs/study/M4-study-guide.md` | This file | Defence material |

### Modified

| File | Change |
|---|---|
| `docs/qa/test-plan.md` | Every case listed with a unique ID, Result ✅, exact run order, evidence table |
| `docs/qa/bug-log.md` | Says explicitly that no defect was found; template kept |
| `docs/specs/M4-qa.md` | T1–T4/T6 and A1–A4 ticked; T5 marked deferred; branch renamed |
| `docs/plan/roadmap.md` | M4 = 🔎, branch `feat/m4-qa-suite` |

### Not touched

No file under `server/` changed. `server/package.json` gained no dependency: the CLI runs through
`npx` from the npm cache.

## 3. How the pieces connect

```
00-login.bru  →  POST /api/v1/auth/login  →  200 { token }  →  bru.setVar("token", …)
                                                        │
        every protected .bru  ──────────────────────────┘
        Authorization: Bearer {{token}}

main/         needs 5 seed rows        (npm run db:reset)
edge/         needs 5 + 5 edge rows    (npm run db:seed:edge)
server-error/ needs no projects table  (npm run db:break)
empty-state/  needs schema, no rows    (npm run db:reset -- --empty)
```

Order inside `main/` matters and is fixed by `seq`: login → list/get → POST (creates the rows PUT and
DELETE reuse) → PUT → delete setup → DELETE → cleanup. `{{putId}}`, `{{defaultsId}}`, `{{specialId}}`
and `{{deleteId}}` are captured from the response of the request that created them, so no id is
hard-coded except the deterministic seeds.

Check order is asserted, not assumed: a request without a token never reaches body validation
(`LIST-401-01`, `POST-401-01`), and a bad body wins over a missing row (`PUT-400-01` before `PUT-404-01`).

## 4. Key ideas

1. **A test suite is a contract, not a script.** Each `.bru` file states one promise of
   `docs/context/api-contract.md` (status + error `code` + shape) and fails loudly when the promise
   breaks. *Analogy:* a checklist a building inspector signs, not a photo of the building.
2. **Determinism comes from the data, not from luck.** Fixed seed UUIDs, fixed `created_at` values and
   a `db:reset` before each pass mean the same 196 assertions run in the same order every time.
   *Analogy:* a board game where the pieces are glued to the start squares.
3. **The token is a session value, never a fixture.** It is obtained at run time, kept in a Bruno
   variable, and passed to the CLI from `.env`; the repository only contains `REPLACE_ME`.
   *Analogy:* a hotel key card printed at the desk, never copied into the brochure.

## 5. What was NOT created in this module

- No Playwright test, no `e2e/` folder, no CI pipeline (T5 deferred; CI is future work).
- No new server code, no new dependency, no `server/package.json` change.
- No OpenAPI/Swagger or diagrams (M5), no UI tests (after G3), no RBAC cases (M6a).
- No production bug was fixed: the suite found none.

## 6. Verification evidence

Two complete passes, each starting from `npm run db:reset`. Same commands, same order, same numbers.

| Folder | Requests | Assertions | Pass 1 | Pass 2 |
|---|---|---|---|---|
| main | 46 | 145/145 | ✓ PASS | ✓ PASS |
| edge | 7 | 22/22 | ✓ PASS | ✓ PASS |
| server-error | 6 | 22/22 | ✓ PASS | ✓ PASS |
| empty-state | 2 | 7/7 | ✓ PASS | ✓ PASS |
| **total** | **61** | **196/196** | ✓ PASS | ✓ PASS |

All 24 required status codes observed in the run (sample of the real CLI lines):

```
main\01-LIST-200-01 (200 OK)
main\04-LIST-400-01 (400 Bad Request)
main\09-LIST-401-01 (401 Unauthorized)
main\15-GET-404-01 (404 Not Found)
main\18-POST-201-01 (201 Created)
main\28-POST-409-01 (409 Conflict)
main\37-DELETE-204-01 (204 No Content)
server-error\01-LIST-500-01 (500 Internal Server Error)
server-error\05-DELETE-500-01 (500 Internal Server Error)
```

A4 negative control: a temporary Node script outside the repository deleted seed row `…0001`
(`rows now: 4`). `LIST-200-01` then failed with `expected 4 to equal 5` (4/5 assertions), which proves
the assertions are alive. The script was deleted and `npm run db:reset` restored the 5 rows. No
production file changed.

## 7. Commits

| Hash | Message |
|---|---|
| `58001a9` | `test(bruno): add collection skeleton and login helper` |
| `e12860d` | `test(bruno): add list and get contract cases` |
| `95ce9b0` | `test(bruno): add project write contract cases` |
| `876b90a` | `test(bruno): add edge, empty-state and server-error folders` |
| `a99e7a6` | `docs(qa): record the 24-case matrix results and run order` |
| `e207229` | `docs(m4): tick verified criteria and set module status` |

## 8. Three questions the professor could ask

1. **Why Bruno and not Jest + Supertest?**
   Bruno talks to the running server over HTTP, so it tests exactly what a client sees: real status
   codes, real headers, real JSON. It needs no server code and no dependency in `server/`, and the
   same collection can be opened in the Bruno GUI to debug a failure by hand.
2. **How do you know a passing test would actually catch a bug?**
   With the negative control (A4): removing one seed row made `LIST-200-01` fail on `meta.total`.
   A suite that never fails proves nothing, so we broke the data on purpose, saw the failure, and
   restored it.
3. **Why are the 500 tests in a separate folder?**
   A 500 needs a broken database (`db:break` drops the `projects` table). Keeping those requests apart
   means the normal pass never depends on a damaged database, and the order stays explicit:
   main → edge → break → server-error → empty → reset.
