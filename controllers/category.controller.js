import categorise from "../models/categories.js";

export const createCategory = async (req, res) => {
  console.log(req.body);
  
  try {
    const { categories, subcategories } = req.body;
    await categorise.create({ categories, subcategories });
    res.json({ message: "Category added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {


    const data = await categorise.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {


    const { id } = req.body;


    const data = await categorise.deleteOne({ _id: id });


    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
