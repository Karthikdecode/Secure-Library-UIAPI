import { Router } from 'express';
import authRoutes from './auth/routes.js';
import authorsRoutes from './authors/routes.js';
import booksRoutes from './books/routes.js';
import uploadRoutes from './upload/routes.js';
import profileRoutes from './profile/routes.js';
import healthcheckRoutes from './healthcheck/routes.js';

// This module centralizes route registration for the application.
const registerRoutes = (app) => {
  const apiRouter = Router();

  apiRouter.use('/auth', authRoutes);
  apiRouter.use('/authors', authorsRoutes);
  apiRouter.use('/books', booksRoutes);
  apiRouter.use('/upload', uploadRoutes);
  apiRouter.use('/profile', profileRoutes);
  apiRouter.use('/healthcheck', healthcheckRoutes);

  app.use('/api', apiRouter);
};

export default registerRoutes;
