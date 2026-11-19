// Process entry point: starts HTTP and closes the SQLite connection on exit signals.
import app from './app.js';
import db from './db/database.js';
import { PORT } from './config/env.js';

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

function shutdown(signal) {
  console.log(`${signal} received: closing server and database.`);
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
