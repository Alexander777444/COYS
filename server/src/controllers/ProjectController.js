// HTTP layer for project reads: validated input in, JSON out. One service call per handler.
export class ProjectController {
  #service;

  constructor(service) {
    this.#service = service;
  }

  list = async (req, res) => {
    const result = await this.#service.list(req.validated.query);
    res.status(200).json(result);
  };

  getById = async (req, res) => {
    const project = await this.#service.getById(req.validated.params.id);
    res.status(200).json(project);
  };

  create = async (req, res) => {
    const project = await this.#service.create(req.validated.body);
    // req.baseUrl is "/api/v1/projects" here, so Location points at the new resource.
    res.status(201).location(`${req.baseUrl}/${project.id}`).json(project);
  };

  replace = async (req, res) => {
    const project = await this.#service.replace(req.validated.params.id, req.validated.body);
    res.status(200).json(project);
  };

  remove = async (req, res) => {
    await this.#service.remove(req.validated.params.id);
    // 204 means "done, and there is nothing to send back".
    res.status(204).end();
  };
}
