import { Router } from "express";
import {
  getAllOffers,
  createOffer,
  getFullOffer,
  getFavoriteOffers,
  toggleFavorite,
} from "../controllers/offerController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = Router();

router.get("/offers", getAllOffers);
router.get("/offers/favorite", getFavoriteOffers);
router.get("/offers/:id", getFullOffer);
router.post(
  "/offers",
  upload.fields([
    { name: "previewImage", maxCount: 1 },
    { name: "photos", maxCount: 10 },
  ]),
  createOffer
);

// Маршрут для добавления/удаления из избранного (требует авторизации)
router.post(
  "/offers/favorite/:offerId/:status",
  authenticateToken,
  toggleFavorite
);

export default router;
