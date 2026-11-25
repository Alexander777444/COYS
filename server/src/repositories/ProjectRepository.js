// All SQL for the `projects` table lives here. Rows are mapped to camelCase domain
// objects, so services and controllers never see SQLite column names or JSON strings.
import { ConflictError } from '../errors/ConflictError.js';

const SELECT_ALL = 'SELECT * FROM projects';
const LIST_ORDER = ' ORDER BY created_at DESC, id ASC';

export class ProjectRepository {
  #db;

  constructor(db) {
    this.#db = db;
  }

  // Returns the page of rows plus the total matching rows, so the service can build `meta`.
  async findAll({ status, limit, offset }) {
    // The filter is a fixed SQL fragment chosen here; the value is always bound with `?`.
    const where = status ? ' WHERE status = ?' : '';
    const filterParams = status ? [status] : [];

    const { total } = this.#db
      .prepare(`SELECT COUNT(*) AS total FROM projects${where}`)
      .get(...filterParams);

    const rows = this.#db
      .prepare(`${SELECT_ALL}${where}${LIST_ORDER} LIMIT ? OFFSET ?`)
      .all(...filterParams, limit, offset);

    return { rows: rows.map(toProject), total };
  }

  // Find one row by id; null means that it is not in the table.
  async findById(id) {
    const row = this.#db.prepare(`${SELECT_ALL} WHERE id = ?`).get(id);
    return row ? toProject(row) : null;
  }

  async create(project) {
    try {
      this.#db
        .prepare(
          `INSERT INTO projects
             (id, title, slug, description, client_name, technologies, project_url, repository_url, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          project.id,
          project.title,
          project.slug,
          project.description,
          project.clientName,
          JSON.stringify(project.technologies),
          project.projectUrl,
          project.repositoryUrl,
          project.status,
        );
    } catch (error) {
      throw translateConstraint(error, project.slug);
    }

    // Read the row back so the response contains the DB-generated timestamps.
    return this.findById(project.id);
  }

  // Full replacement: every column is overwritten and updated_at is refreshed by SQLite.
  // changes === 0 means the id does not exist (the service turns that into 404).
  async replace(id, data) {
    try {
      const { changes } = this.#db
        .prepare(
          `UPDATE projects SET
             title = ?, slug = ?, description = ?, client_name = ?, technologies = ?,
             project_url = ?, repository_url = ?, status = ?,
             updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
           WHERE id = ?`,
        )
        .run(
          data.title,
          data.slug,
          data.description,
          data.clientName,
          JSON.stringify(data.technologies),
          data.projectUrl,
          data.repositoryUrl,
          data.status,
          id,
        );

      if (changes === 0) return null;
    } catch (error) {
      throw translateConstraint(error, data.slug);
    }

    return this.findById(id);
  }

  // Delete by id and tell the service if a row was removed.
  async deleteById(id) {
    const { changes } = this.#db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    return changes > 0;
  }
}

// The UNIQUE constraint on `slug` is the source of the 409; every other DB error
// (missing table, broken connection…) must keep bubbling up and become a 500.
function translateConstraint(error, slug) {
  if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return new ConflictError(`Project slug '${slug}' is already in use`);
  }

  return error;
}

// DB row (snake_case) -> domain object (camelCase). `technologies` is stored as JSON text.
function toProject(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    clientName: row.client_name,
    technologies: JSON.parse(row.technologies),
    projectUrl: row.project_url,
    repositoryUrl: row.repository_url,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
