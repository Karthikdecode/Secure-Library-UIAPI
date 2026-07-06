import { getPostgresDbPool, defaultPostgresDbSchemaName } from '../../api/config/postgresDbPool.js';

const pool = getPostgresDbPool();

// Fetch rows from a PostgreSQL table using a shared helper interface.
export const getData = async (tableName, options = {}) => {
  if (!tableName || tableName.trim() === '') {
    throw new Error("'tableName' is null or whitespace");
  }

  const { fields, condition, rawCondition, join, orderBy, groupBy, limit, offset, values } = options;
  const selectFields = fields && fields.length > 0 ? fields.join(', ') : '*';

  let whereClause = '';
  let queryParams = [];
  let paramIndex = 1;

  if (values && Array.isArray(values) && values.length > 0) {
    queryParams = [...values];
    paramIndex = values.length + 1;
  }

  if (rawCondition && rawCondition.trim() !== '') {
    whereClause = `WHERE ${rawCondition}`;
  } else if (condition && Object.keys(condition).length > 0) {
    const conditions = [];
    for (const [key, value] of Object.entries(condition)) {
      if (value === null || value === undefined) {
        conditions.push(`${key} IS NULL`);
      } else {
        queryParams.push(value);
        conditions.push(`${key} = $${paramIndex++}`);
      }
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }
  }

  const query = `
    SELECT ${selectFields}
    FROM ${defaultPostgresDbSchemaName}.${tableName}
    ${join || ''}
    ${whereClause}
    ${groupBy ? `GROUP BY ${groupBy}` : ''}
    ${orderBy ? `ORDER BY ${orderBy}` : ''}
    ${typeof limit === 'number' ? `LIMIT ${limit}` : ''}
    ${typeof offset === 'number' ? `OFFSET ${offset}` : ''}
  `;

  const result = await (options.client || pool).query(query, queryParams);
  return result.rows;
};
