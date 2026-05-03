import express from "express";
import { adminOnly,protect } from "../middleware/auth.js";
import { getUsers, deleteUser,createUser,loginUser,Sentotp,Resetpassword,getwishlist,addwishlist,deletewishlist,getdashboard,getprofile,updateprofile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/",protect , adminOnly, getUsers);
router.delete("/", protect , adminOnly,deleteUser);
router.get("/wishlist",protect , getwishlist);
router.get("/dashboard",protect , getdashboard);
router.get("/profile",protect , getprofile);
router.post("/profile",protect , updateprofile);
router.post("/wishlist",protect , addwishlist);
router.delete("/wishlist",protect , deletewishlist);
router.post("/signup",createUser);
router.post("/login",loginUser);
router.post("/send-otp",Sentotp);
router.post("/reset-password",Resetpassword);

export default router;
