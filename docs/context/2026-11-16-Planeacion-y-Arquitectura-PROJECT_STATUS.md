# PROJECT_STATUS — COYS (Studio Portfolio API)

**Última actualización:** 2026-11-16
**Conversación:** Planeación-y-Arquitectura
**Fase actual:** Sprint 0 (cimientos). Esqueleto creado localmente; documentación redactada; aún sin código de endpoints en el repo.
**Reemplaza a:** `2026-10-26-Planeacion-Inicial-PROJECT_STATUS.md` (desactualizado: hablaba de TypeScript y Prisma). Borrarlo de la memoria del proyecto.

> Cómo usar este archivo: léelo completo al abrir un chat nuevo. Es el traspaso de todo lo hablado hasta hoy. Lo que dice "por confirmar" no es un hecho.

---

## 1. Qué es el proyecto (resumen)
**COYS** = proyecto final individual de la materia *Programación de Servicios Web*. Es una API REST (Node.js + Express, JavaScript) sobre PostgreSQL que administra el contenido del sitio web del despacho/startup de desarrollo de software del desarrollador: proyectos del portafolio (recurso principal `/projects`), y más adelante servicios y solicitudes de clientes. Es un *headless CMS*: el sitio React será su primer cliente futuro. **Lo que se evalúa es la API.** Nombre publicado para el hilo del profesor: *Studio Portfolio API*.

**Nota importante:** el desarrollador tiene **otro proyecto de desarrollo en paralelo** cuyos documentos (constitution, design-system, motion-language, etc.) NO pertenecen a COYS. Claude no leyó sus contenidos (solo vio los nombres de archivo en una captura). Nada de ese proyecto debe usarse como dato de COYS (fechas, fases, tecnologías). Deben vivir en su propio proyecto de Claude.

## 2. Requisitos del profesor (resumen; texto completo en `docs/reference/professor-requirements.md`)
- Mínimo 5 web services: GET lista, GET por ID, POST, PUT, DELETE.
- Código (clases, métodos, parámetros) en inglés; datos desde una BD; POO correcta; Resource Oriented Design; documentación YAML (OpenAPI); documentación con diagramas; manejo de códigos HTTP.
- Códigos por endpoint: GET lista 200/400/401/500 · GET id 200/400/401/404/500 · POST 201/400/401/409/500 · PUT 200/400/401/404/500 · DELETE 204/400/401/404/500. **El 401 aplica también a los GET.**
- Proyectos individuales y sin duplicados (el primero en publicar en el hilo se queda el proyecto).
- Avance: 26 de octubre de 2026 (**ya pasó**; no se sabe cómo le fue ni qué retroalimentación dio el profesor). Presentación final: 10 min, **fecha por definir**. En inglés = **+10 puntos**.

