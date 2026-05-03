import express from "express";
import { protect } from "../middleware/auth.js";
import { managefcmtoken } from "../controllers/fcmtoken.controller.js";



const router = express.Router();

router.post("/",protect,managefcmtoken);

export default router;
