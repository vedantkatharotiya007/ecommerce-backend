import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  categories: {
    type: String,
    required: true,
  
  },
  subcategories: {
    type: String,
    required: true,
   
    lowercase: true
  },
  productName: {
    type: String,
    unique: true,
     required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
 productimage: {
  type: [String],   
  required: true
}
});

const product = mongoose.model("Product", productSchema,"Product");
export default product;
