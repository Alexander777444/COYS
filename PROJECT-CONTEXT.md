# Studio Portfolio API — Contexto del proyecto final
 
## 1. Resumen
 
**Nombre:** Studio Portfolio API
**Tipo:** Proyecto final individual de la materia de *Programación de Servicios Web*
**Qué es:** Una API REST que administra el contenido del sitio web de mi startup / despacho personal de desarrollo de software: proyectos del portafolio, servicios ofrecidos y solicitudes de clientes.
**Idea central:** Es el *backend* (headless CMS) que alimentará mi sitio web. El sitio en React será el primer cliente de la API.
 
```
[Sitio web React + Vite]  →  consume  →  [API REST Node.js]  →  [PostgreSQL]
   (fase posterior)                       (proyecto de clase)
```
 
**Prioridad absoluta:** la API. El frontend solo se hace si sobra tiempo, nunca a costa de la API.
 
---
 
## 2. Requisitos del profesor (obligatorios)
 
### Funcionales
Mínimo **5 web services**: `GET` lista, `GET` por ID, `POST`, `PUT`, `DELETE`.
 
### Técnicos
- Todo el código (clases, métodos, parámetros) en **inglés**
- Datos desde una **base de datos**
- **POO** correcta
- **Resource Oriented Design**
- Documentación **YAML** (OpenAPI)
- Documentación con **diagramas**
- Manejo de **códigos HTTP**
### Códigos HTTP requeridos
 
| Endpoint | Códigos |
|---|---|
| GET (lista) | 200 / 400 / 401 / 500 |
| GET (por ID) | 200 / 400 / 401 / 404 / 500 |
| POST | 201 / 400 / 401 / 409 / 500 |
| PUT | 200 / 400 / 401 / 404 / 500 |
| DELETE | 204 / 400 / 401 / 404 / 500 |
 
> El 401 aplica **también a los GET**: toda la API requiere autenticación.
 
### Fechas
- **26 de octubre:** presentación del **avance** en clase
- **Por definir:** presentación final de 10 minutos
- **Bonus:** presentar en **inglés** da **+10 puntos**
### Regla del hilo
Los proyectos no pueden duplicarse; el primero que publica en el hilo se queda con el proyecto. **Publicar mi respuesta en el hilo cuanto antes.**
 
Borrador:
> **Software Engineer:** [Mi nombre]
> **Project Name:** Studio Portfolio API
> **Goal:** REST API to manage the content of a software development studio's website: portfolio projects, services offered and client inquiries.
 
---
 
## 3. Alcance
 
### Dentro del alcance (MVP para la tarea)
- Recurso principal con CRUD completo: **`/projects`**
- Autenticación para generar los 401
- Validación (400), conflictos (409), no encontrado (404), errores de servidor (500)
- Documentación OpenAPI (YAML) y diagramas
- Base de datos PostgreSQL
### Si hay tiempo (fase 2)
- Recurso `/inquiries` (solicitudes de cotización de clientes)
- Recurso `/services`
- Recurso `/testimonials`
- Paginación y filtros en los GET de lista
- Pruebas automáticas (Jest + Supertest)
### Fuera del alcance por ahora
- Frontend completo en React
- Deploy en producción
- Panel de administración
---
 
## 4. Recursos y modelo de datos (borrador)
 
### `/projects` (recurso principal)
 
| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID / integer | PK |
| `title` | string | requerido |
| `slug` | string | único → genera el **409** al duplicarse |
| `description` | text | requerido |
| `clientName` | string | opcional |
| `technologies` | string[] | tecnologías usadas |
| `projectUrl` | string | opcional, URL válida |
| `repositoryUrl` | string | opcional |
| `status` | enum | `DRAFT`, `PUBLISHED`, `ARCHIVED` |
| `createdAt` / `updatedAt` | datetime | automáticos |
 
