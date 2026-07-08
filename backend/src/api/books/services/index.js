// import { createData } from '../../../common/database-query/createData.js';
// import { getData } from '../../../common/database-query/getData.js';
// import { updateData } from '../../../common/database-query/updateData.js';
// import { deleteData } from '../../../common/database-query/deleteData.js';

// export const createBookService = async (payload) => {
//   const { title, isbn, author_id, publication_year, description } = payload;

//   if (!title || typeof title !== 'string' || !title.trim()) {
//     const error = new Error('Book title is required.');
//     error.statusCode = 400;
//     throw error;
//   }

//   const created = await createData('books', {
//     title: title.trim(),
//     isbn: isbn || null,
//     author_id: author_id || null,
//     publication_year: publication_year || null,
//     description: description || null,
//   }, 'id, title, isbn, author_id, publication_year, description, created_at');

//   return created;
// };

// export const listBooksService = async () => {
//   return getData('books', {
//     fields: ['id', 'title', 'isbn', 'author_id', 'publication_year', 'description', 'created_at'],
//     orderBy: 'created_at DESC',
//   });
// };

// export const getBookByIdService = async (id) => {
//   const rows = await getData('books', {
//     fields: ['id', 'title', 'isbn', 'author_id', 'publication_year', 'description', 'created_at'],
//     condition: { id },
//   });

//   if (!rows || rows.length === 0) {
//     const error = new Error('Book not found.');
//     error.statusCode = 404;
//     throw error;
//   }

//   return rows[0];
// };

// export const updateBookService = async (id, payload) => {
//   const updated = await updateData(
//     'books',
//     {
//       title: payload.title,
//       isbn: payload.isbn,
//       author_id: payload.author_id,
//       publication_year: payload.publication_year,
//       description: payload.description,
//     },
//     { id },
//   );

//   return updated;
// };

// export const deleteBookService = async (id) => {
//   await deleteData('books', { id });
//   return { message: 'Book deleted successfully' };
// };

// src/api/books/services/index.js
import { createData } from '../../../common/database-query/createData.js';
import { getData } from '../../../common/database-query/getData.js';
import { updateData } from '../../../common/database-query/updateData.js';
import { deleteData } from '../../../common/database-query/deleteData.js';

const BOOK_FIELDS = [
  'id', 'title', 'description', 'price',
  'image_url', 'cloudinary_public_id',
  'author_id', 'created_by', 'created_at', 'updated_at',
];

export const createBookService = async (payload, userId) => {
  const { title, description, price, image_url, cloudinary_public_id, author_id } = payload;

  if (!title?.trim()) {
    const error = new Error('Book title is required.');
    error.statusCode = 400;
    throw error;
  }
  if (!author_id) {
    const error = new Error('Author is required.');
    error.statusCode = 400;
    throw error;
  }

  return createData(
    'books',
    {
      title: title.trim(),
      description: description || null,
      price: price ?? null,
      image_url: image_url || null,
      cloudinary_public_id: cloudinary_public_id || null,
      author_id,
      created_by: userId || null,
    },
    BOOK_FIELDS.join(', '),
  );
};

export const listBooksService = async () => {
  return getData('books', {
    fields: BOOK_FIELDS,
    orderBy: 'created_at DESC',
  });
};

export const getBookByIdService = async (id) => {
  const rows = await getData('books', {
    fields: BOOK_FIELDS,
    condition: { id },
  });
  if (!rows?.length) {
    const error = new Error('Book not found.');
    error.statusCode = 404;
    throw error;
  }
  return rows[0];
};

export const updateBookService = async (id, payload) => {
  const { title, description, price, image_url, cloudinary_public_id, author_id } = payload;
  return updateData(
    'books',
    { title, description, price, image_url, cloudinary_public_id, author_id },
    { id },
  );
};

export const deleteBookService = async (id) => {
  await deleteData('books', { id });
  return { message: 'Book deleted successfully' };
};