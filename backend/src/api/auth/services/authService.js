import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectDatabase, query } from '../../../lib/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const createToken = (user) => {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role || 'user' },
    JWT_SECRET,
    { expiresIn: '1h' },
  );
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
    'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, role, created_at',
    [payload.username.trim(), normalizedEmail, passwordHash],
  );

  const user = result.rows[0];
  const accessToken = createToken(user);

  return {
    message: 'User registered successfully',
    user: { id: user.id, username: user.username, email: user.email, role: user.role },
    accessToken,
    tokenType: 'Bearer',
  };
};

export const authenticateUser = async (payload) => {
  const normalizedEmail = payload.email.trim().toLowerCase();

  await connectDatabase();

  const result = await query(
    'SELECT id, username, email, role, password_hash FROM users WHERE email = $1',
    [normalizedEmail],
  );
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
    user: { id: user.id, username: user.username, email: user.email, role: user.role },
    accessToken,
    tokenType: 'Bearer',
  };
};
