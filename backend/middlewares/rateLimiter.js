// In-memory rate limiter middleware for authentication & sensitive endpoints
const requestCounts = new Map();

export const rateLimiter = (options = { windowMs: 15 * 60 * 1000, max: 100 }) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    let record = requestCounts.get(ip);
    if (!record || now - record.startTime > options.windowMs) {
      record = { count: 1, startTime: now };
      requestCounts.set(ip, record);
    } else {
      record.count += 1;
    }

    if (record.count > options.max) {
      return res.status(429).json({
        message: 'Too many requests from this IP, please try again later.',
        retryAfterSeconds: Math.ceil((record.startTime + options.windowMs - now) / 1000)
      });
    }

    next();
  };
};

export default rateLimiter;
