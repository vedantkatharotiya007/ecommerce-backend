import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  username: {
    type: String,
    required: true,
    lowercase: true,
   
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/]
  },

  password: {
    type: String,
    required: function () {
      return this.authProvider === "local";
    }
  },

  mobile: {
    type: String,
    required: function () {
      return this.authProvider === "local";
    },
   
    sparse: true
  },


  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true
  },

  avatar: String,

  role: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer"
  },

  otp: String,
  otpexpire: Date,
 wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  fcmTokens: {
  type: [String],
  default: [],
}
});

const User = mongoose.model("User", userSchema);
export default User;
