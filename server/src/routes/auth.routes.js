// Login route. It is public by design, so there is no authenticate middleware here;
// the body is validated before the controller runs.
import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { loginSchema } from '../models/auth.schemas.js';

export function createAuthRoutes(controller) {
  const router = Router();

  router.post('/login', validate({ body: loginSchema }), controller.login);

  return router;
}
