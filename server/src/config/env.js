// Reads and validates every environment variable once, at startup.
// The rest of the code imports these values, so process.env is never read elsewhere.

import 'dotenv/config';

// Check that all required variables are present. DATEBASE_PATH is used by the database layer, 
// JWT_SECRET by the AuthService, and API_USERNAME/API_PASSWORD by the login route.
const REQUIRED_VARIABLES = ['DATABASE_PATH', 'JWT_SECRET', 'API_USERNAME', 'API_PASSWORD']; 

// Stop startup when a required setting is missing or blank.
function readRequired(name) {
  const value = process.env[name];

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        'Copy server/.env.example to server/.env and fill in the value.',
    );
  }

  return value.trim();
}

// Use port 3000 when PORT is not set, and check its range.
const PORT = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

const DATABASE_PATH = readRequired('DATABASE_PATH');

// A long key is needed to sign secure login tokens.
const JWT_SECRET = readRequired('JWT_SECRET');
if (JWT_SECRET.length < 32) {
  throw new Error(
    `JWT_SECRET must be at least 32 characters long (received ${JWT_SECRET.length}).`,
  );
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN?.trim() || '1h';
const API_USERNAME = readRequired('API_USERNAME');
const API_PASSWORD = readRequired('API_PASSWORD');

// One frozen object for the layers that receive settings through their constructor
// (services and middlewares never import env.js directly).
const config = Object.freeze({
  port: PORT,
  databasePath: DATABASE_PATH,
  jwtSecret: JWT_SECRET,
  jwtExpiresIn: JWT_EXPIRES_IN,
  apiUsername: API_USERNAME,
  apiPassword: API_PASSWORD,
});

export { PORT, DATABASE_PATH, JWT_SECRET, JWT_EXPIRES_IN, API_USERNAME, API_PASSWORD, config };
