// Express application and middleware order. Errors are handled last, always.
// Feature routes come from the composition root (routes/index.js), mounted under /api/v1.

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import db from './db/database.js';
import { createApiRouter } from './routes/index.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '100kb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/v1', createApiRouter({ db, config }));

app.use(notFound);
app.use(errorHandler);

export default app;
