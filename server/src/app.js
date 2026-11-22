// Express application and middleware order. Errors are handled last, always.
// `/api-docs` will be mounted before helmet in M5; M0 has no feature routes yet.

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '100kb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Feature routes are mounted here in later modules.
app.use(notFound);
app.use(errorHandler);

export default app;
