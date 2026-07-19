import { Router } from "express";
import { getActivityFeed, createActivity } from "../controllers/activityFeedController.js";

const router = Router();

router.get("/", getActivityFeed);
router.post("/", createActivity);

export default router;
