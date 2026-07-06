import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import registerRoutes from './api/registerRoutes.js';

// Load environment variables from the .env file.
dotenv.config();

const app = express();

// Middleware for enabling cross-origin requests in a controlled way.
app.use(cors());

// Middleware for parsing JSON request bodies.
app.use(express.json());

// Middleware for parsing URL-encoded form submissions.
app.use(express.urlencoded({ extended: true }));

// Register all API feature routes.
registerRoutes(app);

// Health fallback route for verifying the API is alive.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Secure Library API is running' });
});

export default app;
