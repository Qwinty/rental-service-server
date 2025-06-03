import { Router } from "express";
import offerRoutes from "./offerRoutes.js";
import userRoutes from "./userRoutes.js";
import reviewRoutes from "./reviewRoutes.js";

const router = Router();

// Health check endpoint under API
router.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "rental-backend-api",
  });
});

router.use("/api", offerRoutes);
router.use("/api", userRoutes);
router.use("/api", reviewRoutes);

export default router;
