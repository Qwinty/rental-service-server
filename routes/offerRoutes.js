import { Router } from "express";
import {
  getAllOffers,
  createOffer,
  getFullOffer,
} from "../controllers/offerController.js";
import upload from "../middleware/upload.js";

const router = Router();

router.get("/offers", getAllOffers);
router.get("/offers/:id", getFullOffer);
router.post(
  "/offers",
  upload.fields([
    { name: "previewImage", maxCount: 1 },
    { name: "photos", maxCount: 10 },
  ]),
  createOffer
);

export default router;
