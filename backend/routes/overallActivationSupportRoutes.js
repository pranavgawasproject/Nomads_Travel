import { Router } from "express";
import {
  createOverallActivationSupport,
  getOverallActivationSupportRequests,
} from "../controllers/overallActivationSupportController.js";

const router = Router();

router.get("/", getOverallActivationSupportRequests);
router.post("/", createOverallActivationSupport);

export default router;
