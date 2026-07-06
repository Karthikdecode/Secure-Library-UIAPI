import {
  createAuthorService,
  listAuthorsService,
  getAuthorByIdService,
  updateAuthorService,
  deleteAuthorService,
} from '../services/index.js';

// Handler layer for authors CRUD operations.
export const createAuthorHandler = async (req, res, next) => {
  try {
    const author = await createAuthorService(req.body);
    return res.status(201).json(author);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ message: error.message || 'Failed to create author' });
  }
};

export const listAuthorsHandler = async (req, res, next) => {
  try {
    const authors = await listAuthorsService();
    return res.status(200).json(authors);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ message: error.message || 'Failed to fetch authors' });
  }
};

export const getAuthorByIdHandler = async (req, res, next) => {
  try {
    const author = await getAuthorByIdService(req.params.id);
    return res.status(200).json(author);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ message: error.message || 'Failed to fetch author' });
  }
};

export const updateAuthorHandler = async (req, res, next) => {
  try {
    const author = await updateAuthorService(req.params.id, req.body);
    return res.status(200).json(author);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ message: error.message || 'Failed to update author' });
  }
};

export const deleteAuthorHandler = async (req, res, next) => {
  try {
    const result = await deleteAuthorService(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ message: error.message || 'Failed to delete author' });
  }
};
