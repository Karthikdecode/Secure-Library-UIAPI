// import {
//   createBookService,
//   listBooksService,
//   getBookByIdService,
//   updateBookService,
//   deleteBookService,
// } from '../services/index.js';

// export const createBookHandler = async (req, res) => {
//   try {
//     const book = await createBookService(req.body);
//     return res.status(201).json(book);
//   } catch (error) {
//     const statusCode = error.statusCode || 500;
//     return res.status(statusCode).json({ message: error.message || 'Failed to create book' });
//   }
// };

// export const listBooksHandler = async (req, res) => {
//   try {
//     const books = await listBooksService();
//     return res.status(200).json(books);
//   } catch (error) {
//     const statusCode = error.statusCode || 500;
//     return res.status(statusCode).json({ message: error.message || 'Failed to fetch books' });
//   }
// };

// export const getBookByIdHandler = async (req, res) => {
//   try {
//     const book = await getBookByIdService(req.params.id);
//     return res.status(200).json(book);
//   } catch (error) {
//     const statusCode = error.statusCode || 500;
//     return res.status(statusCode).json({ message: error.message || 'Failed to fetch book' });
//   }
// };

// export const updateBookHandler = async (req, res) => {
//   try {
//     const book = await updateBookService(req.params.id, req.body);
//     return res.status(200).json(book);
//   } catch (error) {
//     const statusCode = error.statusCode || 500;
//     return res.status(statusCode).json({ message: error.message || 'Failed to update book' });
//   }
// };

// export const deleteBookHandler = async (req, res) => {
//   try {
//     const result = await deleteBookService(req.params.id);
//     return res.status(200).json(result);
//   } catch (error) {
//     const statusCode = error.statusCode || 500;
//     return res.status(statusCode).json({ message: error.message || 'Failed to delete book' });
//   }
// };

// src/api/books/handlers/index.js
import {
  createBookService,
  listBooksService,
  getBookByIdService,
  updateBookService,
  deleteBookService,
} from '../services/index.js';

export const createBookHandler = async (req, res) => {
  const userId = req.user?.id ?? null; // from JWT middleware
  const book = await createBookService(req.body, userId);
  return res.status(201).json(book);
};

export const listBooksHandler = async (req, res) => {
  const books = await listBooksService();
  return res.status(200).json(books);
};

export const getBookByIdHandler = async (req, res) => {
  const book = await getBookByIdService(req.params.id);
  return res.status(200).json(book);
};

export const updateBookHandler = async (req, res) => {
  const book = await updateBookService(req.params.id, req.body);
  return res.status(200).json(book);
};

export const deleteBookHandler = async (req, res) => {
  const result = await deleteBookService(req.params.id);
  return res.status(200).json(result);
};