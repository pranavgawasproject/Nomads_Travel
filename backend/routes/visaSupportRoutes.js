import { Router } from "express";
import {
  createVisaSupport,
  getVisaSupportRequests,
} from "../controllers/visaSupportController.js";

const router = Router();

router.get("/", getVisaSupportRequests);
router.post("/", createVisaSupport);

export default router;
