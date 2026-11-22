# M1 — Auth · Study guide

What was built, why, and how to defend it. Companion of `docs/specs/M1-auth.md`.

## 1. Current status

| Item | Value |
|---|---|
| Branch | `feat/m1-m3-projects-api` |
| HEAD before this guide | `ae4b9ec feat(server): add API composition root and mount auth routes` |
| Roadmap status | M1 = 🔎 (waiting developer review) |
| Gate | G1 **not ticked** (only the developer ticks gates) |
| Push / merge | Not done. Local commits only; the developer decides. |
| Next module | M2, only after an explicit "continue to M2" |

## 2. Files

### Created

| File | What it does | Why it exists |
|---|---|---|
| `server/src/middlewares/validate.js` | Factory `validate({ params, query, body })`: runs the Zod schemas a route asks for, stores parsed data in `req.validated`, turns issues into `ValidationError` | One generic validation middleware for every module (M2/M3 reuse it); controllers never touch raw input |
| `server/src/models/auth.schemas.js` | `loginSchema`: `{ username, password }`, both non-empty strings, `.strict()` | Login input rules live with the other Zod schemas; `.strict()` gives the 400 on unknown fields |
| `server/src/services/AuthService.js` | `login(username, password)`: timing-safe comparison with the env user, signs `{ sub }` with HS256, returns `{ token, tokenType, expiresIn }` | Business rule layer: no `req`/`res`, so the auth rule can be replaced (e.g. Better Auth) without touching HTTP |
| `server/src/controllers/AuthController.js` | `login`: reads `req.validated.body`, calls the service once, answers 200 | HTTP in / HTTP out only; Express 5 forwards rejections, so no `try/catch` |
| `server/src/routes/auth.routes.js` | `POST /login` → `validate({ body })` → controller | Route = method + path + middlewares, no logic |
| `server/src/middlewares/authenticate.js` | `createAuthenticate(config)`: requires `Authorization: Bearer <token>`, verifies HS256, sets `req.user`, throws the three 401 codes | The guard every protected route will use from M2 on |
| `server/src/routes/index.js` | Composition root: builds `AuthService → AuthController → auth router` from `config` | One single place where objects are wired (the OOP/DI requirement) |

### Modified

| File | Change | Why |
|---|---|---|
| `server/src/config/env.js` | Added one frozen `config` object grouping `port`, `databasePath`, `jwtSecret`, `jwtExpiresIn`, `apiUsername`, `apiPassword` | Layers receive settings through their constructor; `process.env` is still read only here |
| `server/src/app.js` | Imports `config` + `createApiRouter`, mounts `app.use('/api/v1', createApiRouter(config))` before `notFound` | Wires the API under its base path; order keeps `notFound` and `errorHandler` last |

### Deleted

Nothing. The temporary `_ping` route from the spec was replaced by a throwaway harness **outside**
the repository, which was deleted after use, so no extra route exists in the codebase.

### Key lines

- `validate.js` — `req.validated[part] = result.data`: the controller reads the **parsed** value
  (trimmed/coerced), never `req.body` directly.
- `AuthService.js` — `safeEqual()` hashes both sides with SHA-256 before `timingSafeEqual`:
  equal lengths (no throw) and no timing leak about which field was wrong.
- `AuthService.js` — `jwt.sign({ sub: username }, ..., { algorithm: 'HS256', expiresIn })`: `sub`
  is the standard "subject" claim; `authenticate` reads it back into `req.user`.
- `authenticate.js` — `jwt.verify(token, secret, { algorithms: ['HS256'] })`: pinning the algorithm
  blocks `alg: none` / algorithm-confusion attacks.
- `authenticate.js` — `error instanceof jwt.TokenExpiredError` → `TOKEN_EXPIRED`, everything else →
  `INVALID_TOKEN`; `errorHandler` adds `WWW-Authenticate: Bearer` for every 401.
- `env.js` — `Object.freeze(config)`: nobody can mutate the settings at runtime.

## 3. How the pieces connect

Login (public):

```
POST /api/v1/auth/login
  app.js  → app.use('/api/v1', createApiRouter(config))
  routes/index.js → router.use('/auth', createAuthRoutes(authController))
  auth.routes.js  → validate({ body: loginSchema })
  validate.js     → Zod ok? req.validated.body : throw ValidationError (400)
  AuthController.login → AuthService.login(username, password)
  AuthService     → safeEqual ×2 → jwt.sign → { token, tokenType, expiresIn }
  controller      → res.status(200).json(...)
```

Any error thrown on the way goes to `errorHandler` (last middleware) and becomes
`{ error: { code, message, details } }`.

Protected route (from M2 on):

```
Route → authenticate (401 MISSING_TOKEN / INVALID_TOKEN / TOKEN_EXPIRED) → validate (400)
      → Controller → Service → Repository → SQLite
```

