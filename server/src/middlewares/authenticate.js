// JWT guard for every protected route. It produces the three documented 401 codes
// (MISSING_TOKEN, INVALID_TOKEN, TOKEN_EXPIRED); errorHandler adds WWW-Authenticate.
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

// "Bearer" is case-insensitive per the HTTP spec; the token itself must not contain spaces.
const BEARER_PATTERN = /^Bearer\s+(\S+)$/i;

// Check the token before a route that needs a login.
export function createAuthenticate(config) {
  return (req, _res, next) => {
    const header = req.get('authorization');
    const match = header ? BEARER_PATTERN.exec(header.trim()) : null;

    if (!match) {
      return next(
        new UnauthorizedError('MISSING_TOKEN', 'A Bearer token is required in the Authorization header'),
      );
    }

    try {
      // algorithms is pinned so a token can never be accepted with a different algorithm.
      const payload = jwt.verify(match[1], config.jwtSecret, { algorithms: ['HS256'] });
      req.user = { username: payload.sub };
      return next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(new UnauthorizedError('TOKEN_EXPIRED', 'The access token has expired'));
      }

      return next(new UnauthorizedError('INVALID_TOKEN', 'The access token is not valid'));
    }
  };
}