## 3. Stack y decisiones vigentes (detalle y porqué en `docs/decisions.md`, ADR-001 a ADR-012)
| Tema | Decisión | Estado |
|---|---|---|
| Alcance | La API es el proyecto; el sitio es el primer cliente (después) | Firme |
| Lenguaje | **JavaScript ES Modules con `class`** (el desarrollador lo domina; TypeScript queda como mejora futura) | Firme (reemplaza al plan TypeScript) |
| Backend | **Express** sobre Node.js 20+ | Firme |
| Base de datos | **PostgreSQL** (relacional, UNIQUE genera el 409) | Firme |
| Hosting de la BD | **Supabase** usado SOLO como PostgreSQL vía driver `pg` (sin `supabase-js` ni su API automática) | ⚠️ **Por confirmar:** el desarrollador "recordaba" Supabase; en la propuesta original eran Neon o Supabase. Revisar si ya tiene cuenta. Cambiar a Neon solo afecta `DATABASE_URL` y los ADR-004/005 |
| Acceso a datos | `pg` + clases Repository con SQL parametrizado (sin ORM; reemplaza el plan Prisma) | Firme |
| Validación | Zod (genera los 400) | Firme |
| Autenticación | JWT con roles `admin` (GET/POST/PUT/DELETE) y `reader` (solo GET). Sin token o inválido → 401; `reader` escribiendo → 403 (extra, no está en la tabla del profesor) | Firme; **por confirmar con el profesor** |
| Arquitectura | Route → Controller → Service → Repository → PostgreSQL | Firme |
| Pruebas de API | **Bruno** (lo mostraron en clase) + CLI `bru run` en CI | Firme |
| Pruebas de UI | **Playwright**, solo cuando exista `client/` con pantallas (Fase 3) | Firme |
| CI | GitHub Actions (`ci.yml`): lint, Postgres como servicio, migraciones, servidor, colección Bruno | Planeado (Sprint 2) |
| Deploy alpha | **Vercel** para `server/` (Express con configuración cero); Cloudflare Workers descartado para el backend (requiere `nodejs_compat` + Hyperdrive = reescribir la capa de datos); Cloudflare Pages queda como opción para `client/` | Planeado (Sprint 2) |
| Agente de código | **OpenCode** (con `AGENTS.md`); Copilot es alternativa | Firme |
| Carpetas | Monorepo `client/` + `server/` + `database/` + `docs/` (ver §5) | Firme |

## 4. Qué se hizo en esta conversación (cronología)
1. Se analizaron los dos mensajes del profesor y se extrajeron requisitos, fechas y puntos por confirmar.
2. Se validó que un sitio de portafolio solo cumple si se enfoca como API (headless CMS); recurso principal `/projects`.
3. Se eligió stack y se preparó la defensa (por qué CRUD, REST, esas tecnologías, preguntas trampa, estructura de presentación de 10 min, frases en inglés).
4. Se definió el sistema de trabajo con archivos: `PROJECT_CONTEXT.md` (estable) + `PROJECT_STATUS` (vivo) + `SESSION_LOG` (opcional). Nomenclatura de estado: `YYYY-MM-DD-NombreDeConversacion-PROJECT_STATUS.md`.
5. **Error de Claude (rol):** Claude construyó un baseline completo de código y una interfaz web cuando su rol es PM/guía. El desarrollador corrigió: Claude solo guía; el código lo escribe un agente (OpenCode/Copilot). Rol vigente: ver §8.
6. Se redefinió el flujo con agentes, CI/CD, Playwright/Bruno y deploy alpha; se investigó el estado actual de Vercel (Express soportado sin configuración) y de Cloudflare.
7. El desarrollador definió sus herramientas (React, JavaScript, CSS, Node, carpetas `client`/`server`/`database`). Se acordó JavaScript total.
8. Se entregó el prompt de OpenCode para crear el esqueleto en la carpeta `COYS` (apéndice A).
9. El `git push` falló con "rejected (fetch first)" porque el repo remoto no estaba vacío. Se dieron dos soluciones (§9).
10. El desarrollador subió al proyecto los documentos de su otro proyecto como referencia de formato. Claude redactó los 10 documentos de COYS (§6).
11. Se aclaró que Claude **no** había leído esos documentos y había afirmado detalles que no podía verificar (§10).
12. Se detectó que la elección Supabase vs Neon nunca fue un acuerdo firme (§3, §11).

## 5. Estructura de carpetas acordada
Lo marcado *(después)* NO se crea hasta su fase. Las carpetas vacías llevan `.gitkeep`.
```
COYS/
├── .github/workflows/ci.yml        (después, Sprint 2)
├── client/                         React + Vite (solo scaffold de Vite por ahora; trabajo real en Fase 3)
├── server/
│   ├── src/
│   │   ├── config/  controllers/  services/  repositories/
│   │   ├── middlewares/  models/  errors/  routes/  db/
│   │   ├── app.js        (arma y exporta Express; lo que Vercel usa)
│   │   └── server.js     (listen(), solo local)
│   ├── tests/            (opcional)
│   ├── .env.example
│   └── package.json
├── database/
│   ├── migrations/       (001_create_projects.sql ...)
│   └── README.md
├── api-tests/            (después, Sprint 1: colección Bruno)
├── e2e/                  (después, Fase 3: Playwright)
├── docs/                 constitution, architecture, api-design, development-standards, decisions,
│                         reference/professor-requirements, tasks/sprint-00, sprint-01
│                         (después: openapi.yaml, diagrams/, demo-script.md)
├── AGENTS.md
├── README.md
└── .gitignore
```
Comandos del backend se corren desde `server/`. El repo no lleva `node_modules/`, `dist/` ni `.env`.

