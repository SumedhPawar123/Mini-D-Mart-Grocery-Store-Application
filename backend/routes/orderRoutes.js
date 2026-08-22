import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("customer"), createOrder);
router.get("/my", protect, authorize("customer"), getMyOrders);
router.get("/", protect, authorize("admin", "staff"), getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, authorize("admin", "staff"), updateOrderStatus);
router.put("/:id/cancel", protect, authorize("customer"), cancelOrder);

export default router;
