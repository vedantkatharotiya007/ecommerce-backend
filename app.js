import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import authRoutes from "./routes/auth.routes.js";
import Cart from "./routes/cart.routes.js";
import Address from "./routes/address.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import savefcmtoken from "./routes/fcmtoken.routes.js";
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3002",
      "https://unrecondite-oversadly-collins.ngrok-free.dev",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
    ],
  })
);
app.use(cookieParser());
app.use((req, res, next) => {
  if (req.originalUrl === "/api/payment/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use(passport.initialize());
app.use("/uploads", express.static("uploads"))
app.use("/user", userRoutes);
app.use("/orders", orderRoutes);
app.use("/product", productRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/save-fcm-token",savefcmtoken);
app.use("/categories", categoryRoutes);
app.use("/auth", authRoutes);
app.use("/cart", Cart)
app.use("/address", Address)
export default app;