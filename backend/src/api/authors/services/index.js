import { query } from '../../../lib/db.js';

// Service layer for authors CRUD operations.
export const createAuthorService = async (payload) => {
  const { name, biography, nationality } = payload;

  if (!name || typeof name !== 'string' || !name.trim()) {
    const error = new Error('Author name is required.');
    error.statusCode = 400;
    throw error;
  }

  const result = await query(
    'INSERT INTO authors (name, biography, nationality) VALUES ($1, $2, $3) RETURNING id, name, biography, nationality, created_at',
    [name.trim(), biography || null, nationality || null],
  );

  return result.rows[0];
};

export const listAuthorsService = async () => {
  const result = await query('SELECT id, name, biography, nationality, created_at FROM authors ORDER BY created_at DESC');
  return result.rows;
};

export const getAuthorByIdService = async (id) => {
  const result = await query('SELECT id, name, biography, nationality, created_at FROM authors WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    const error = new Error('Author not found.');
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

export const updateAuthorService = async (id, payload) => {
  const existing = await getAuthorByIdService(id);
  const updatedName = payload.name ?? existing.name;
  const updatedBiography = payload.biography ?? existing.biography;
  const updatedNationality = payload.nationality ?? existing.nationality;

  const result = await query(
    'UPDATE authors SET name = $1, biography = $2, nationality = $3 WHERE id = $4 RETURNING id, name, biography, nationality, created_at',
    [updatedName, updatedBiography, updatedNationality, id],
  );

  return result.rows[0];
};

export const deleteAuthorService = async (id) => {
  await getAuthorByIdService(id);
  await query('DELETE FROM authors WHERE id = $1', [id]);

  return { message: 'Author deleted successfully' };
};
