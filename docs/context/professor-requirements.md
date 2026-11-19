# Requisitos del profesor — COYS (Studio Portfolio API)

**Última actualización:** 2026-11-16
**Destino sugerido:** memoria del proyecto de Claude **y** `docs/reference/professor-requirements.md` en el repo (reemplaza la versión anterior, que solo tenía los mensajes 1 y 2).
**Fuente:** 4 mensajes del profesor, en orden cronológico. Lo que no está en esos mensajes se marca como *por confirmar*; no es un hecho.

---

## 1. Resumen ejecutivo (lo que hay que cumplir hoy)

| # | Requisito | Origen |
|---|---|---|
| 1 | Proyecto = **REST API (CRUD)**, vale **35 %** de la calificación final | Msg 1, 3 |
| 2 | Mínimo **5 web services**: GET lista, GET por ID, POST, **PUT o PATCH**, DELETE | Msg 1; cambio en Msg 3 |
| 3 | Todo el código (clases, métodos, parámetros) en **inglés** | Msg 1–3 |
| 4 | Datos desde una **base de datos** | Msg 1–3 |
| 5 | **POO** correcta | Msg 1–3 |
| 6 | **Resource Oriented Design** | Msg 1–3 |
| 7 | Documentación **YAML** (OpenAPI) | Msg 1–3 |
| 8 | Documentación con **diagramas** | Msg 1–3 |
| 9 | Manejo de **códigos HTTP** (2XX, 4XX, 5XX) según la tabla de la sección 3 | Msg 1–3 |
| 10 | **Contexto profesional** (NUEVO): elegir al menos un rol y agregar tareas estándar de la industria | Msg 3, 4 |
| 11 | Presentación de **10 min**: 5 min libres + 5 min de preguntas sobre el código | Msg 3 (formato nuevo) |
| 12 | Presentar en **inglés** = **+10 puntos** | Msg 1–3 |

---

## 2. Cronología de los mensajes

### Mensaje 1 — "Relevant Info for our coming session" (sesión del 5 de octubre)
- **Agenda tentativa**
  1. Revisar el código de ejemplo de la REST API y ejecutarlo.
     - Debe estar corriendo **localmente**, no solo el "Hello World": **tiene que traer datos de la base de datos**.
     - Revisar el código línea por línea. Dudas sobre el código **Java** o la conexión a BD: llevarlas a clase; **la siguiente clase era la última oportunidad** de preguntar.
     - Las dudas se resuelven en equipo con ayuda de quienes ya configuraron su entorno.
  2. Discusión de proyectos: llevar la idea general (no detalles). Recordatorio de que vale 35 % y es una REST API (CRUD).
- Se listan los requisitos técnicos y la tabla de códigos HTTP (ver sección 3).
- Presentación de 10 min frente a la clase. En inglés: +10 puntos.
- **Ejemplo oficial del bonus:** 75 en la evaluación técnica + discurso en inglés = 85, equivalente a **30 de los 35** puntos disponibles de la calificación final.

### Mensaje 2 — "What you need to do during next 2 weeks"
- Empezar el proyecto final (REST API CRUD) con los mismos 5 web services y los mismos requisitos.
- Presentación final de 10 min, **fecha por definir**. En inglés: +10 puntos.
- **Avance a presentar en la clase del 26 de octubre.** (Ya pasó; no se conoce la retroalimentación. *Por confirmar.*)

### Mensaje 3 — "Information about your Final Project Presentation"
Cambios respecto a los mensajes anteriores:
- **PUT o PATCH:** el cuarto servicio ahora acepta cualquiera de los dos. (Antes decía solo PUT.)
- Los requisitos se numeran del **1 al 7** y se agrega el **8**:
  > **8) Add professional context to your project** based on your preferences. Think about what kind of professional role you would want to play when you get your computer science degree, then add relevant code, configuration or documentation.
  - Ejemplos de roles: UI/UX Engineer, DevOps Engineer, Data Science & Analytics, Cybersecurity & Infrastructure, Quality Assurance & Testing, Product Management.
- **Nuevo formato de la presentación (10 min):**
  - **Primeros 5 min:** presentación y explicación libre del proyecto.
  - **Últimos 5 min:** preguntas y respuestas; hay que estar listo para **responder sobre el código**.