`authenticate` is a **factory**: `createAuthenticate(config)` returns the middleware, so the secret
is injected instead of imported inside the middleware. M2 passes the same instance to the projects
routes.

## 4. Key ideas

1. **The secret never travels.** The server signs a token; it does not send the password back.
   *Analogy:* a club stamps your hand at the door — the bouncer only checks the stamp, never your ID again.
2. **Same answer for both failures.** Wrong user and wrong password return the same 401 body.
   *Analogy:* a safe deposit box clerk says "that key does not open this box", never "wrong key, right box".
3. **One composition root.** Objects are built once, in `routes/index.js`, and passed down.
   *Analogy:* a restaurant kitchen gets its ingredients from one supplier; cooks never grow their own tomatoes.

## 5. What was NOT created in this module

- No users table, no roles, no `authorize` middleware, no 403, no refresh tokens, no rate limiting.
- No protected project routes yet (M2), no project schemas/repository/service (M2/M3).
- No `_ping` route, no Bruno collection, no Playwright tests, no OpenAPI (M4/M5).
- No changes to `docs/qa/test-plan.md`: the login cases there (LOGIN-200-01/400-01/401-01) are
  Bruno tests that belong to M4; behavior documented there did not change.

## 6. Verification evidence

DB reset with `npm run db:reset` before the final pass (5 rows loaded). Credentials read from
`server/.env` inside the shell, never printed; the token is masked in the output.

| Criterion | Command (abridged) | Real result |
|---|---|---|
| A1 | `curl -i -X POST .../auth/login` with `.env` credentials | `HTTP/1.1 200 OK` · `{"token":"<masked>","tokenType":"Bearer","expiresIn":"1h"}` |
| A2 | same, password `wrong` | `HTTP/1.1 401` · `WWW-Authenticate: Bearer` · `INVALID_CREDENTIALS` |
| A2 | same, username `ghost` | identical 401 body (`INVALID_CREDENTIALS`, same message) |
| A3 | body `{"username":"admin"}` | `400` · `VALIDATION_ERROR` · `details[0].path = "password"` |
| A3 | body + `"role":"admin"` | `400` · `VALIDATION_ERROR` · `Unrecognized key: "role"` |
| A3 | malformed JSON `{"username":` | `400` · `INVALID_JSON` |
| A3 | valid JSON with `Content-Type: text/plain` | `400` · `VALIDATION_ERROR` |
| A4 | harness: no `Authorization` header | `401` · `WWW-Authenticate: Bearer` · `MISSING_TOKEN` |
| A4 | harness: `Bearer not-a-real-token` | `401` · `INVALID_TOKEN` |
| A4 | harness: `Basic <token>` | `401` · `MISSING_TOKEN` |
| A4 | harness: valid token | `200` · `{"pong":true,"user":{"username":"admin"}}` |
| A5 | harness: token signed with `expiresIn: '-1s'` | `401` · `TOKEN_EXPIRED` |
| A6 | every 401 above | header `WWW-Authenticate: Bearer` present |
| Regression | `GET /health`, `GET /api/v1/auth/login`, `GET /api/v1/projects` | `200`, `404 ROUTE_NOT_FOUND`, `404 ROUTE_NOT_FOUND` |

A4/A5 were checked with a scratch script (not committed) that mounted the real `authenticate` and
the real `errorHandler` on a throwaway Express app on port 3101 and called it over HTTP, because M1
adds no protected route to the project. M2 re-verifies the middleware on the real routes.

## 7. Commits

| Hash | Message |
|---|---|
| `b5b4b07` | `feat(validation): add generic Zod validate middleware` |
| `839c14a` | `feat(auth): add login schema and auth service` |
| `40e7e26` | `feat(auth): add login endpoint` |
| `4b8bc46` | `feat(auth): add JWT authenticate middleware` |
| `ae4b9ec` | `feat(server): add API composition root and mount auth routes` |

## 8. Three questions the professor could ask

1. **Why hash the credentials with SHA-256 before `timingSafeEqual`?**
   `timingSafeEqual` throws when the buffers have different lengths, and comparing raw strings
   leaks length. Hashing both sides gives 32-byte buffers, so the comparison is constant-time and
   safe for any input length.
2. **How do you know the token was not tampered with?**
   The signature is computed with the server's `JWT_SECRET` (HS256). `jwt.verify` recomputes it and
   rejects the token if the payload or signature changed, returning 401 `INVALID_TOKEN`. The
   algorithm is pinned to HS256 so a forged `alg` header cannot be used.
3. **Why is `authenticate` a factory and not a plain middleware?**
   It needs the secret, and the rule is constructor/parameter injection, not importing settings
   inside the middleware. `createAuthenticate(config)` receives the config from the composition
   root, which also makes the middleware testable with a different secret.
