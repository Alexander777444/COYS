// Adds the edge-case rows on top of the current database (accents, max lengths, empty arrays).
// Run `npm run db:reset` first; this script never drops or recreates the database.

import Database from 'better-sqlite3';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DATABASE_PATH } from '../src/config/env.js';

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const edgeSeedFile = join(resolve(scriptsDir, '../..'), 'database', 'seed', 'edge-cases.sql');
const databasePath = resolve(DATABASE_PATH);

if (!existsSync(databasePath)) {
  throw new Error('Database file not found. Run npm run db:reset first.');
}

const db = new Database(databasePath);

try {
  db.exec(readFileSync(edgeSeedFile, 'utf8'));
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM projects').get();
  console.log(`Loaded edge-case data. Total rows: ${count}.`);
} finally {
  db.close();
}
