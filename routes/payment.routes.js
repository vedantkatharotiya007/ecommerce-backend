import express from "express";
import { createCheckoutSession,webhook } from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-checkout-session", protect, createCheckoutSession);
router.post("/webhook", express.raw({ type: "*/*" }), webhook);
    
export default router;
