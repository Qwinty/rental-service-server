import { Router } from "express";
import { registration } from "../controllers/userController.js";
import upload from "../middleware/upload.js";

const router = Router();

router.post("/users/register", upload.single("avatar"), registration);

export default router;
