// src/api/authors/handlers/index.js
import {
  createAuthorService,
  listAuthorsService,
  getAuthorByIdService,
  updateAuthorService,
  deleteAuthorService,
} from '../services/index.js';

export const createAuthorHandler = async (req, res) => {
  try {
    const author = await createAuthorService(req.body, req.user?.id);
    return res.status(201).json(author);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || 'Failed to create author' });
  }
};

export const listAuthorsHandler = async (req, res) => {
  try {
    const authors = await listAuthorsService();
    return res.status(200).json(authors);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || 'Failed to fetch authors' });
  }
};

export const getAuthorByIdHandler = async (req, res) => {
  try {
    const author = await getAuthorByIdService(req.params.id);
    return res.status(200).json(author);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || 'Failed to fetch author' });
  }
};

export const updateAuthorHandler = async (req, res) => {
  try {
    const author = await updateAuthorService(req.params.id, req.body);
    return res.status(200).json(author);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || 'Failed to update author' });
  }
};

export const deleteAuthorHandler = async (req, res) => {
  try {
    const result = await deleteAuthorService(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || 'Failed to delete author' });
  }
};