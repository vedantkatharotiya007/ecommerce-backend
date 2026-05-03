import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  name: String,        
  price: Number,     
  quantity: Number,
  image: String      
});

const addressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: String
});

const orderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [orderItemSchema],

  shippingAddress: addressSchema,

  paymentInfo: {
    paymentId: String,          
    sessionId: String,         
    method: {
      type: String,
      default: "Stripe"
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Paid"
    }
  },

  pricing: {
    subtotal: Number,
    tax: Number,
    shipping: Number,
    total: Number
  },

  orderStatus: {
    type: String,
    enum: [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled"
    ],
    default: "Confirmed"
  },

  deliveredAt: Date,
  cancelledAt: Date

}, { timestamps: true });




const Order = mongoose.model("Orders", orderSchema,"Orders");
export default Order;
