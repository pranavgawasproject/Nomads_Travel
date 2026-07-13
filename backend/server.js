import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import { corsConfig } from "./config/corsConfig.js";
import cors from "cors";
import multer from "multer";
import errorHandler from "./middlewares/errorHandler.js";
import companyRoutes from "./routes/companyRoutes.js";
import pocRoutes from "./routes/pocRoutes.js";
import reviewRoutes from "./routes/ReviewRoutes.js";
import formRoutes from "./routes/formRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import connectDb from "./config/db.js";
import newsRoutes from "./routes/newsRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import nomadUserRoutes from "./routes/nomadUserRoutes.js";
import worldRankingRoutes from "./routes/worldRankingRoutes.js";
import cookieParser from "cookie-parser";
import credentials from "./middlewares/credentials.js";
import { verifyJwt } from "./middlewares/verifyJwt.js";
import visaSupportRoutes from "./routes/visaSupportRoutes.js";
import visaRuleRoutes from "./routes/visaRuleRoutes.js";
import overallActivationSupportRoutes from "./routes/overallActivationSupportRoutes.js";
import newCompanySetupRoutes from "./routes/newCompanySetupRoutes.js";
import consultationRoutes from "./routes/consultationRoutes.js";
import workationRoutes from "./routes/workationRoutes.js";
import becomeContributorRoutes from "./routes/becomeContributorRoutes.js";
import stateWiseWeightRoutes from "./routes/stateWiseWeightRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

const app = express();
config({ override: true });
connectDb(process.env.MONGO_URL);

app.use(credentials);
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
app.use("/api/user", verifyJwt, nomadUserRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/poc", pocRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/world-ranking", worldRankingRoutes);
app.use("/api/visa-support", visaSupportRoutes);
app.use("/api/visa-rules", visaRuleRoutes);
app.use("/api/overall-activation-support", overallActivationSupportRoutes);
app.use("/api/new-company-setup", newCompanySetupRoutes);
app.use("/api/consultation", consultationRoutes);
app.use("/api/workation", workationRoutes);
app.use("/api/become-contributor", becomeContributorRoutes);
app.use("/api/state-wise-weight", stateWiseWeightRoutes);

app.use("/api/news", newsRoutes);
app.use("/api/blogs", blogRoutes); // New Blog Route
app.use("/api/events", eventRoutes);

// Health check endpoint for Docker/Kubernetes
app.get('/api/auth/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    memory: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
    }
  };
  try {
    return res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = error.message;
    return res.status(503).json(healthcheck);
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'RoamIQ API',
    version: '1.0.0',
    description: 'The operating system for digital nomads',
    documentation: '/api',
    health: '/api/auth/health',
    status: 'running'
  });
});

app.all("/*splat", (req, res) => {
  if (req.accepts("html")) {
    res.status(404).send("<h1>404 not found</h1>");
  } else if (req.accepts("json")) {
    return res.status(404).json({ message: "404 not found" });
  } else {
    res.type("text").status(404).send("404 not found");
  }
});

app.use((err, req, res, next) => {
  // Multer: file too large
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      message:
        "Some files are too large. Please keep images under the allowed size and try again.",
    });
  }

  // express.json() or express.urlencoded(): body too large
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      message:
        "The data you’re sending is too large. Please reduce the size and try again.",
    });
  }

  next(err);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB");
});
