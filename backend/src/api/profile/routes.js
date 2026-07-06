import { Router } from 'express';

const router = Router();

// TODO: Define profile-related endpoints.
router.get('/', (req, res) => {
  res.json({ message: 'Profile route placeholder' });
});

export default router;
