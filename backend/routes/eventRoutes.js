import { Router } from "express";
import upload from "../config/multerConfig.js";
import {
  bulkInsertEvents,
  getEvents,
  getEventDetails,
  rsvpEvent,
  addEventComment,
} from "../controllers/eventController.js";

const router = Router();

router.get("/", getEvents);
router.post("/bulk-insert", upload.single("events-file"), bulkInsertEvents);
router.get("/:eventId", getEventDetails);
router.post("/:eventId/rsvp", rsvpEvent);
router.post("/:eventId/comment", addEventComment);

export default router;

