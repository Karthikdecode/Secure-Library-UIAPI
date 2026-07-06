import pg from 'pg';

const { Pool } = pg;

export const defaultPostgresDbSchemaName = process.env.DATABASE_SCHEMA || 'public';

let pool;

export const getPostgresDbPool = () => {
  if (pool) {
    return pool;
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
  });

  return pool;
};
