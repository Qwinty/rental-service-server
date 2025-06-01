import { Router } from "express";
import { getAllOffers } from "../controllers/offerController.js";

const router = Router();

router.get("/offers", getAllOffers);

export default router;
