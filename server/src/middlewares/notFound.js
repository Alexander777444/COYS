// Last route middleware: turns any unmatched request into the standard 404 envelope.
import { AppError } from '../errors/AppError.js';

export function notFound(req, _res, next) {
  next(
    new AppError(404, 'ROUTE_NOT_FOUND', `Route '${req.method} ${req.originalUrl}' was not found`),
  );
}
