// All SQL for the `projects` table lives here. Rows are mapped to camelCase domain
// objects, so services and controllers never see SQLite column names or JSON strings.
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

  async findById(id) {
    const row = this.#db.prepare(`${SELECT_ALL} WHERE id = ?`).get(id);
    return row ? toProject(row) : null;
  }
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
