import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { adminOnly,protect } from "../middleware/auth.js";
import {
  createProduct,
  getProducts,
  deleteProduct,
  getProductDetails
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/",protect,adminOnly,upload.fields([{ name: "images", maxCount: 4 }]),createProduct);
router.get("/:id", protect,getProductDetails);
router.get("/",protect,getProducts);
router.delete("/:id",protect,adminOnly ,  deleteProduct);

export default router;
