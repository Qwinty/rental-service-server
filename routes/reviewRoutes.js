import { Router } from "express";
import {
  addReview,
  getReviewsByOfferId,
} from "../controllers/reviewController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// Добавление нового отзыва (требует авторизации)
router.post("/reviews/:offerId", authenticateToken, addReview);

// Получение отзывов к предложению
router.get("/reviews/:offerId", getReviewsByOfferId);

export default router;
