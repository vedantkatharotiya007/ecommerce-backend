import express from "express";
import { protect } from "../middleware/auth.js";
import { createaddress,fetchaddress,deleteaddress } from "../controllers/address.controller.js";



const router = express.Router();

router.post("/",protect,createaddress);
router.get("/",protect,fetchaddress);
router.delete("/:id",protect,deleteaddress);

export default router;
