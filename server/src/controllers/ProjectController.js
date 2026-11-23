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
}
