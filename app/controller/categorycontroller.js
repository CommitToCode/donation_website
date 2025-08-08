const Category = require("../models/categorymodel");
const slugify = require("slugify");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name.toLowerCase());

    const exist = await Category.findOne({ slug });
    if (exist) return res.status(400).json({ message: "Category already exists" });

    const newCat = await Category.create({ name, slug });
    res.status(201).json({ success: true, category: newCat });
  } catch (err) {
    res.status(500).json({ message: "Category creation failed", error: err.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories", error: err.message });
  }
};
