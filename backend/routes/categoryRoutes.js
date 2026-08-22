import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, authorize("admin", "staff"), createCategory);
router.put("/:id", protect, authorize("admin", "staff"), updateCategory);
router.delete("/:id", protect, authorize("admin", "staff"), deleteCategory);

export default router;
