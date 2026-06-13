import { Router } from "express";
import {
  addJobCategory,
  deactivateJobCategory,
} from "../controllers/job-post-controllers/jobCategoryControllers.js";

import {
  addNewJobPost,
  deactivateJobPost,
  getJobPosts,
  updateJobPost,
} from "../controllers/job-post-controllers/jobControllers.js";

const router = Router();

router.post("/add-job-category", addJobCategory);
router.patch("/decativate-job-category/:categoryId", deactivateJobCategory);
router.get("/get-job-posts", getJobPosts);
router.post("/add-new-job-post", addNewJobPost);
router.patch("/update-job-post/:jobId", updateJobPost);
router.delete("/deactivate-job-post/:jobId", deactivateJobPost);

export default router;
