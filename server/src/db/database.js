// Opens the single SQLite connection shared by the whole API.
// The parent folder is created on first use; db:reset rebuilds the file from migrations.

import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DATABASE_PATH } from '../config/env.js';

// DATABASE_PATH is relative to the server/ folder, which is where npm scripts run.
const databasePath = resolve(DATABASE_PATH);

mkdirSync(dirname(databasePath), { recursive: true });

const db = new Database(databasePath);
db.pragma('foreign_keys = ON');

export default db;
