import { Router } from 'express';
import {
  createAuthor,
  listAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
} from './controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

router.get('/', listAuthors);
router.get('/:id', getAuthorById);
router.post('/', authenticate, createAuthor);
router.put('/:id', authenticate, updateAuthor);
router.delete('/:id', authenticate, deleteAuthor);

export default router;
