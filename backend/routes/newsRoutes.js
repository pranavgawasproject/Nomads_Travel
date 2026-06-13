// routes/newsRoutes.js
import { Router } from "express";
import {
  getNews,
  bulkInsertnews,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/newsController.js";
import upload from "../config/multerConfig.js";

const router = Router();
router.get("/news", getNews);
router.get("/get-news", getNews);
router.post("/news", createNews);
router.put("/news/:id", updateNews);
router.delete("/news/:id", deleteNews);
router.post("/bulk-insert", upload.single("news-file"), bulkInsertnews);
export default router;
