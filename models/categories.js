import mongoose from "mongoose";

const categories= new mongoose.Schema({
  categories: {
    type: String,
    required: true
  },
  subcategories:{
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  createdAt: {
    type: Date,
    default: Date.now} 
});

const categorise= mongoose.model("Categories", categories,"Categories");
export default categorise;