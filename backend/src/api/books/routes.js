import { Router } from 'express';
import {
  createBook,
  listBooks,
  getBookById,
  updateBook,
  deleteBook,
} from './controller.js';
import { protect } from '../../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', listBooks);
router.post('/', createBook);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
