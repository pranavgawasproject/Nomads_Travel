import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  resetPassword,
  aiForgotPassword,
} from "../controllers/authControllers/authControllers.js";
import { refreshTokenController } from "../controllers/authControllers/refreshTokenController.js";

const router = Router();

router.post("/login", login);
router.get("/logout", logout);
router.get("/refresh", refreshTokenController);
router.post("/forgot-password", forgotPassword);
router.post("/ai-forgot-password", aiForgotPassword);
router.patch("/reset-password/:token", resetPassword);

export default router;
