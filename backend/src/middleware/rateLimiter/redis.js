import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

export const redisClient = new Redis(redisUrl);

redisClient.on('error', (error) => {
  console.warn('Redis connection warning:', error.message);
});
