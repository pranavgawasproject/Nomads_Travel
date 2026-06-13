import { Router } from "express";
import upload from "../config/multerConfig.js";
import {
  bulkInsertStateWiseWeightCsv,
  createStateWiseWeight,
  getAllStateWiseWeight,
  getStateWiseWeight,
  updateStateWiseWeight,
} from "../controllers/stateWiseWeightController.js";

const router = Router();

router.get("/", getAllStateWiseWeight);
router.post("/", getStateWiseWeight);
router.post("/add", upload.array("images"), createStateWiseWeight);
router.post(
  "/bulk-upload-csv",
  upload.single("state-wise-weight-file"),
  bulkInsertStateWiseWeightCsv,
);
router.patch("/:id", upload.array("images"), updateStateWiseWeight);

export default router;