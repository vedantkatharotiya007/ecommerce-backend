import mongoose from "mongoose";
import User from "../models/user.js";

const connectDB = async () => {
  try {

    console.log("url is", process.env.MONGO_URI);
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
 await User.syncIndexes();
  } catch (error) {
    console.error("❌ MongoDB connection failed", error.message);
    process.exit(1);
  }
};

export default connectDB;
