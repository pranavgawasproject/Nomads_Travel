import { Router } from "express";
import {
  createBecomeContributor,
  getBecomeContributorRequests,
} from "../controllers/becomeContributorController.js";

const router = Router();

router.get("/", getBecomeContributorRequests);
router.post("/", createBecomeContributor);

export default router;
