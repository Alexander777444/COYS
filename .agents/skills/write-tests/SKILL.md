---
name: write-tests
description: Write QA tests for COYS — Bruno API requests (contract suite for the 24 required status-code cases) and Playwright tests (API smoke now, UI after the MVP gate). Use for module M4/M6 or whenever an endpoint changes.
---

# write-tests

## Read first
`rules/testing.md` · `docs/qa/test-plan.md` (the IDs you must implement) · `docs/context/database-structure.md` (seed ids).

## Bruno request (`api-tests/main/get/GET-404-01.bru`)

```
meta {
  name: GET-404-01 valid uuid that does not exist
  type: http
  seq: 4
}

get {
  url: {{baseUrl}}/api/v1/projects/00000000-0000-4000-8000-0000000000ff
  body: none
  auth: bearer
}

auth:bearer {
  token: {{token}}
}

assert {
  res.status: eq 404
  res.body.error.code: eq NOT_FOUND
}
```

- `00-login.bru` (POST `/api/v1/auth/login`) saves the token:
  `script:post-response { bru.setEnvVar("token", res.body.token); }` — each folder run starts with it.
- Unique data for mutating tests, in `script:pre-request { bru.setVar("slug", "qa-" + Date.now()); }`
  and use `{{slug}}` in the body. A DELETE/PUT test creates its own project first and stores its id
  with `bru.setVar("projectId", res.body.id)`.
- No-token cases: set `auth: none` in the `get` block.
- Run from `api-tests/`: `bru run main --env local` (`bru run <folder>` runs one folder). If Bruno
  syntax is rejected, export a working request from the Bruno app and copy its structure.

## Playwright API smoke (`e2e/`)

`e2e/playwright.config.js`:
```js
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '.',
  use: { baseURL: 'http://localhost:3000' },
  webServer: { command: 'npm run dev --prefix ../server', url: 'http://localhost:3000/health', reuseExistingServer: true },
});
```
`e2e/api/smoke.spec.js` (API tests need no browser):
```js
import { test, expect } from '@playwright/test';
let token;
test.beforeAll(async ({ request }) => {
  const res = await request.post('/api/v1/auth/login', { data: { username: process.env.API_USERNAME, password: process.env.API_PASSWORD } });
  token = (await res.json()).token;
});
test('SMOKE-01 list requires auth', async ({ request }) => {
  expect((await request.get('/api/v1/projects')).status()).toBe(401);
});
test('SMOKE-02 list with token', async ({ request }) => {
  const res = await request.get('/api/v1/projects', { headers: { Authorization: `Bearer ${token}` } });
  expect(res.status()).toBe(200);
});
```
Run: `cd e2e && npx playwright test api`. UI tests (`e2e/ui/`) only after Gate G3.

## Checklist
- [ ] ID matches `test-plan.md` · [ ] asserts status + error code/shape · [ ] independent and repeatable
- [ ] result column updated · [ ] failures logged in `bug-log.md`, assertions never weakened
