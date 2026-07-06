import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import registerRoutes from './api/registerRoutes.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const app = express();

app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

registerRoutes(app);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Secure Library API is running' });
});

app.use((err, req, res, next) => {
  logger.error(err.message || 'Unhandled error');
  res.status(err.statusCode || 500).json({ message: err.message || 'Internal server error' });
});

export default app;
