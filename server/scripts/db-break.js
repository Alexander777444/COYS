// Drops the projects table on purpose so DB-backed requests fail and produce a 500.
// This is a QA helper only; repair the database with `npm run db:reset`.

import Database from 'better-sqlite3';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { DATABASE_PATH } from '../src/config/env.js';

const databasePath = resolve(DATABASE_PATH);

if (!existsSync(databasePath)) {
  throw new Error('Database file not found. Run npm run db:reset first.');
}

const db = new Database(databasePath);

try {
  db.exec('DROP TABLE IF EXISTS projects;');
  console.log('Dropped the projects table. Run npm run db:reset to repair the database.');
} finally {
  db.close();
}