## 6. Entregables generados (dónde está cada cosa)
| Entregable | Destino | Notas |
|---|---|---|
| `constitution.md`, `architecture.md`, `api-design.md`, `development-standards.md`, `decisions.md`, `reference/professor-requirements.md`, `tasks/sprint-00.md`, `tasks/sprint-01.md` | Repo, carpeta `docs/` (tarea S0-03) | En inglés. Los pidió el desarrollador "como en su otro proyecto" |
| `AGENTS.md` | Raíz del repo (reemplaza el básico del prompt) | Reglas del agente |
| `PROJECT_CONTEXT.md` (actualizado) | Memoria del proyecto de Claude, **no al repo** | Reemplaza al viejo (que decía TypeScript/Prisma/Cloudflare) |
| `2026-11-05-Minuta-Estado-del-Proyecto.md` | Memoria del proyecto | Minuta del estado a esa fecha |
| `studio-portfolio-api.zip` | Referencia opcional (baseline) | Ver §7 |

## 7. El baseline generado por Claude (referencia opcional)
Claude construyó y **probó** un baseline en `studio-portfolio-api.zip`. Es TypeScript + `pg` + Express + JWT + Zod + Swagger UI, y una consola web simple. Resultados: los 5 endpoints más `POST /auth/login` pasan todos los códigos exigidos (200, 201, 204, 400, 401, 404, 409; 403 extra; 500 verificado deteniendo la BD) con `scripts/smoke-test.sh` contra PostgreSQL 16 local.
- Aprendizaje técnico del baseline: un `error` en una conexión inactiva del pool puede tumbar el servidor; se maneja con `pool.on("error", ...)`.
- **No coincide con las decisiones actuales** (está en TypeScript y trae una interfaz que el desarrollador no necesita como entregable).
- **Decisión pendiente del desarrollador:** **A)** migrarlo a JavaScript y usarlo como punto de partida (acelera Sprint 1: S1-02 a S1-05 se vuelven "migrar y revisar"), o **B)** descartarlo y construir por briefs (más aprendizaje, más lento). Recomendación de Claude: A, usando los briefs para endurecerlo y aprenderlo.

## 8. Cómo trabajamos (reglas del sistema)
- **Claude = PM y mentor:** planea, escribe briefs (Inputs / Do / Criteria / Out of scope), define criterios de aceptación, revisa, detecta riesgos de tiempo y alcance, prepara la defensa y la práctica de presentación en inglés. **No escribe el código del proyecto** salvo petición explícita.
- **OpenCode = implementa** una tarea por rama y abre un Pull Request. Nunca hace `git push` ni merge.
- **Desarrollador = revisa el diff, explica el cambio con sus palabras, hace el merge y decide.**
- Idioma: explicaciones en **español**; código, nombres, comentarios, commits y docs en **inglés**.
- Explicar siempre el porqué de las decisiones (hay que defenderlas ante el profesor).
- Si el desarrollador propone algo extra, recordar qué está en el MVP. Prioridad: los requisitos del profesor.
- Prompt de **cierre de sesión:** "Genera la versión actualizada completa de PROJECT_STATUS.md con: fecha; hecho/en progreso/pendiente; decisiones y su porqué; novedades del profesor; qué aprendí; bloqueos y riesgos; siguiente paso; cambios a PROJECT_CONTEXT; una línea para SESSION_LOG. No inventes avances."
- Prompt de **apertura:** "Lee PROJECT_STATUS.md. Resume en 5 líneas dónde estamos, el siguiente paso y el riesgo de tiempo. Avísame si algo contradice PROJECT_CONTEXT.md."
- Un chat por tema/tarea; un solo STATUS vivo en la memoria (borrar el anterior al subir el nuevo).

