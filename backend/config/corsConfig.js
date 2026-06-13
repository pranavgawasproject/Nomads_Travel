export const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3006",
  "http://localhost:3007",
  "https://yourdomain.com",
  "https://www.yourdomain.com",
  "https://api.yourdomain.com",
  "http://localhost:5000",
  "http://localhost:5006",
  "http://localhost:5007",
];

const regexAllowedOrigins = [
  /\.yourdomain\.com$/, // allow any subdomain of yourdomain.com
  /\.localhost:5173$/, // allow any subdomain of localhost:5173 (for Vite dev tenant sites)
];

export const corsConfig = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser / curl / server-side requests

    if (
      allowedOrigins.includes(origin) ||
      regexAllowedOrigins.some((regex) => regex.test(origin)) ||
      !origin
    ) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true, // important if you use cookies/sessions
  optionsSuccessStatus: 200,
};
