import { Router } from 'express';

const router = Router();

// TODO: Define book-related endpoints.
router.get('/', (req, res) => {
  res.json({ message: 'Books route placeholder' });
});

export default router;
