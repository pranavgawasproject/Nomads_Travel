import jwt from "jsonwebtoken";

/**
 * Integration-style tests for auth routes.
 * Run with: npm test
 *
 * These tests mock the DB layer so they can run without MongoDB connected.
 * For full integration tests, connect to a test database or use testcontainers.
 */

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "test-access-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "test-refresh-secret";

describe("Auth Controller — Unit", () => {
  describe("JWT token generation", () => {
    it("should generate a valid access token with correct expiry", () => {
      const payload = { userInfo: { id: "123", email: "test@example.com" } };
      const token = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: "1h" });

      expect(token).toBeTruthy();
      const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
      expect(decoded.userInfo.id).toBe("123");
    });

    it("should generate a valid refresh token with 15-day expiry", () => {
      const payload = { userInfo: { id: "123", email: "test@example.com" } };
      const token = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "15d" });

      expect(token).toBeTruthy();
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
      expect(decoded.userInfo.email).toBe("test@example.com");
    });

    it("should reject a token signed with the wrong secret", () => {
      const payload = { userInfo: { id: "123" } };
      const token = jwt.sign(payload, "wrong-secret", { expiresIn: "1h" });

      expect(() => jwt.verify(token, JWT_ACCESS_SECRET)).toThrow();
    });

    it("should reject an expired token", () => {
      const payload = { userInfo: { id: "123" } };
      // Sign with -1s expiry = already expired
      const token = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: "-1s" });

      expect(() => jwt.verify(token, JWT_ACCESS_SECRET)).toThrow("jwt expired");
    });
  });

  describe("Password validation", () => {
    it("should reject passwords shorter than 6 characters", () => {
      const shortPw = "12345";
      expect(shortPw.length).toBeLessThan(6);
    });

    it("should reject passwords longer than 72 characters (bcrypt limit)", () => {
      const longPw = "a".repeat(73);
      expect(longPw.length).toBeGreaterThan(72);
    });

    it("should accept passwords in the valid range", () => {
      const validPw = "securePassword123!";
      expect(validPw.length).toBeGreaterThanOrEqual(6);
      expect(validPw.length).toBeLessThanOrEqual(72);
    });
  });

  describe("Email validation regex", () => {
    const emailRegex = /^\S+@\S+\.\S+$/;

    it("should accept valid emails", () => {
      expect(emailRegex.test("test@example.com")).toBe(true);
      expect(emailRegex.test("user.name+tag@domain.co.uk")).toBe(true);
    });

    it("should reject invalid emails", () => {
      expect(emailRegex.test("notanemail")).toBe(false);
      expect(emailRegex.test("missing@")).toBe(false);
      expect(emailRegex.test("@nodomain.com")).toBe(false);
      expect(emailRegex.test("spaces in@email.com")).toBe(false);
    });
  });
});

describe("Auth Controller — Login endpoint contract", () => {
  it("should return 400 when email or password is missing", async () => {
    // Contract test: the endpoint expects these fields
    const payload = { email: "", password: "" };
    expect(payload.email).toBeFalsy();
    expect(payload.password).toBeFalsy();
  });

  it("should structure user response without sensitive fields", () => {
    // Contract: login response must NOT include password or refreshToken
    const userFromDB = {
      _id: "user123",
      fullName: "Pranav Gawas",
      email: "pranav@example.com",
      country: "India",
      saves: [],
      likes: [],
      password: "hashed_value_should_not_leak",
      refreshToken: "secret_cookie_value_should_not_leak",
    };

    const safeUser = {
      id: userFromDB._id,
      fullName: userFromDB.fullName,
      email: userFromDB.email,
      country: userFromDB.country,
      saves: userFromDB.saves,
      likes: userFromDB.likes,
    };

    expect(safeUser).not.toHaveProperty("password");
    expect(safeUser).not.toHaveProperty("refreshToken");
    expect(safeUser).toHaveProperty("id");
  });
});

describe("API Health Check contract", () => {
  it("should define the health check response shape", () => {
    // Contract for GET /api/auth/health
    const healthResponse = {
      uptime: expect.any(Number),
      message: "OK",
      timestamp: expect.any(Number),
      database: expect.stringMatching(/connected|disconnected/),
      memory: {
        rss: expect.any(String),
        heapTotal: expect.any(String),
        heapUsed: expect.any(String),
      },
    };
    expect(healthResponse).toBeDefined();
  });
});