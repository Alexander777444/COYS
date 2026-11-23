# Bug log

No defects were found while running the M4 suite. Both full passes were green (61 requests, 196/196
assertions), so there is nothing to log here yet; the template below stays for future modules.

| ID | Date | Test ID | Summary | Severity | Root cause (layer) | Status | Fix commit |
|---|---|---|---|---|---|---|---|

Severity: **S1** wrong status code vs professor table · **S2** wrong body/shape · **S3** cosmetic/doc.
Workflow: reproduce → log → fix (right layer) → re-run full pass → mark `fixed`.

## Observations (not defects)

- The Bruno CLI reports `Tests 0/0` even when `test()` calls inside `script:post-response` pass and are
  printed under "Post-Response Tests". This is a CLI summary quirk, not an API problem; the assertions
  row still counts every `assert` block.
- `db:break` drops the `projects` table, so the server logs the SQLite stack trace to its own console.
  That is expected: the client only ever receives the sanitized `INTERNAL_ERROR` envelope (verified by
  the "no SQL is leaked" tests).
