import { Router } from "express";
import {
  registration,
  getUserInfo,
  login,
  checkAuth,
  logout,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import upload, {
  handleMulterError,
  checkDefaultAvatar,
} from "../middleware/upload.js";

const router = Router();

router.post(
  "/users/register",
  checkDefaultAvatar,
  upload.single("avatar"),
  handleMulterError,
  registration
);

// Маршруты для авторизации (должны идти ПЕРЕД /:id)
router.post("/users/login", login);
router.get("/users/login", authenticateToken, checkAuth);
router.delete("/users/logout", logout);

// Общий маршрут с параметром (должен быть ПОСЛЕДНИМ)
router.get("/users/:id", getUserInfo);

export default router;
