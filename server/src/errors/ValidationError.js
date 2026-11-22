// 400 for request input rejected by Zod. `details` is an array of { path, message }.
import { AppError } from './AppError.js';

export class ValidationError extends AppError {
  constructor(details) {
    super(400, 'VALIDATION_ERROR', 'Request validation failed', details);
  }
}
