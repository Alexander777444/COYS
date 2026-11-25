// Process entry point: starts HTTP and closes the SQLite connection on exit signals.
import app from './app.js';
import db from './db/database.js';
import { PORT } from './config/env.js';

// Start the app on the configured port.
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} try with http://localhost:${PORT}/health and http://localhost:${PORT}/api-docs`);
});

// Close both the web server and database before the process ends.
function shutdown(signal) {
  console.log(`${signal} received: closing server and database.`);
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
