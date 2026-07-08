// src/api/authors/services/index.js
import { query } from '../../../lib/db.js';

// Accept both `name`/`bio` and `username`/`biography` from payload for compatibility.
export const createAuthorService = async (payload, userId) => {
  const name = (payload.name || payload.username || '').toString();
  const bio = payload.bio ?? payload.biography ?? null;

  if (!name || typeof name !== 'string' || !name.trim()) {
    const error = new Error('Author name is required.');
    error.statusCode = 400;
    throw error;
  }

  const result = await query(
    `INSERT INTO authors (username, biography, created_by)
     VALUES ($1, $2, $3)
     RETURNING id, username AS name, biography AS bio, created_at`,
    [name.trim(), bio, userId || null],
  );

  return result.rows[0];
};

export const listAuthorsService = async () => {
  const result = await query(
    `SELECT
       a.id,
       a.username AS name,
       a.biography AS bio,
       a.created_at,
       COUNT(b.id)::int AS books
     FROM authors a
     LEFT JOIN books b ON b.author_id = a.id
     GROUP BY a.id, a.username, a.biography, a.created_at
     ORDER BY a.created_at DESC`,
  );
  return result.rows;
};

export const getAuthorByIdService = async (id) => {
  const result = await query(
    `SELECT
       a.id,
       a.username AS name,
       a.biography AS bio,
       a.created_at,
       COUNT(b.id)::int AS books
     FROM authors a
     LEFT JOIN books b ON b.author_id = a.id
     WHERE a.id = $1
     GROUP BY a.id, a.username, a.biography, a.created_at`,
    [id],
  );

  if (result.rows.length === 0) {
    const error = new Error('Author not found.');
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

export const updateAuthorService = async (id, payload) => {
  const existing = await getAuthorByIdService(id);

  const updatedName = (payload.name || payload.username || existing.name).toString();
  const updatedBio  = payload.bio ?? payload.biography ?? existing.bio;

  const result = await query(
    `UPDATE authors
     SET username = $1, biography = $2, updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
     RETURNING id, username AS name, biography AS bio, created_at`,
    [updatedName.trim(), updatedBio, id],
  );

  return result.rows[0];
};

export const deleteAuthorService = async (id) => {
  await getAuthorByIdService(id); // 404 if missing
  await query('DELETE FROM authors WHERE id = $1', [id]);
  return { message: 'Author deleted successfully' };
};