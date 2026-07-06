import {
  createBookHandler,
  listBooksHandler,
  getBookByIdHandler,
  updateBookHandler,
  deleteBookHandler,
} from './handlers/index.js';

export const createBook = async (req, res, next) => {
  try {
    await createBookHandler(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const listBooks = async (req, res, next) => {
  try {
    await listBooksHandler(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (req, res, next) => {
  try {
    await getBookByIdHandler(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    await updateBookHandler(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    await deleteBookHandler(req, res, next);
  } catch (error) {
    next(error);
  }
};
