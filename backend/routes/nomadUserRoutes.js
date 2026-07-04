import { Router } from "express";

import {
  changePassword,
  favoriteDestinations,
  getLikes,
  getUserFavoriteDestinations,
  getUserLikes,
  getUsers,
  likeListings,
  updateProfile,
} from "../controllers/nomadUserControllers.js";

const router = Router();

router.get("/", getUsers);
router.patch("/profile/:userId", updateProfile);
router.patch("/password/:userId", changePassword);
router.patch("/favorite-destination", favoriteDestinations);
router.get("/favorite-destination/:userId", getUserFavoriteDestinations);
router.patch("/like", likeListings);
router.get("/likes/:userId", getUserLikes);
router.get("/likes", getLikes);

export default router;