- Inglés: +10 puntos.

### Mensaje 4 — Tarea del "contexto profesional" (clase posterior al Mensaje 3; fecha exacta *por confirmar*)
- **Instrucciones:**
  1. Pensar qué rol profesional se quiere ejercer al terminar la carrera.
  2. Elegir **al menos un rol** (puede ser uno fuera de la lista; la lista es solo referencia).
  3. Agregar al proyecto **tareas estándar de la industria** de ese rol (los ejemplos son orientativos; se vale cualquier tarea relacionada).
- **Se evalúa durante la presentación del proyecto.**

---

## 3. Códigos HTTP exigidos (sin cambios en los 4 mensajes)

| Endpoint | Códigos |
|---|---|
| GET (lista) | 200 / 400 / 401 / 500 |
| GET (por ID) | 200 / 400 / 401 / 404 / 500 |
| POST | 201 / 400 / 401 / 409 / 500 |
| PUT (o PATCH) | 200 / 400 / 401 / 404 / 500 |
| DELETE | 204 / 400 / 401 / 404 / 500 |

> El 401 aplica también a los GET: toda la API requiere autenticación.
> Nota: el profesor lista los códigos para PUT; el Msg 3 permite PATCH pero **no da una tabla distinta**. Se asume la misma. *Por confirmar.*

---

## 4. Ejemplos de tareas por rol (Mensaje 4, tal como los dio el profesor)

Los ejemplos del profesor están escritos para **Java + MySQL + GitLab + GlassFish**. Se anotan tal cual; la columna derecha es la traducción a nuestro stack (interpretación mía, no del profesor).

### UI/UX Engineer
- Integración frontend–backend: conectar la interfaz a los endpoints REST.
- UI de errores: mensajes amigables y spinners de carga para llamadas lentas.
- **En COYS:** cliente React que consume la API (Fase 3).

### DevOps Engineer
- Crear un repositorio Git y subir el proyecto.
- Pipeline CI/CD (`.gitlab-ci.yml`) que construya el proyecto en cada commit.
- Script de despliegue automático del `.war` a GlassFish.
- **En COYS:** repo en GitHub ✔ (push por confirmar), GitHub Actions (`ci.yml`), deploy alpha en Vercel.

### Data Science & Analytics
- Consultas MySQL avanzadas (agregaciones, joins, stored procedures, triggers) para métricas de negocio.
- Endpoint que extraiga datos, los procese y los devuelva como CSV o JSON.
- Stored procedures para reportes rápidos.
- **En COYS:** endpoint de métricas (p. ej. proyectos por estado/tecnología) con SQL en PostgreSQL.

### Cybersecurity & Infrastructure
- Autenticación y autorización: JWT o autenticación HTTP básica con filtros que protejan los endpoints.
- Prevención de inyección SQL: auditar que todas las consultas usen `PreparedStatement`/JPA.
- Manejo de secretos: sacar contraseñas del código y moverlas a variables de entorno enmascaradas (CI/CD) o a propiedades del servidor.
- **En COYS:** JWT con roles ✔ (ya diseñado), SQL parametrizado con `pg` ✔, `.env` + secretos de CI, helmet/cors.

### Quality Assurance & Testing
- Pruebas de la API con Postman o JUnit + RestAssured para verificar los códigos (200, 201, 400, 404).
- Integrar la suite al pipeline para que el build falle si una prueba falla.
- Pruebas de estado de BD: scripts que pueblen la BD con datos de prueba y casos límite (tablas vacías, payloads enormes).
- **En COYS:** colección Bruno + `bru run` en CI ✔ (planeado), datos semilla para casos límite.

### Product Management
- Crear y documentar historias de usuario o tareas ("As a user, I want to…").
- Documentación detallada de la API (endpoints, request bodies, respuestas JSON) **antes** de codificar.
- Seguimiento de hitos con JIRA, Asana o similar (fechas, alcance, velocidad).
- **En COYS:** `docs/tasks/sprint-*.md`, `api-design.md` y `openapi.yaml` ya cubren buena parte.

---

## 5. Qué implican estos cambios para COYS

