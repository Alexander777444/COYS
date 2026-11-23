// Business rules for reading projects: build the list envelope and turn
// "row not found" into the 404 required by the API contract.
import { NotFoundError } from '../errors/NotFoundError.js';

export class ProjectService {
  #repository;

  constructor(repository) {
    this.#repository = repository;
  }

  async list({ status, limit, offset }) {
    const { rows, total } = await this.#repository.findAll({ status, limit, offset });
    return { data: rows, meta: { total, limit, offset } };
  }

  async getById(id) {
    const project = await this.#repository.findById(id);

    // The repository says "no row"; the service decides that this means 404.
    if (!project) throw new NotFoundError('Project', id);

    return project;
  }
}