## 9. Incidente del `git push` (resuelto con instrucciones; resultado por confirmar)
Causa: el repo de GitHub no estaba vacío (se creó con README/.gitignore/licencia). Remoto: `https://github.com/Alexander777444/COYS.git`. Opciones dadas: (A) `git pull origin main --allow-unrelated-histories --no-rebase --no-edit`, resolver conflictos conservando las versiones locales de `README.md` y `.gitignore`, y luego `git push -u origin main`; (B) `git push -u origin main --force-with-lease` (seguro solo porque el repo es nuevo). **Por confirmar** cuál usó y si el push funcionó.

## 10. Correcciones y errores de Claude que no deben repetirse
- **Fechas:** Claude dio la fecha incorrecta en varias ocasiones (19, 23 y 26 de octubre). El avance del 26 ya pasó. Verificar siempre la fecha real.
- **Documentos del otro proyecto:** Claude afirmó haberlos leído y citó detalles (orden de autoridad, "Annex A", fechas de entrega) que no podía verificar. Esos datos deben ignorarse. Solo es cierta la estructura de carpetas vista en la captura.
- **Vercel:** Claude dijo al inicio que Vercel era incómodo para Express; la documentación actual indica que lo soporta sin configuración.
- **Rol:** Claude escribió código cuando debía guiar (ver §4.5).
- **Supabase:** Claude lo dio por "decidido" cuando era una de dos opciones.

## 11. Conceptos aprendidos / explicados (para repasar y defender)
- **Headless CMS:** la API es el backend; el sitio es un cliente reemplazable.
- **Origen de cada código HTTP:** 400 (Zod, UUID mal formado, query inválida, JSON roto), 401 (token faltante/inválido/expirado), 403 (token válido sin permiso), 404 (no existe el ID o la ruta), 409 (violación UNIQUE `23505` en `slug`), 500 (error inesperado, p. ej. BD caída, vía ErrorHandler global).
- **401 vs 403:** sin identidad vs identidad sin permiso.
- **PUT vs PATCH:** PUT reemplaza el recurso completo; PATCH sería mejora futura.
- **Por qué el 409 se delega a la BD:** la restricción UNIQUE es segura incluso con peticiones concurrentes.
- **Resource Oriented Design:** sustantivos en plural (`/projects/{id}`), el verbo es el método HTTP.
- **Capas y POO:** cada capa tiene una responsabilidad; inyección de dependencias por constructor.
- **Connection pooling en serverless (explicación con la analogía del restaurante):** PostgreSQL acepta pocas conexiones simultáneas. En un servidor tradicional hay un solo pool; en Vercel cada instancia serverless crea el suyo y, con muchas instancias, se agotan las conexiones (error → 500). Solución: usar el **connection string del pooler** del proveedor y un pool pequeño por instancia (`DB_POOL_MAX`, por defecto 3). Verificar la documentación vigente del proveedor sobre modo transaccional y prepared statements.
- **Vercel + Express:** se exporta la app (`export default app`), `listen()` solo en local, `express.static` se ignora, y hay que verificar que Swagger UI funcione en el alpha.
- **Bruno vs Playwright:** capas distintas. Bruno para la API (demo + CI); Playwright para la interfaz (cuando exista).
- **Express vs Fastify, JavaScript vs TypeScript:** ver ADR-002 y ADR-003.

