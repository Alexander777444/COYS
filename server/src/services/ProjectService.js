// Business rules for projects: build the list envelope, generate ids, and turn
// "no row" into the 404 required by the API contract.
import { randomUUID } from 'node:crypto';
import { NotFoundError } from '../errors/NotFoundError.js';

export class ProjectService {
  #repository;

  constructor(repository) {
    this.#repository = repository;
  }

  // Get the rows and total count for one page.
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

  // Make a new id before the repository saves the project.
  async create(data) {
    // Ids are generated here, not in the repository or by the client.
    return this.#repository.create({ id: randomUUID(), ...data });
  }

  // Replace the project fields, or report that the id was not found.
  async replace(id, data) {
    const project = await this.#repository.replace(id, data);

    if (!project) throw new NotFoundError('Project', id);

    return project;
  }

  // Delete the project, or report that the id was not found.
  async remove(id) {
    const deleted = await this.#repository.deleteById(id);

    if (!deleted) throw new NotFoundError('Project', id);
  }
}
