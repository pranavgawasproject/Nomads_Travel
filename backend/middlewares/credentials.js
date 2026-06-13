import { allowedOrigins } from "../config/corsConfig.js";

export default function credentials(req, res, next) {
  const { origin } = req.headers;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Credentials", true);
  }
  next();
}