## 12. Defensa ante el profesor (respuestas base)
- **¿Por qué CRUD?** El contenido del despacho cambia constantemente (proyectos, servicios, solicitudes) y debe administrarse sin editar código.
- **¿Por qué REST?** Desacopla contenido y presentación; la misma API alimenta el sitio, una app móvil o un panel; estándar, stateless, escalable.
- **¿Por qué este stack?** Un solo lenguaje de punta a punta (JavaScript), PostgreSQL por la naturaleza relacional de los datos, y es el stack que usará con sus clientes.
- **Argumento fuerte:** no es un ejercicio; es el backend real de su startup.
- **Preguntas trampa:** ¿por qué no sitio estático? (cada cambio requeriría editar código y redeploy) · ¿por qué no MongoDB? (datos relacionales e integridad) · ¿por qué PUT y no PATCH? (el profesor pidió PUT; PATCH es mejora futura) · ¿por qué GET con autenticación? (requisito: 401 en todos; el sitio público usaría un token de solo lectura) · ¿seguridad? (JWT, Zod, variables de entorno, helmet, cors, SQL parametrizado).
- **Frases en inglés:** "My studio's content changes all the time, so CRUD lets me manage it through the API instead of editing code." · "REST decouples content from presentation: the same API can power my website today and a mobile app tomorrow." · "This isn't a practice exercise, it's the real backend for my software studio."
- **Estructura de los 10 min:** problema (1) · solución y arquitectura (2) · demo en vivo con errores (4) · decisiones técnicas (2) · siguientes pasos (1).

## 13. Estado general
| Área | Estado |
|---|---|
| Idea, alcance y requisitos del profesor | ✅ Definidos |
| Stack y arquitectura | ✅ Decididos (Supabase vs Neon ⚠️ por confirmar) |
| Documentación de COYS (10 archivos) | ✅ Redactados (falta copiarlos al repo, S0-03) |
| Prompt de OpenCode para el esqueleto | ✅ Entregado (apéndice A) |
| Esqueleto del repo (S0-01) | ⚠️ Creado localmente por OpenCode según lo reportado; **falta el reporte final de OpenCode** (árbol, versiones de express/pg/vite, resultado de `/health`) |
| Push a GitHub (S0-02) | ⚠️ Falló una vez; resultado por confirmar |
| Docs en el repo (S0-03) | ⬜ Pendiente |
| Decisión del baseline A/B (S0-04) | ⬜ Pendiente |
| Proteger `main` (S0-05) | ⬜ Pendiente |
| ESLint + Prettier (S0-06) | ⬜ Pendiente |
| Sprint 1: BD, errores, auth, CRUD, OpenAPI, Bruno, diagramas, README (S1-01 a S1-09) | ⬜ Pendiente |
| CI, deploy alpha, Playwright, `/inquiries`, React | ⬜ Fases posteriores |
| Publicación en el hilo del profesor | ⚠️ Por confirmar |

## 14. Bloqueos y riesgos
1. **Tiempo:** el avance ya pasó y falta la fecha de la presentación final → pedirla al profesor cuanto antes; sin ella no hay calendario de sprints.
2. **Alcance:** CI/CD, Playwright, deploy y React NO los pide el profesor; ninguno debe retrasar el MVP (Sprint 1).
3. **Dos proyectos en paralelo:** riesgo de mezclar contextos y de choque de fechas; mantener un proyecto de Claude por proyecto y bloques de 2–3 horas por proyecto.
4. **Hilo del profesor:** si no se ha publicado, hacerlo ya para reservar el proyecto.
5. **Aprender mientras avanza:** el desarrollador debe poder explicar cada pieza; regla: explicarle a Claude cada PR con sus palabras antes del merge.

## 15. Preguntas pendientes
Para el profesor: ¿restricción de tecnología? · ¿JWT es aceptable para el 401? · ¿es aceptable el 403 extra? · ¿se acepta demo con Swagger/Bruno sin interfaz? · ¿fecha de la presentación final? · ¿retroalimentación del avance del 26 de octubre?
Para el desarrollador: ¿baseline A o B? · ¿Supabase o Neon (¿ya tiene cuenta en alguna)? · ¿el push a GitHub quedó resuelto? · ¿ya publicó en el hilo? · ¿cuál es el resultado del reporte de OpenCode?