| Tema | Impacto |
|---|---|
| **PUT o PATCH** | Con PUT ya se cumple. PATCH no es necesario; sigue siendo mejora opcional. |
| **Requisito 8 (rol profesional)** | **Es nuevo y se evalúa.** El plan actual ya incluye piezas de varios roles (JWT, Bruno, CI, tareas por sprint), pero hay que **declarar explícitamente el/los rol(es) elegidos** y documentarlos. |
| **Formato 5 + 5** | La presentación ya no es solo demo: 5 min libres + 5 min de preguntas **sobre el código**. Hay que poder explicar cada capa, cada consulta SQL y el JWT. Refuerza la regla "explicar cada PR con tus palabras antes del merge". Ajustar la estructura de la presentación (antes: 1+2+4+2+1). |
| **Ejemplos en Java/MySQL/GitLab/GlassFish** | Los ejemplos del profesor asumen Java. Nuestro stack es Node.js + PostgreSQL + GitHub. El profesor dijo que se vale "cualquier otra tarea relacionada", pero **la restricción de tecnología sigue sin confirmarse**. |
| **Mensaje 1 menciona "código Java"** | Indica que el código de ejemplo de clase es Java. Aumenta el riesgo de que se espere Java. Confirmar con el profesor **cuanto antes**. |

### Roles sugeridos para elegir (propuesta de PM; decide el desarrollador)
Prioridad por esfuerzo extra mínimo y alineación con lo ya decidido:
1. **Cybersecurity** (JWT, SQL parametrizado, secretos): casi todo ya está en el MVP.
2. **QA & Testing** (Bruno, casos límite, CI): ya planeado.
3. **DevOps** (repo, CI, deploy alpha): Sprint 2; solo si el MVP está terminado.

Regla de alcance: elegir **uno o dos**, no los seis. El rol profesional **no debe retrasar el Sprint 1** (MVP con los 5 endpoints y sus códigos). UI/UX (React) sigue siendo Fase 3 y solo si sobra tiempo.

---

## 6. Pendientes por confirmar con el profesor

- [ ] **Fecha de la presentación final** (sigue "por definir" en todos los mensajes).
- [ ] ¿Hay **restricción de tecnología**? (los ejemplos son Java/MySQL/GlassFish/GitLab).
- [ ] ¿Es aceptable **PostgreSQL** en lugar de MySQL, y **GitHub** en lugar de GitLab?
- [ ] ¿Qué tipo de **autenticación** espera para el 401? ¿Es aceptable el 403 extra para el rol `reader`?
- [ ] ¿Se acepta demo con Swagger/Bruno **sin interfaz**?
- [ ] Si se usa PATCH, ¿aplica la misma tabla de códigos que PUT?
- [ ] **Retroalimentación del avance del 26 de octubre.**
- [ ] Cómo se **evalúa** el requisito 8 (rúbrica, qué cuenta como "tarea estándar").
- [ ] Confirmar publicación del proyecto en el hilo (reserva del proyecto).

---

## 7. Checklist de cumplimiento (actualizar en cada sesión)

| Requisito | Estado |
|---|---|
| 5 web services (GET lista, GET id, POST, PUT/PATCH, DELETE) | ⬜ |
| Todos los códigos HTTP por endpoint | ⬜ |
| Código en inglés | ⬜ |
| Datos desde BD (PostgreSQL) | ⬜ |
| POO correcta (capas y clases) | ⬜ |
| Resource Oriented Design | ⬜ |
| `openapi.yaml` | ⬜ |
| Diagramas (ER, arquitectura, clases, secuencia) | ⬜ |
| Contexto profesional: rol(es) elegido(s) y documentado(s) | ⬜ |
| Presentación preparada (5 min libres + 5 min Q&A) | ⬜ |
| Presentación en inglés (+10) | ⬜ |

---

## Entrada para SESSION_LOG.md
`2026-11-16 | Requisitos | Consolidados los 4 mensajes del profesor: PUT o PATCH, nuevo requisito 8 (contexto profesional por rol), formato 5+5 min con Q&A sobre el código. Pendiente: elegir rol(es), confirmar restricción de tecnología (ejemplos en Java) y fecha final.`
