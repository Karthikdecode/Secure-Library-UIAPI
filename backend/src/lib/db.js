import pg from 'pg';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const { Pool } = pg;
const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseUrl?.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
});

let isInitialized = false;

// Create a reusable PostgreSQL connection pool and ensure the users table exists.
export const connectDatabase = async () => {
  if (isInitialized) {
    return pool;
  }

  if (!env.databaseUrl) {
    throw new Error('DATABASE_URL is not configured.');
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS authors (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      biography TEXT,
      nationality VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      isbn VARCHAR(255),
      author_id INTEGER REFERENCES authors(id) ON DELETE SET NULL,
      publication_year INTEGER,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  logger.info('PostgreSQL connection pool initialized successfully.');

  isInitialized = true;
  return pool;
};

export const query = async (text, params = []) => {
  await connectDatabase();
  return pool.query(text, params);
};
