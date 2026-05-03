import product from "../models/product.js";
import categorise from "../models/categories.js";
import User from "../models/user.js";
import admin from "../config/firebaseAdmin.js";


export const createProduct = async (req, res) => {
  try {
    const imageFiles = req.files.images;


    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({ message: "Image required" });
    }

    const imagePaths = imageFiles.map(file => file.filename);


    const exists = await categorise.findOne({
      categories: req.body.categories,
      subcategories: req.body.subcategories,
    });

    if (!exists) {
      return res.status(400).json({ message: "Invalid category or subcategory" });
    }

    const data = await product.create({
      ...req.body,
      productimage: imagePaths,
    });
if (data) {
  const users = await User.find({
    fcmTokens: { $exists: true, $ne: [] },
  });

  const tokens = users.flatMap((u) => u.fcmTokens || []);

  console.log("TOKENS:", tokens);

  if (tokens.length > 0) {
    console.log("📢 Sending push...");

    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title: "🆕 New Product Added!",
        body: "A new product is now available",
      },
    });

    console.log("✅ Push result:", response);
  }

  console.log("✔ Done push block");
}
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  console.log(err.message);
  }
};


export const getProducts = async (req, res) => {
  try {
    const data = await product.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getProductDetails =
  async (req, res) => {
    try {
      const data = await product.findById(req.params.id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }

  };


export const deleteProduct = async (req, res) => {
  try {
    await product.deleteOne({ _id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
