import { Router } from "express";
import upload from "../config/multerConfig.js";
import {
  bulkInsertEvents,
  getEvents,
} from "../controllers/eventController.js";

const router = Router();

router.get("/", getEvents);
router.post("/bulk-insert", upload.single("events-file"), bulkInsertEvents);

export default router;
