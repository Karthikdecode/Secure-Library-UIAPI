import { Router } from 'express';

const router = Router();

// TODO: Add a health-check endpoint for monitoring and uptime checks.
router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'secure-library-backend' });
});

export default router;
