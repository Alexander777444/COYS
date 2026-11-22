// HTTP layer for login: reads the validated body, calls AuthService once and sends 200.
// Arrow-function methods keep `this` when Express calls them without a receiver.
export class AuthController {
  #service;

  constructor(service) {
    this.#service = service;
  }

  login = async (req, res) => {
    const { username, password } = req.validated.body;
    const result = await this.#service.login(username, password);
    res.status(200).json(result);
  };
}
