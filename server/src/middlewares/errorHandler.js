// Last middleware: converts every thrown error into the one documented error envelope.
// It never leaks stack traces, SQL or file paths to the client.

import { AppError } from '../errors/AppError.js';

// Send errors as JSON, with a safe message for unexpected errors.
export function errorHandler(err, _req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    // For a 401 error, ask the client to send a Bearer token.
    if (err.statusCode === 401) {
      res.set('WWW-Authenticate', 'Bearer');
    }

    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details ?? null,
      },
    });
  }

  // express.json() reports body-parser failures with a `type`, not an AppError.
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Request body is not valid JSON',
        details: null,
      },
    });
  }

  if (err?.type === 'entity.too.large') {
    return res.status(400).json({
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Request body exceeds the 100 kb limit',
        details: null,
      },
    });
  }

  // Unexpected failure: log the real cause on the server, answer with a generic message.
  console.error(err);
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Unexpected server error',
      details: null,
    },
  });
}
