# Architecture — layered OOP

Always applies. Request flow:

```
Route → (authenticate → validate) → Controller → Service → Repository → SQLite
                                         ↑ errors thrown anywhere go to → errorHandler
```

## Responsibilities (strict)

| Layer | Does | Must NOT |
|---|---|---|
| **Route** | maps method+path to middlewares and a controller method | contain logic |
| **Middleware** | cross-cutting: auth, validation, errors | talk to the DB |
| **Controller** | read validated input from `req.validated`, call ONE service method, set status code and send the response | contain business rules, SQL, try/catch |
| **Service** | business rules: generate `id`, "does it exist?" → `NotFoundError`, orchestrate repository calls | know about `req`/`res`, write SQL |
| **Repository** | SQL (prepared statements), map DB row ⇄ domain object, translate DB constraint errors | contain business rules, know about HTTP |

If you are unsure where code belongs, apply this test: *"Would this code change if we swapped
Express for another framework?"* (→ controller/route) *"…swapped SQLite for another DB?"* (→ repository).

## Classes and dependency injection

- Controller, Service, Repository are **classes**. Dependencies come through the **constructor**
  (never `import`ed singletons inside methods). This is the "correct OOP" the professor grades.
- Use `#private` fields for injected dependencies (encapsulation).
- Wiring happens in ONE place: `src/routes/index.js` (the composition root):
  `db → ProjectRepository → ProjectService → ProjectController → routes`.
- Repository methods are `async` even though `better-sqlite3` is synchronous (keeps the layer
  swappable for an async database later).

## Reference skeletons (copy this shape)

```js
// repositories/ProjectRepository.js — all SQL for the `projects` table lives here.
export class ProjectRepository {
  #db;
  constructor(db) { this.#db = db; }

  async findById(id) {
    const row = this.#db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    return row ? toProject(row) : null;      // null = not found (service decides what that means)
  }
}
```

```js
// services/ProjectService.js — business rules.
import { NotFoundError } from '../errors/NotFoundError.js';
export class ProjectService {
  #repository;
  constructor(repository) { this.#repository = repository; }

  async getById(id) {
    const project = await this.#repository.findById(id);
    if (!project) throw new NotFoundError('Project', id);
    return project;
  }
}
```

```js
// controllers/ProjectController.js — HTTP in, HTTP out. Nothing else.
export class ProjectController {
  #service;
  constructor(service) { this.#service = service; }

  getById = async (req, res) => {            // arrow property: keeps `this` when passed to the router
    const project = await this.#service.getById(req.validated.params.id);
    res.status(200).json(project);
  };
}
```

## Express 5 facts agents get wrong

- Async handlers that throw/reject are forwarded to the error handler **automatically**.
  Do NOT write `try/catch` or an `asyncHandler` wrapper in controllers.
- `req.query` is a read-only getter: never assign to it. Validated data goes to `req.validated`.
- `express.json()` leaves `req.body` as `undefined` when there is no body (not `{}`).
- Do not use `'*'` string routes. The 404 handler is a plain `app.use(notFound)` at the end.
- Order in `app.js`: `/api-docs` (before helmet) → helmet → cors → `express.json({ limit: '100kb' })`
  → `/health` → routes → `notFound` → `errorHandler` (always last).

## Naming

| Kind | File | Symbol |
|---|---|---|
| Class | `ProjectService.js` | `ProjectService` |
| Error class | `NotFoundError.js` | `NotFoundError` |
| Middleware | `authenticate.js` | `authenticate` (function) |
| Zod schemas | `project.schemas.js` | `createProjectSchema`, `projectIdParamsSchema`… |
| Routes | `projects.routes.js` | `createProjectRoutes(controller, authenticate)` |

JSON uses camelCase; database columns use snake_case; the repository does the mapping.

## Adding a new resource later

Same five files (`schemas`, `Repository`, `Service`, `Controller`, `routes`) + one line in the
composition root + one migration + OpenAPI + Bruno folder. Nothing else changes.
