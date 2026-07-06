import { Router } from 'express';
import {
  createAuthor,
  listAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
} from './controller.js';
import { protect } from '../../middleware/auth.js';

const router = Router();

// Protect all authors endpoints with JWT authentication.
router.use(protect);

router.get('/', listAuthors);
router.post('/', createAuthor);
router.get('/:id', getAuthorById);
router.put('/:id', updateAuthor);
router.delete('/:id', deleteAuthor);

export default router;
