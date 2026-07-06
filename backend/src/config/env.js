import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'secure-library-jwt-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
};
