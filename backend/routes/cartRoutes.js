import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("customer"), getCart);
router.post("/", protect, authorize("customer"), addToCart);
router.delete("/:productId", protect, authorize("customer"), removeFromCart);
router.delete("/", protect, authorize("customer"), clearCart);

export default router;
