import Product from "../models/Product.js";

// @desc Get all products (supports search & category filter)
// @route GET /api/products?search=&category=
export const getProducts = async (req, res) => {
  const { search, category } = req.query;
  const filter = {};

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }
  if (category) {
    filter.category = category;
  }

  const products = await Product.find(filter).populate("category", "name");
  res.json(products);
};

// @desc Get single product
// @route GET /api/products/:id
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category", "name");
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

// @desc Create product (admin/staff)
// @route POST /api/products
export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

// @desc Update product (admin/staff)
// @route PUT /api/products/:id
export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
};

// @desc Delete product (admin/staff)
// @route DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  await product.deleteOne();
  res.json({ message: "Product removed" });
};
