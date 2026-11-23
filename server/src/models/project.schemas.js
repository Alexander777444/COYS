// Zod schemas for the project read endpoints: the {id} path param and the list query.
// Rules come only from docs/context/api-contract.md.
import { z } from 'zod';

export const PROJECT_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

export const projectIdParamsSchema = z.object({
  id: z.uuid('id must be a valid UUID'),
});

// Unknown query params are ignored on purpose (contract), so this schema is not strict.
export const listProjectsQuerySchema = z.object({
  status: z.enum(PROJECT_STATUSES).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});
