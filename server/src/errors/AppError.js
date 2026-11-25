// Base class for every expected (operational) HTTP error.
// The global handler can trust statusCode/code/details instead of guessing what went wrong.

export class AppError extends Error {
  // Save the HTTP status and error details for the global handler.
  constructor(statusCode, code, message, details = null) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace?.(this, new.target);
  }
}
