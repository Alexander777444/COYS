// Express application and middleware order. Errors are handled last, always.
// Feature routes come from the composition root (routes/index.js), mounted under /api/v1.

import { readFileSync } from 'node:fs';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env.js';
import db from './db/database.js';
import { createApiRouter } from './routes/index.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Swagger UI must be mounted BEFORE helmet: helmet's Content-Security-Policy blocks
// the inline scripts and styles that the UI needs to render. The YAML is parsed once
// at startup, so a malformed spec stops the server instead of serving a broken page.
const openApiDocument = YAML.parse(
  readFileSync(new URL('../../docs/openapi.yaml', import.meta.url), 'utf8'),
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '100kb' }));

// This public URL shows that the server is running.
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Add all API routes under the versioned URL.
app.use('/api/v1', createApiRouter({ db, config }));

app.use(notFound);
app.use(errorHandler);

export default app;
