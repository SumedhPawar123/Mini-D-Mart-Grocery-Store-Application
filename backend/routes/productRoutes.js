// import express from "express";
// import {
//   getProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
// } from "../controllers/productController.js";
// import { protect, authorize } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.get("/", getProducts);
// router.get("/:id", getProductById);
// router.post("/", protect, authorize("admin", "staff"), createProduct);
// router.put("/:id", protect, authorize("admin", "staff"), updateProduct);
// router.delete("/:id", protect, authorize("admin", "staff"), deleteProduct);

// export default router;

import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post(
  "/",
  protect,
  authorize("admin", "staff"),
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  protect,
  authorize("admin", "staff"),
  upload.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "staff"),
  deleteProduct
);

export default router;