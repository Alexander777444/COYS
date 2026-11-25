// Project routes. The order is always authenticate → validate → controller, so an
// unauthenticated request gets 401 even when the id or the body is also invalid.
import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import {
  listProjectsQuerySchema,
  projectBodySchema,
  projectIdParamsSchema,
} from '../models/project.schemas.js';

// This function sets the URL, checks, and handler for each project action.
export function createProjectRoutes(controller, authenticate) {
  const router = Router();

  router.get('/', authenticate, validate({ query: listProjectsQuerySchema }), controller.list);
  router.get('/:id', authenticate, validate({ params: projectIdParamsSchema }), controller.getById);

  router.post('/', authenticate, validate({ body: projectBodySchema }), controller.create);
  router.put(
    '/:id',
    authenticate,
    // params before body: a malformed id is reported as 400 before the body is checked.
    validate({ params: projectIdParamsSchema, body: projectBodySchema }),
    controller.replace,
  );
  router.delete('/:id', authenticate, validate({ params: projectIdParamsSchema }), controller.remove);

  return router;
}
