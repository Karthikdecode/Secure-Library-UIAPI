import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
export const redisClient = new Redis(redisUrl);
export let redisAvailable = false;

redisClient.on('error', (error) => {
  console.warn('Redis connection warning:', error.message);
});

(async () => {
  try {
    // Attempt a manual connect to detect availability early
    if (typeof redisClient.connect === 'function') {
      await redisClient.connect();
    }
    redisAvailable = true;
    console.log('Redis Connected');
  } catch (err) {
    console.warn('Redis unavailable, continuing without cache');
  }
})();
