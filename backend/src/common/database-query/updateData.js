import { getPostgresDbPool, defaultPostgresDbSchemaName } from '../../api/config/postgresDbPool.js';

const pool = getPostgresDbPool();

// Update existing rows in a PostgreSQL table using a shared helper interface.
export const updateData = async (tableName, data, condition, options = {}) => {
  if (!tableName || tableName.trim() === '') {
    throw new Error("'tableName' is null or whitespace");
  }

  if (!data || Object.keys(data).length === 0) {
    throw new Error("'data' is empty or null");
  }

  const setClause = Object.keys(data)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ');

  const queryParams = [...Object.values(data)];
  let whereClause = '';
  let whereParams = [];

  if (condition && typeof condition === 'object' && !Array.isArray(condition)) {
    const conditions = Object.entries(condition).map(([key, value], index) => {
      whereParams.push(value);
      return `${key} = $${queryParams.length + index + 1}`;
    });
    whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  }

  const query = `UPDATE ${defaultPostgresDbSchemaName}.${tableName} SET ${setClause} ${whereClause} RETURNING *`;
  const result = await (options.client || pool).query(query, [...queryParams, ...whereParams]);
  return result.rows[0];
};
