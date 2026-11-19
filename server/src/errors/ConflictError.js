// 409 for uniqueness conflicts, e.g. a duplicated project slug.
import { AppError } from './AppError.js';

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(409, 'CONFLICT', message);
  }
}