### Recursos futuros
- **`/inquiries`:** `id`, `name`, `email`, `message`, `serviceId`, `status`, `createdAt`
- **`/services`:** `id`, `name`, `description`, `priceRange`
### Endpoints del MVP
 
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/projects` | Lista de proyectos |
| GET | `/api/v1/projects/{id}` | Detalle de un proyecto |
| POST | `/api/v1/projects` | Crear proyecto |
| PUT | `/api/v1/projects/{id}` | Reemplazar proyecto |
| DELETE | `/api/v1/projects/{id}` | Eliminar proyecto |
 
### Origen de cada código HTTP
- **400:** datos inválidos (validación con Zod) o ID con formato incorrecto
- **401:** falta el token / API key o es inválido
- **404:** el proyecto no existe
- **409:** ya existe un proyecto con el mismo `slug`
- **500:** error inesperado del servidor (middleware global)
---
 
## 5. Stack tecnológico
 
| Capa | Tecnología | Motivo |
|---|---|---|
| Runtime | **Node.js** | Un solo lenguaje en todo el stack |
| Framework | **Express** | Ligero y estándar |
| Lenguaje | **TypeScript** | Clases, interfaces y tipado → POO clara |
| Base de datos | **PostgreSQL** | Datos relacionales e integridad |
| ORM | **Prisma** | Esquema, migraciones y tipos automáticos |
| Validación | **Zod** | Genera los 400 |
| Autenticación | **JWT** o **API key** | Genera los 401 |
| Documentación | **OpenAPI (YAML)** + **swagger-ui-express** | Requisito del profe |
| Diagramas | **Mermaid** / draw.io | ER, clases, arquitectura, secuencia |
| Seguridad | `helmet`, `cors`, `dotenv` | Buenas prácticas |
| Pruebas manuales | **Bruno** o **Postman** | Demo en la presentación |
| Frontend (después) | **React + Vite + CSS** | Cliente de la API |
| Hosting BD (opcional) | **Neon** o **Supabase** | PostgreSQL gratuito |
| Deploy (opcional) | **Render** o **Railway** (API), **Vercel** o **Cloudflare Pages** (frontend) | Cloudflare Workers no es Node completo |
 
### Estructura de carpetas (POO en capas)
 
```
src/
  controllers/    → ProjectController
  services/       → ProjectService (reglas de negocio)
  repositories/   → ProjectRepository (acceso a datos)
  middlewares/    → AuthMiddleware, ErrorHandler
  models/         → tipos, DTOs y esquemas de validación
  errors/         → AppError, NotFoundError, ConflictError...
  routes/
  app.ts
  server.ts
prisma/
  schema.prisma
docs/
  openapi.yaml
  diagrams/
```
 
Flujo: `Route → Controller → Service → Repository → DB`
 
---
 
## 6. Autenticación (propuesta)
 
- Rol **lectura** (para el sitio público): puede hacer `GET`
- Rol **admin** (yo): puede hacer `GET`, `POST`, `PUT`, `DELETE`
- Sin credenciales o inválidas → **401** en todos los endpoints
- *Pendiente de confirmar con el profesor* qué tipo de autenticación espera.
---
 
## 7. Entregables
 
1. API funcionando con los 5 endpoints y todos los códigos HTTP
2. Código en inglés, con POO y arquitectura en capas
3. `openapi.yaml` completo
4. Diagramas: entidad-relación, arquitectura, clases y/o secuencia
5. Colección de pruebas (Bruno/Postman)
6. README con instrucciones de instalación y uso
7. Presentación de 10 minutos, **en inglés** (bonus +10)
---
 
## 8. Defensa del proyecto (resumen)
 
- **¿Por qué CRUD?** El contenido de un despacho cambia constantemente (nuevos proyectos, servicios, solicitudes) y debo administrarlo sin editar código.
- **¿Por qué REST?** Separa contenido y presentación; la misma API puede alimentar el sitio, una app móvil o un panel de administración. Es estándar, stateless y escalable.
- **¿Por qué este stack?** Un solo lenguaje de punta a punta, PostgreSQL por la naturaleza relacional de los datos, y es el stack que usaré con mis futuros clientes.
- **Argumento fuerte:** no es un ejercicio de práctica, es el backend real de mi startup.
### Estructura de la presentación (10 min)
1. Problema (1 min)
2. Solución y arquitectura (2 min)
3. Demo en vivo con Swagger/Postman, incluyendo errores (4 min)
4. Decisiones técnicas (2 min)
5. Siguientes pasos (1 min)
---
 
## 9. Plan hacia el avance del 26 de octubre
 
| Prioridad | Tarea |
|---|---|
| 1 | Publicar el proyecto en el hilo del profesor |
| 2 | Definir modelo de datos y crear `schema.prisma` |
| 3 | Inicializar proyecto Node + TypeScript + Express y repo en GitHub |
| 4 | Conectar PostgreSQL y correr la primera migración |
| 5 | Redactar `openapi.yaml` de `/projects` |
| 6 | Implementar `GET` lista y `GET` por ID |
| 7 | Implementar `POST`, `PUT`, `DELETE` |
| 8 | Middleware de autenticación y manejo global de errores |
| 9 | Diagrama ER y de arquitectura |
 
**Mínimo para llevar al avance:** modelo de datos, `openapi.yaml` y 2–3 endpoints funcionando.
 
---
 
## 10. Instrucciones para Claude en este proyecto
 
- Actúa como **PM y mentor técnico**: valida alcance, prioriza y detecta riesgos de tiempo.
- Prioriza siempre cumplir los **requisitos del profesor** antes que agregar funciones nuevas.
- Evita el sobrealcance: si propongo algo extra, recuérdame qué está en el MVP.
- Todo el **código, nombres y comentarios en inglés**; las explicaciones conmigo en **español**.
- Explica el *porqué* de las decisiones, porque tengo que defenderlas ante el profesor.
- Ayúdame a practicar la presentación en inglés.
- Cuando generes código, respeta la arquitectura en capas y la POO.
---
 
## 11. Pendientes por confirmar
 
- [ ] Publicar el proyecto en el hilo
- [ ] Confirmar con el profesor: ¿hay restricción de tecnología?
- [ ] Confirmar: ¿acepta demo con Swagger/Postman sin frontend?
- [ ] Confirmar: ¿qué tipo de autenticación espera para el 401?
- [ ] Definir fecha de la presentación final
 