import jwt from 'jsonwebtoken';
import { redisClient } from './redis.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Use a simple Redis counter with TTL for fast request limiting.
export const rateLimiter = (windowSeconds = 60, maxRequests = 100) => {
  return async (req, res, next) => {
    try {
      if (req.method === 'GET' || req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE' || req.method === 'DELETE' || req.method === 'HEAD') {
        return next();
      }

      let identity = `ip:${req.ip || 'unknown'}`;
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]?.trim();
        if (token) {
          try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (decoded && typeof decoded === 'object' && 'sub' in decoded) {
              identity = `user:${decoded.sub}`;
            }
          } catch {
            // use IP if token invalid or expired
          }
        }
      }

      const key = `rate-limit:${identity}`;
      const ttl = windowSeconds;

      const [count, ttlRemaining] = await redisClient.multi()
        .incr(key)
        .expire(key, ttl, 'NX')
        .ttl(key)
        .exec();

      const requestCount = count[1] ?? 1;
      const timeRemaining = ttlRemaining[1] ?? ttl;

      res.setHeader('X-RateLimit-Limit', maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - requestCount).toString());
      res.setHeader('X-RateLimit-Reset', timeRemaining.toString());

      if (requestCount > maxRequests) {
        return res.status(429).json({ message: 'Too many requests. Please try again later.' });
      }

      return next();
    } catch (error) {
      return next();
    }
  };
};
