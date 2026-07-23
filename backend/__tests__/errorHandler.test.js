import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import errorHandler from "../middlewares/errorHandler.js";

describe("ErrorHandler Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it("should format custom error with statusCode and message", () => {
    const error = new Error("Invalid payload");
    error.statusCode = 400;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        statusCode: 400,
        message: "Invalid payload",
      })
    );
  });

  it("should default to 500 when no status code is provided", () => {
    const error = new Error("Database connection lost");

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        statusCode: 500,
        message: "Database connection lost",
      })
    );
  });
});
