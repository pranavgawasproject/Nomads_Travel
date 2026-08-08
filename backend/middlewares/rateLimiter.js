// In-memory rate limiter middleware for authentication & sensitive endpoints
const requestCounts = new Map();

// Periodically clean up expired records to prevent memory leaks (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
if (typeof setInterval !== 'undefined') {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of requestCounts.entries()) {
      if (now - record.startTime > 24 * 60 * 60 * 1000) { // Safety ceiling: 24h
        requestCounts.delete(ip);
      }
    }
  }, CLEANUP_INTERVAL);
  if (cleanupTimer && typeof cleanupTimer.unref === 'function') {
    cleanupTimer.unref(); // Don't hold Node process open in test runners
  }
}

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

export function clearRateLimiterStore() {
  requestCounts.clear();
}

export default rateLimiter;

