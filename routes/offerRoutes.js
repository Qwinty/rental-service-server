import { Router } from "express";
import {
  getAllOffers,
  createOffer,
  getFullOffer,
  getFavoriteOffers,
  addFavorite,
  removeFavorite,
} from "../controllers/offerController.js";
import {
  authenticateToken,
  optionalAuth,
} from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = Router();

router.get("/offers", optionalAuth, getAllOffers);
router.get("/offers/favorites/list", authenticateToken, getFavoriteOffers);
router.get("/offers/:id", optionalAuth, getFullOffer);
router.post(
  "/offers",
  authenticateToken,
  upload.fields([
    { name: "previewImage", maxCount: 1 },
    { name: "photos", maxCount: 10 },
  ]),
  createOffer
);

// Route to add an offer to favorites - requires authentication
router.post("/offers/:offerId/favorite", authenticateToken, addFavorite);

// Route to remove an offer from favorites - requires authentication
router.delete("/offers/:offerId/favorite", authenticateToken, removeFavorite);

export default router;
