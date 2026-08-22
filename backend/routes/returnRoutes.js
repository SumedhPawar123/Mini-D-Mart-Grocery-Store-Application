import express from "express";
import {
  createReturn,
  getMyReturns,
  getAllReturns,
  updateReturnStatus,
} from "../controllers/returnController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("customer"), createReturn);
router.get("/my", protect, authorize("customer"), getMyReturns);
router.get("/", protect, authorize("admin", "staff"), getAllReturns);
router.put("/:id/status", protect, authorize("admin", "staff"), updateReturnStatus);

export default router;
