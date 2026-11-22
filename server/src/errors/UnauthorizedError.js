// 401 for any authentication failure: missing, invalid or expired token, or bad credentials.
import { AppError } from './AppError.js';

export class UnauthorizedError extends AppError {
  constructor(code = 'UNAUTHORIZED', message = 'Authentication is required') {
    super(401, code, message);
  }
}
