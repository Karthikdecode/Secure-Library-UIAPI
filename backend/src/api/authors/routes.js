import { Router } from 'express';

const router = Router();

// TODO: Define author-related endpoints.
router.get('/', (req, res) => {
  res.json({ message: 'Authors route placeholder' });
});

export default router;
