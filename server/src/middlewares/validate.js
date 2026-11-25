// Generic Zod validation middleware. It validates whichever parts of the request a route
// asks for (params, query, body) and stores the parsed result in req.validated, so
// controllers never read raw input. Any Zod issue becomes a 400 ValidationError.
import { ValidationError } from '../errors/ValidationError.js';

const PARTS = ['params', 'query', 'body'];

// Zod reports issues with a path array; the API contract exposes { path, message } strings.
// Turn each Zod issue into the small format used by the API.
function toDetails(error) {
  return error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
}

// Make middleware that checks the request parts named by the route.
export function validate(schemas) {
  return (req, _res, next) => {
    const validated = {};

    for (const part of PARTS) {
      const schema = schemas[part];

      // A route only validates the parts it passes in (e.g. body only, or params only).
      if (!schema) continue;

      const result = schema.safeParse(req[part]);

      if (!result.success) {
        return next(new ValidationError(toDetails(result.error)));
      }

      validated[part] = result.data;
    }

    req.validated = validated;
    return next();
  };
}
