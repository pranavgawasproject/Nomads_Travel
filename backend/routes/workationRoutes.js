import { Router } from "express";
import {
  createWorkation,
  getWorkationRequests,
} from "../controllers/workationController.js";

const router = Router();

router.get("/", getWorkationRequests);
router.post("/", createWorkation);

export default router;
