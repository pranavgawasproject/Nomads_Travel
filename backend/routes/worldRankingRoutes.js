import express, { Router } from "express";
import upload from "../config/multerConfig.js";
import {
  bulkInsertWorldRankingCsv,
  getAllWorldRankingStates,
  getDropdownBadges,
  getWorldRankingStates,
  getWorldRankingWeights,
  importWorldRankingTsv,
  searchWorldRankingByBadges,
  upsertWorldRankingStates,
} from "../controllers/worldRankingController.js";

const router = Router();

router.get("/weights", getWorldRankingWeights);
router.get("/dropdown-badges", getDropdownBadges);
router.get("/all", getAllWorldRankingStates);
router.get("/states", getWorldRankingStates);
router.post("/search", searchWorldRankingByBadges);
router.post("/states/upsert", upsertWorldRankingStates);
router.post(
  "/states/import-tsv",
  express.text({ type: "text/plain", limit: "10mb" }),
  importWorldRankingTsv,
);
router.post(
  "/states/bulk-upload-csv",
  upload.single("world-ranking-file"),
  bulkInsertWorldRankingCsv,
);

export default router;
