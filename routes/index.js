import { Router } from "express";
import offerRoutes from "./offerRoutes.js";
import userRoutes from "./userRoutes.js";
import reviewRoutes from "./reviewRoutes.js";

const router = Router();

router.use("/api", offerRoutes);
router.use("/api", userRoutes);
router.use("/api", reviewRoutes);

export default router;
