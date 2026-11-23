// Composition root: the only place where dependencies are wired together.
// db/settings → repositories → services → controllers → routers, mounted under /api/v1.
import { Router } from 'express';
import { createAuthRoutes } from './auth.routes.js';
import { createProjectRoutes } from './projects.routes.js';
import { AuthService } from '../services/AuthService.js';
import { AuthController } from '../controllers/AuthController.js';
import { ProjectRepository } from '../repositories/ProjectRepository.js';
import { ProjectService } from '../services/ProjectService.js';
import { ProjectController } from '../controllers/ProjectController.js';
import { createAuthenticate } from '../middlewares/authenticate.js';

export function createApiRouter({ db, config }) {
  const router = Router();

  const authenticate = createAuthenticate(config);
  const authController = new AuthController(new AuthService(config));
  const projectController = new ProjectController(new ProjectService(new ProjectRepository(db)));

  router.use('/auth', createAuthRoutes(authController));
  router.use('/projects', createProjectRoutes(projectController, authenticate));

  return router;
}
