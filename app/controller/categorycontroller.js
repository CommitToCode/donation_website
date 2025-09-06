const Category = require("../models/categorymodel");
const slugify = require("slugify");


exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = slugify(name.toLowerCase());

    const exist = await Category.findOne({ slug });
    if (exist) {
      
      return res.redirect("/campaigns");
    }

    await Category.create({ name, slug, description });

  
    return res.redirect("/campaigns");
  } catch (err) {
  
    return res.redirect("/campaigns");
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


exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = slugify(name.toLowerCase());
    const categoryId = req.params.id;

    const exist = await Category.findOne({ slug, _id: { $ne: categoryId } });
    if (exist) {
      return res.redirect("/campaigns");
    }

    const updatedCat = await Category.findByIdAndUpdate(
      categoryId,
      { name, slug, description },
      { new: true }
    );
    if (!updatedCat) {
      return res.redirect("/campaigns");
    }

    return res.redirect("/campaigns");
  } catch (err) {
    return res.redirect("/campaigns");
  }
};


exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCat = await Category.findByIdAndDelete(categoryId);
    if (!deletedCat) {
      return res.redirect("/campaigns");
    }

    return res.redirect("/campaigns");
  } catch (err) {
    return res.redirect("/campaigns");
  }
};
