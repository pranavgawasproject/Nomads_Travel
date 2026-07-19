import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import rateLimiter from "../middlewares/rateLimiter.js";

describe("Rate Limiter Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { ip: "127.0.0.1", headers: {}, socket: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  test("should allow requests under rate limit", () => {
    req.ip = "10.0.0.1";
    const limiter = rateLimiter({ windowMs: 60000, max: 2 });

    limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);

    limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(2);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("should block requests when rate limit is exceeded", () => {
    req.ip = "10.0.0.2";
    const limiter = rateLimiter({ windowMs: 60000, max: 1 });

    limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);

    limiter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("Too many requests")
      })
    );
  });
});
