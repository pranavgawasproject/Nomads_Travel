import jwt from "jsonwebtoken";

export const verifyJwt = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });

  const token = authorization.split(" ")[1];
  const secret = process.env.JWT_ACCESS_SECRET || process.env.ACCESS_TOKEN_SECRET;

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    req.userData = decoded.userInfo;

    next();
  });
};

/**
 * Shorthand: returns 401 if the request has no auth header.
 * Use this as the FIRST middleware on protected routes.
 */
export const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized — no token provided" });
  }
  const token = authorization.split(" ")[1];
  const secret = process.env.JWT_ACCESS_SECRET || process.env.ACCESS_TOKEN_SECRET;

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired — please log in again" });
      }
      return res.status(403).json({ message: "Forbidden — invalid token" });
    }
    req.userData = decoded.userInfo;
    next();
  });
};
