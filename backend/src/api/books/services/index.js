import { createData } from '../../../common/database-query/createData.js';
import { getData } from '../../../common/database-query/getData.js';
import { updateData } from '../../../common/database-query/updateData.js';
import { deleteData } from '../../../common/database-query/deleteData.js';

export const createBookService = async (payload) => {
  const { title, isbn, author_id, publication_year, description } = payload;

  if (!title || typeof title !== 'string' || !title.trim()) {
    const error = new Error('Book title is required.');
    error.statusCode = 400;
    throw error;
  }

  const created = await createData('books', {
    title: title.trim(),
    isbn: isbn || null,
    author_id: author_id || null,
    publication_year: publication_year || null,
    description: description || null,
  }, 'id, title, isbn, author_id, publication_year, description, created_at');

  return created;
};

export const listBooksService = async () => {
  return getData('books', {
    fields: ['id', 'title', 'isbn', 'author_id', 'publication_year', 'description', 'created_at'],
    orderBy: 'created_at DESC',
  });
};

export const getBookByIdService = async (id) => {
  const rows = await getData('books', {
    fields: ['id', 'title', 'isbn', 'author_id', 'publication_year', 'description', 'created_at'],
    condition: { id },
  });

  if (!rows || rows.length === 0) {
    const error = new Error('Book not found.');
    error.statusCode = 404;
    throw error;
  }

  return rows[0];
};

export const updateBookService = async (id, payload) => {
  const updated = await updateData(
    'books',
    {
      title: payload.title,
      isbn: payload.isbn,
      author_id: payload.author_id,
      publication_year: payload.publication_year,
      description: payload.description,
    },
    { id },
  );

  return updated;
};

export const deleteBookService = async (id) => {
  await deleteData('books', { id });
  return { message: 'Book deleted successfully' };
};
