// Zod schema for POST /api/v1/auth/login. Strict: unknown fields are rejected with 400.
import { z } from 'zod';

export const loginSchema = z
  .object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
  })
  .strict();
