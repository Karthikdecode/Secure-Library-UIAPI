import { Router } from 'express';

const router = Router();

// TODO: Define upload-related endpoints.
router.post('/', (req, res) => {
  res.json({ message: 'Upload route placeholder' });
});

export default router;
