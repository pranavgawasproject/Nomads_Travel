import { Router } from "express";
import {
  createConsultation,
  getConsultationRequests,
} from "../controllers/consultationController.js";

const router = Router();

router.get("/", getConsultationRequests);
router.post("/", createConsultation);

export default router;
