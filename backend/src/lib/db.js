import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

let isInitialized = false;

// Create a reusable PostgreSQL connection pool and ensure the users table exists.
export const connectDatabase = async () => {
  if (isInitialized) {
    return pool;
  }

  if (!process.env.DATABASE_URL) {
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

  isInitialized = true;
  return pool;
};

export const query = async (text, params = []) => {
  await connectDatabase();
  return pool.query(text, params);
};
