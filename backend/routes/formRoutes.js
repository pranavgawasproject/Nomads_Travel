import { Router } from "express";
import { addB2CformSubmission } from "../controllers/form-controllers/b2cFormControllers.js";
import upload from "../config/multerConfig.js";
const router = Router();

router.post(
  "/add-new-b2c-form-submission",
  upload.single("resumeLink"),
  addB2CformSubmission,
);

export default router;
