import { getPostgresDbPool, defaultPostgresDbSchemaName } from '../../api/config/postgresDbPool.js';

const pool = getPostgresDbPool();

// Create a single row or multiple rows in a PostgreSQL table using the shared pool.
export const createData = async (tableName, data, returningColumns = 'id', client = pool) => {
  if (!tableName || tableName.trim() === '') {
    throw new Error("'tableName' is null or whitespace");
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    throw new Error("'data' is empty or null");
  }

  if (Array.isArray(data)) {
    const columns = Object.keys(data[0]);
    const placeholders = data
      .map((row, rowIndex) => `(${Object.keys(row)
        .map((_, colIndex) => `$${rowIndex * Object.keys(row).length + colIndex + 1}`)
        .join(', ')})`)
      .join(', ');

    const query = `INSERT INTO ${defaultPostgresDbSchemaName}.${tableName} (${columns.join(', ')}) VALUES ${placeholders} RETURNING ${returningColumns}`;
    const result = await client.query(query, data.flatMap((row) => Object.values(row)));
    return result.rows;
  }

  const columns = Object.keys(data);
  const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
  const query = `INSERT INTO ${defaultPostgresDbSchemaName}.${tableName} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING ${returningColumns}`;
  const result = await client.query(query, Object.values(data));
  return result.rows[0];
};
