# Professor requirements (condensed, authoritative)

Source: 4 messages from the professor. Anything not here is *unconfirmed*, not a fact.

## Must-have

| # | Requirement |
|---|---|
| 1 | REST API (CRUD), worth **35 %** of the final grade |
| 2 | Minimum **5 web services**: GET list, GET by id, POST, PUT **or** PATCH, DELETE |
| 3 | All code (classes, methods, parameters) in **English** |
| 4 | Data comes from a **database** |
| 5 | Correct **OOP** |
| 6 | **Resource Oriented Design** |
| 7 | **YAML** documentation (OpenAPI) |
| 8 | Documentation with **diagrams** |
| 9 | **HTTP status codes** per the table below |
| 10 | **Professional context**: choose ≥ 1 role and add standard industry tasks. Ours: **Quality Assurance & Testing** |
| 11 | Presentation 10 min: first 5 free, last 5 Q&A **about the code** |
| 12 | Presenting in English = **+10 points** |

## Status codes (401 applies to GETs too: the whole API requires authentication)

| Endpoint | Codes |
|---|---|
| GET (list) | 200 / 400 / 401 / 500 |
| GET (by id) | 200 / 400 / 401 / 404 / 500 |
| POST | 201 / 400 / 401 / 409 / 500 |
| PUT (or PATCH) | 200 / 400 / 401 / 404 / 500 |
| DELETE | 204 / 400 / 401 / 404 / 500 |

## QA role: examples the professor gave (Java/MySQL oriented; we translate to our stack)

API tests that verify status codes (Postman/JUnit+RestAssured → **Bruno + Playwright**) · run the suite in
a pipeline so the build fails when a test fails · scripts that seed the DB with test data and edge
cases (empty tables, huge payloads) → `database/seed/` + `db:reset`. "Any other related task" is valid.

## Unconfirmed (ask the professor; do not assume)

- [ ] Node.js + SQLite accepted instead of Java + MySQL
- [ ] Final presentation date
- [ ] How requirement 10 is graded
- [ ] Feedback on the Oct 26 progress presentation
- [ ] Same code table if PATCH is used