## 16. Siguiente paso concreto
1. Pegar a Claude el **reporte final de OpenCode** (S0-01) y confirmar que el esqueleto coincide con §5.
2. Confirmar que el push a GitHub funcionó (§9).
3. Decidir **A o B** (baseline) y **Supabase o Neon**.
4. Claude redacta el brief de **S0-03** (OpenCode copia los docs al repo y reemplaza `AGENTS.md`) y luego S0-04 a S0-06.
5. Preguntar al profesor la fecha de la presentación final y la retroalimentación del avance.

## 17. Cambios pendientes en PROJECT_CONTEXT.md
- Actualizar la sección "Pendientes" cuando se resuelvan: baseline A/B, Supabase vs Neon, fecha final, respuestas del profesor.

---

## Apéndice A — Prompt de OpenCode para el esqueleto (S0-01), resumen fiel
Contexto: se ejecuta dentro de la carpeta `COYS`. Pasos: (1) verificar Node ≥ 20; (2) crear estructura: `.github/workflows/`, `client/`, `server/src/{config,controllers,services,repositories,middlewares,models,errors,routes,db}`, `server/tests/`, `database/migrations/` + `README.md`, `docs/decisions.md`, `AGENTS.md`, `README.md`, `.gitignore`, con `.gitkeep` en carpetas vacías; **no** crear `e2e/`, `api-tests/`, `database/seed/`; (3) inicializar `server/`: `npm init -y`, `"type": "module"`, dependencias `express cors helmet dotenv pg zod jsonwebtoken swagger-ui-express yaml`, scripts `dev` (`node --watch src/server.js`) y `start`, `app.js` con helmet/cors/json y `GET /health` → 200 `{"status":"ok"}` y `export default app`, `server.js`, `config/env.js` (PORT, DATABASE_URL, DB_POOL_MAX por defecto 3, JWT_SECRET), `db/pool.js` (Pool de `pg` con `max = DB_POOL_MAX`, sin consultas), `.env.example`; (4) `npm create vite@latest client -- --template react`, luego `npm install` sin modificar el código; (5) `.gitignore`, `README.md` y `AGENTS.md` con reglas; (6) verificar `/health` y que el cliente arranca; (7) `git init`, rama `main`, un commit `chore: initial project skeleton`, **sin push ni remoto**. Reportar: árbol final, versiones de express/pg/vite, resultado de `/health`, dudas.

## Apéndice B — Resumen del baseline (`studio-portfolio-api.zip`)
Endpoints: `POST /api/v1/auth/login`, `GET/POST /api/v1/projects`, `GET/PUT/DELETE /api/v1/projects/{id}`. Tabla `projects`: `id` UUID, `title`, `slug` UNIQUE, `description`, `client_name`, `technologies` TEXT[], `project_url`, `repository_url`, `status` (DRAFT/PUBLISHED/ARCHIVED), `created_at`, `updated_at`. Formato de error: `{ "error": { "code", "message", "details" } }`. Credenciales de desarrollo: `admin/admin123`, `reader/reader123` (solo para pruebas locales). Incluye `docs/openapi.yaml`, `docs/diagrams.md` (Mermaid: arquitectura, ER, clases, secuencia) y `scripts/smoke-test.sh`.

---

## Entrada para SESSION_LOG.md
`2026-11-16 | Planeación-y-Arquitectura | Alcance y stack cerrados (JS+Express+PostgreSQL/pg+JWT+Zod, Bruno, Vercel), 10 docs de COYS redactados, prompt de OpenCode entregado, incidente de git push explicado, correcciones de fechas/lectura de docs/rol. Pendiente: reporte de OpenCode, A/B baseline, Supabase vs Neon, fecha final, S0-03.`
