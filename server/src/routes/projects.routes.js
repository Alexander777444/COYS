// Project routes. The order is always authenticate → validate → controller, so an
// unauthenticated request gets 401 even when the id or the query is also invalid.
import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import {
  listProjectsQuerySchema,
  projectIdParamsSchema,
} from '../models/project.schemas.js';

export function createProjectRoutes(controller, authenticate) {
  const router = Router();

  router.get('/', authenticate, validate({ query: listProjectsQuerySchema }), controller.list);
  router.get('/:id', authenticate, validate({ params: projectIdParamsSchema }), controller.getById);

  return router;
}
