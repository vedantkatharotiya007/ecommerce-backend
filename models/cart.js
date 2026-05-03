import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true 
  },
  items: {
    type: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      }
    }],
    default: []   
  }
});


const cart= mongoose.model("Cart", cartSchema,"Cart");
export default cart;
