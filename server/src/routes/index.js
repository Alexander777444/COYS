// Composition root: the only place where dependencies are wired together.
// settings → service → controller → router, all mounted under /api/v1 by app.js.
import { Router } from 'express';
import { createAuthRoutes } from './auth.routes.js';
import { AuthService } from '../services/AuthService.js';
import { AuthController } from '../controllers/AuthController.js';

export function createApiRouter(config) {
  const router = Router();

  const authController = new AuthController(new AuthService(config));

  router.use('/auth', createAuthRoutes(authController));

  return router;
}
