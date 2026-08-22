import Category from "../models/Category.js";

// @desc Get all categories
// @route GET /api/categories
export const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

// @desc Create category (admin/staff)
// @route POST /api/categories
export const createCategory = async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.create({ name, description });
  res.status(201).json(category);
};

// @desc Update category
// @route PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found" });

  category.name = req.body.name ?? category.name;
  category.description = req.body.description ?? category.description;

  const updated = await category.save();
  res.json(updated);
};

// @desc Delete category
// @route DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found" });

  await category.deleteOne();
  res.json({ message: "Category removed" });
};
