// import { Router } from 'express';
// import {
//   createBook,
//   listBooks,
//   getBookById,
//   updateBook,
//   deleteBook,
// } from './controller.js';
// import { protect } from '../../middleware/auth.js';

// const router = Router();

// router.use(protect);

// router.get('/', listBooks);
// router.post('/', createBook);
// router.get('/:id', getBookById);
// router.put('/:id', updateBook);
// router.delete('/:id', deleteBook);

// export default router;
// src/api/books/routes.js
import { Router } from 'express';
import { listBooks, createBook, getBookById, updateBook, deleteBook } from './controller.js';
import { authenticate } from '../../middleware/authenticate.js'; // your JWT middleware

const router = Router();

router.get('/',        listBooks);           
router.get('/:id',    getBookById);         
router.post('/',      authenticate, createBook);   // JWT required
router.put('/:id',    authenticate, updateBook);   // JWT required
router.delete('/:id', authenticate, deleteBook);   // JWT required

export default router;