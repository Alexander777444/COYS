// 404 when a resource does not exist. The service layer decides when to throw it.
import { AppError } from './AppError.js';

export class NotFoundError extends AppError {
  constructor(resource, id) {
    super(404, 'NOT_FOUND', `${resource} '${id}' was not found`);
  }
}
