// Authentication business rules: check the single API user from configuration and sign a JWT.
// No Express and no HTTP here, so the rule can be reused or replaced without touching routes.
import { createHash, timingSafeEqual } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

export class AuthService {
  #config;

  constructor(config) {
    this.#config = config;
  }

  // Check the login details, then return a signed token.
  async login(username, password) {
    // Both values are checked before failing, so the response time does not reveal
    // which one was wrong; the error message is identical in both cases.
    const usernameMatches = safeEqual(username, this.#config.apiUsername);
    const passwordMatches = safeEqual(password, this.#config.apiPassword);

    if (!usernameMatches || !passwordMatches) {
      throw new UnauthorizedError('INVALID_CREDENTIALS', 'Invalid username or password');
    }

    // The token names the user and has a set time limit.
    const token = jwt.sign({ sub: username }, this.#config.jwtSecret, {
      algorithm: 'HS256',
      expiresIn: this.#config.jwtExpiresIn,
    });

    return { token, tokenType: 'Bearer', expiresIn: this.#config.jwtExpiresIn };
  }
}

// Hashing both sides first gives two buffers of the same length, so timingSafeEqual
// never throws on different lengths and the comparison leaks no timing information.
function safeEqual(received, expected) {
  const receivedDigest = createHash('sha256').update(String(received)).digest();
  const expectedDigest = createHash('sha256').update(String(expected)).digest();
  return timingSafeEqual(receivedDigest, expectedDigest);
}
