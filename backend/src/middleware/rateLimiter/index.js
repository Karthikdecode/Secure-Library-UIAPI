import { redisClient } from './redis.js';

// Apply a simple Redis-backed sliding-window limiter per IP.
export const rateLimiter = (windowSeconds = 60, maxRequests = 100) => {
  return async (req, res, next) => {
    try {
      const key = `rate-limit:${req.ip || 'unknown'}`;
      const now = Date.now();
      const windowMs = windowSeconds * 1000;

      const current = await redisClient.get(key);
      const parsed = current ? JSON.parse(current) : { requests: [], lastReset: now };

      const recentRequests = parsed.requests.filter((timestamp) => now - timestamp < windowMs);
      recentRequests.push(now);

      if (recentRequests.length > maxRequests) {
        return res.status(429).json({ message: 'Too many requests. Please try again later.' });
      }

      await redisClient.set(key, JSON.stringify({ requests: recentRequests, lastReset: now }), 'EX', windowSeconds);
      return next();
    } catch (error) {
      return next();
    }
  };
};
