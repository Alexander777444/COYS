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

const httpUrl = z.url({ protocol: /^https?$/ }).max(2048);

// POST and PUT share this shape: PUT is a full replacement, so the same required fields
// apply and omitted optional fields fall back to their defaults. Strict → unknown
// fields (id, createdAt, …) are a 400 instead of being silently ignored.
export const projectBodySchema = z
  .object({
    title: z.string().trim().min(1).max(150),
    slug: z
      .string()
      .min(1)
      .max(100)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase words separated by single hyphens'),
    description: z.string().trim().min(1).max(5000),
    clientName: z.string().trim().min(1).max(150).nullable().default(null),
    technologies: z.array(z.string().trim().min(1).max(50)).max(30).default([]),
    projectUrl: httpUrl.nullable().default(null),
    repositoryUrl: httpUrl.nullable().default(null),
    status: z.enum(PROJECT_STATUSES).default('DRAFT'),
  })
  .strict();
