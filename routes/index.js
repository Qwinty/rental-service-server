import { Router } from "express";
import offerRoutes from "./offerRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.use("/api", offerRoutes);
router.use("/api", userRoutes);

export default router;
