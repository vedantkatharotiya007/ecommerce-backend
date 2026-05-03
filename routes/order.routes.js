import express from "express";
import { adminOnly,protect } from "../middleware/auth.js";
import {
  getOrders,
  getOrdersuser,getOrderuser,
  updateOrderStatus,
  pdf,getOrderDetails
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/",protect , adminOnly, getOrders);
router.get("/user",protect , getOrdersuser);
router.get("/user/:id",protect , getOrderuser);
router.get("/:id",protect , adminOnly, getOrderDetails);
router.get("/pdf/:id" ,pdf);
router.put("/:id",protect , adminOnly, updateOrderStatus);

export default router;
