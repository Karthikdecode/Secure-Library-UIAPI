import {
  createAuthorHandler,
  listAuthorsHandler,
  getAuthorByIdHandler,
  updateAuthorHandler,
  deleteAuthorHandler,
} from './handlers/index.js';

// Controller layer for authors requests.
export const createAuthor = async (req, res, next) => {
  try {
    await createAuthorHandler(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const listAuthors = async (req, res, next) => {
  try {
    await listAuthorsHandler(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const getAuthorById = async (req, res, next) => {
  try {
    await getAuthorByIdHandler(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const updateAuthor = async (req, res, next) => {
  try {
    await updateAuthorHandler(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const deleteAuthor = async (req, res, next) => {
  try {
    await deleteAuthorHandler(req, res, next);
  } catch (error) {
    next(error);
  }
};
