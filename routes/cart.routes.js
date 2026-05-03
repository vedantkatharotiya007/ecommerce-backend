import express from "express";
import { protect } from "../middleware/auth.js";
import { createcart,fetchcart,updatecart,deletecart} from "../controllers/cart.controller.js";


const router = express.Router();

router.post("/",protect,createcart);
router.get("/",protect,fetchcart);
router.put("/",protect,updatecart);
router.delete("/",protect,deletecart);


export default router;
