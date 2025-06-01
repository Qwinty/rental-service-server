import { Router } from "express";
import { registration, getUserInfo } from "../controllers/userController.js";
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

router.get("/users/:id", getUserInfo);

export default router;
