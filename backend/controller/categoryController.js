const Category = require("../model/CategoryModel");
const Product = require("../model/ProductModel");

const DEFAULT_CATEGORIES = [
  { name: "Men", slug: "men" },
  { name: "Women", slug: "women" },
  { name: "Kids", slug: "kids" },
  { name: "Home & Living", slug: "home-living" },
  { name: "Beauty", slug: "beauty" }
];

const ensureDefaults = async () => {
  const count = await Category.countDocuments();
  if (count === 0) await Category.insertMany(DEFAULT_CATEGORIES);
};

const getCategories = async (req, res) => {
  try {
    await ensureDefaults();
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const slug = String(req.body.slug || name)
      .trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const image = String(req.body.image || "").trim();

    if (!name) return res.status(400).json({ success: false, message: "Category name is required" });
    if (!slug) return res.status(400).json({ success: false, message: "Valid category slug is required" });

    const category = await Category.create({ name, slug, image });
    res.status(201).json({ success: true, message: "Category created", category });
  } catch (error) {
    const duplicate = error.code === 11000;
    res.status(duplicate ? 409 : 400).json({
      success: false,
      message: duplicate ? "Category already exists" : error.message
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    const used = await Product.exists({ category: category.slug });
    if (used) return res.status(400).json({ success: false, message: "This category is used by products. Change/delete those products first." });

    await category.deleteOne();
    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getCategories, createCategory, deleteCategory, ensureDefaults };
