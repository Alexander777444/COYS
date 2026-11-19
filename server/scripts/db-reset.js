// Rebuilds the SQLite database from scratch: every migration in name order, then dev seeds.
// Idempotent by design: running it twice in a row always leaves the same known state.

import Database from 'better-sqlite3';
import { mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DATABASE_PATH } from '../src/config/env.js';

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptsDir, '../..');
const migrationsDir = join(projectRoot, 'database', 'migrations');
const devSeedFile = join(projectRoot, 'database', 'seed', 'dev-data.sql');

const databasePath = resolve(DATABASE_PATH);
const empty = process.argv.includes('--empty');

// Remove the database and any journal files left by an interrupted run.
for (const suffix of ['', '-wal', '-shm']) {
  rmSync(`${databasePath}${suffix}`, { force: true });
}
mkdirSync(dirname(databasePath), { recursive: true });

const db = new Database(databasePath);

try {
  const migrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of migrationFiles) {
    db.exec(readFileSync(join(migrationsDir, file), 'utf8'));
    console.log(`Applied migration: ${file}`);
  }

  if (empty) {
    console.log('Skipped dev data (--empty).');
  } else {
    db.exec(readFileSync(devSeedFile, 'utf8'));
    const { count } = db.prepare('SELECT COUNT(*) AS count FROM projects').get();
    console.log(`Loaded dev data: ${count} rows.`);
  }
} finally {
  db.close();
}

console.log(`Database ready at ${databasePath}`);
