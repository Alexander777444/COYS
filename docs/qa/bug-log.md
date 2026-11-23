# Bug log

No API defects were found while running the M4 suite. Both full passes were green (61 requests,
196/196 assertions). The table below is kept for future API defects and real environment/process
findings; no items are invented.

| ID | Date | Test ID | Summary | Severity | Root cause (layer) | Status | Fix commit |
|---|---|---|---|---|---|---|---|
| ENV-01 | 2026-11-20 | — | `better-sqlite3` native binary was missing after the merge (`build/Release/better_sqlite3.node` absent), so any DB-backed request failed with a bindings-not-found error. Rebuilt with the package's own `prebuild-install` inside `server/node_modules`; no repository file changed. | Environment/process finding (not an API defect) | Environment / dependency native binary | Resolved (environment) | N/A |
| ENV-02 | 2026-11-20 | — | The database was left broken by a previous `db:break` run (the `projects` table was dropped), causing DB-backed requests to return 500 until the database was repaired. Repaired with `npm run db:reset` from `server/`. | Environment/process finding (not an API defect) | Process / test-data lifecycle | Resolved (environment) | N/A |
| ENV-03 | 2026-11-20 | — | Node 20 vs `better-sqlite3` v13 compatibility constraint: the project is developed/verified on Node 20.20.2 and pins `better-sqlite3` to `^11.10.0`; v13+ requires a newer Node runtime. The dependency pin prevents an incompatible major upgrade on Node 20. | Environment/process finding (not an API defect) | Environment / dependency compatibility | Mitigated (pinned) | N/A |

Severity: **S1** wrong status code vs professor table · **S2** wrong body/shape · **S3** cosmetic/doc.
Workflow: reproduce → log → fix (right layer) → re-run full pass → mark `fixed`.

## Observations (not defects)

- The Bruno CLI reports `Tests 0/0` even when `test()` calls inside `script:post-response` pass and are
  printed under "Post-Response Tests". This is a CLI summary quirk, not an API problem; the assertions
  row still counts every `assert` block.
- `db:break` drops the `projects` table, so the server logs the SQLite stack trace to its own console.
  That is expected: the client only ever receives the sanitized `INTERNAL_ERROR` envelope (verified by
  the "no SQL is leaked" tests).
