import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

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
    const {
      name,
      description,
      price,
      category,
      stock,
      unit,
    } = req.body;

    let image = "";
    let imagePublicId = "";

    // Upload image to Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);

      image = result.secure_url;
      imagePublicId = result.public_id;
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      unit,
      image,
      imagePublicId,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);

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
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // If a new image is uploaded
    if (req.file) {
      // Upload new image first
      const result = await uploadToCloudinary(req.file.buffer);

      const newImage = result.secure_url;
      const newPublicId = result.public_id;

      // Delete old Cloudinary image
      if (product.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(
            product.imagePublicId
          );
        } catch (deleteError) {
          console.error(
            "Failed to delete old Cloudinary image:",
            deleteError.message
          );
        }
      }

      product.image = newImage;
      product.imagePublicId = newPublicId;
    }

    // Update other fields
    product.name = req.body.name ?? product.name;

    product.description =
      req.body.description ?? product.description;

    product.price =
      req.body.price ?? product.price;

    product.category =
      req.body.category ?? product.category;

    product.stock =
      req.body.stock ?? product.stock;

    product.unit =
      req.body.unit ?? product.unit;

    const updated = await product.save();

    res.json(updated);
  } catch (error) {
    console.error("Update product error:", error);

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

    // Delete image from Cloudinary
    if (product.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(
          product.imagePublicId
        );
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary delete error:",
          cloudinaryError.message
        );
      }
    }

    await product.deleteOne();

    res.json({
      message: "Product removed",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};