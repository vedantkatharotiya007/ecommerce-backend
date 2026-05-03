import mongoose from "mongoose";
import User from "../models/user.js";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/testDB");
    console.log("✅ MongoDB connected");
 await User.syncIndexes();
  } catch (error) {
    console.error("❌ MongoDB connection failed", error.message);
    process.exit(1);
  }
};

export default connectDB;
