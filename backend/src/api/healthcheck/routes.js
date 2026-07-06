import { Router } from 'express';

const router = Router();

// Health endpoint for monitoring and uptime checks.
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'secure-library-backend',
    timestamp: new Date().toISOString(),
  });
});

export default router;
