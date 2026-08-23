// import Product from "../models/Product.js";

// // @desc Get all products (supports search & category filter)
// // @route GET /api/products?search=&category=
// export const getProducts = async (req, res) => {
//   const { search, category } = req.query;
//   const filter = {};

//   if (search) {
//     filter.name = { $regex: search, $options: "i" };
//   }
//   if (category) {
//     filter.category = category;
//   }

//   const products = await Product.find(filter).populate("category", "name");
//   res.json(products);
// };

// // @desc Get single product
// // @route GET /api/products/:id
// export const getProductById = async (req, res) => {
//   const product = await Product.findById(req.params.id).populate("category", "name");
//   if (!product) return res.status(404).json({ message: "Product not found" });
//   res.json(product);
// };

// // @desc Create product (admin/staff)
// // @route POST /api/products
// export const createProduct = async (req, res) => {
//   const product = await Product.create(req.body);
//   res.status(201).json(product);
// };

// // @desc Update product (admin/staff)
// // @route PUT /api/products/:id
// export const updateProduct = async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   if (!product) return res.status(404).json({ message: "Product not found" });

//   Object.assign(product, req.body);
//   const updated = await product.save();
//   res.json(updated);
// };

// // @desc Delete product (admin/staff)
// // @route DELETE /api/products/:id
// export const deleteProduct = async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   if (!product) return res.status(404).json({ message: "Product not found" });

//   await product.deleteOne();
//   res.json({ message: "Product removed" });
// };

import Product from "../models/Product.js";
import fs from "fs";

// @desc Get all products
// @route GET /api/products?search=&category=
export const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    const filter = {};

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter).populate(
      "category",
      "name"
    );

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// @desc Get single product
// @route GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// @desc Create product
// @route POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, unit } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      unit,
      image: req.file ? `/uploads/products/${req.file.filename}` : "",
    });

    res.status(201).json(product);
  } catch (error) {
    // Delete uploaded image if product creation fails
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }

    res.status(500).json({
      message: error.message,
    });
  }
};


// @desc Update product
// @route PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }

      return res.status(404).json({
        message: "Product not found",
      });
    }

    // If new image uploaded, delete old image
    if (req.file) {
      if (product.image) {
        const oldImagePath = product.image.replace("/", "");

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      product.image = `/uploads/products/${req.file.filename}`;
    }

    // Update other fields
    product.name = req.body.name ?? product.name;
    product.description =
      req.body.description ?? product.description;
    product.price = req.body.price ?? product.price;
    product.category = req.body.category ?? product.category;
    product.stock = req.body.stock ?? product.stock;
    product.unit = req.body.unit ?? product.unit;

    const updated = await product.save();

    res.json(updated);
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }

    res.status(500).json({
      message: error.message,
    });
  }
};


// @desc Delete product
// @route DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Delete product image
    if (product.image) {
      const imagePath = product.image.replace("/", "");

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.deleteOne();

    res.json({
      message: "Product removed",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};