import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectDatabase, query } from '../../../lib/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const createToken = (user) => {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};

// Service layer for registration and authentication business logic.
export const createUser = async (payload) => {
  const normalizedEmail = payload.email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(payload.password, 12);

  await connectDatabase();

  const existingUser = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
  if (existingUser.rows.length > 0) {
    const error = new Error('A user with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  const result = await query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
    [payload.name.trim(), normalizedEmail, passwordHash],
  );

  const user = result.rows[0];
  const accessToken = createToken(user);

  return {
    message: 'User registered successfully',
    user: { id: user.id, name: user.name, email: user.email },
    accessToken,
    tokenType: 'Bearer',
  };
};

export const authenticateUser = async (payload) => {
  const normalizedEmail = payload.email.trim().toLowerCase();

  await connectDatabase();

  const result = await query('SELECT id, name, email, password_hash FROM users WHERE email = $1', [normalizedEmail]);
  if (result.rows.length === 0) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const user = result.rows[0];
  const passwordMatches = await bcrypt.compare(payload.password, user.password_hash);
  if (!passwordMatches) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const accessToken = createToken(user);

  return {
    message: 'Login successful',
    user: { id: user.id, name: user.name, email: user.email },
    accessToken,
    tokenType: 'Bearer',
  };
};
