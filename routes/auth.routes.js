import express from "express";
import passport from "passport";
import { googleAuthSuccess } from "../controllers/auth.controller.js";


const router = express.Router();


router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);


router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.clienturl}/login`
  }),
  googleAuthSuccess
);

export default router;
