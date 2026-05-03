import express from "express";
import { adminOnly } from "../middleware/auth.js";

import { protect } from "../middleware/auth.js";
import {
  createCategory,
  getCategories,
  deleteCategory
} from "../controllers/category.controller.js";

const router = express.Router();

router.post("/", protect, adminOnly,  createCategory);
router.get("/", protect, getCategories);
router.delete("/",protect , adminOnly,  deleteCategory);

export default router;
