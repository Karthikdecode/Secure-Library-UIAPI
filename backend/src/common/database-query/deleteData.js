import { getPostgresDbPool, defaultPostgresDbSchemaName } from '../../api/config/postgresDbPool.js';

const pool = getPostgresDbPool();

// Delete rows from a PostgreSQL table using a shared helper interface.
export const deleteData = async (tableName, condition, client = pool) => {
  if (!tableName || tableName.trim() === '') {
    throw new Error("'tableName' is null or whitespace");
  }

  const conditions = Object.entries(condition || {}).map(([key, value], index) => `${key} = $${index + 1}`);
  const values = Object.values(condition || {});
  const query = `DELETE FROM ${defaultPostgresDbSchemaName}.${tableName}${conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : ''}`;

  await client.query(query, values);
  return { message: 'Deleted successfully' };
};
