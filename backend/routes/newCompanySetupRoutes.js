import { Router } from "express";
import {
  createNewCompanySetup,
  getNewCompanySetupRequests,
} from "../controllers/newCompanySetupController.js";

const router = Router();

router.get("/", getNewCompanySetupRequests);
router.post("/", createNewCompanySetup);

export default router;
