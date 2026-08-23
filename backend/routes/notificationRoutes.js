import express from "express";

import {
  getMyNotifications,
  getUnreadNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================================
// GET ALL MY NOTIFICATIONS
// GET /api/notifications
// =====================================================
router.get("/", protect, getMyNotifications);

// =====================================================
// GET UNREAD NOTIFICATIONS
// GET /api/notifications/unread
// =====================================================
router.get(
  "/unread",
  protect,
  getUnreadNotifications
);

// =====================================================
// GET UNREAD NOTIFICATION COUNT
// GET /api/notifications/unread/count
// =====================================================
router.get(
  "/unread/count",
  protect,
  getUnreadNotificationCount
);

// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// PUT /api/notifications/read-all
// =====================================================
router.put(
  "/read-all",
  protect,
  markAllNotificationsAsRead
);

// =====================================================
// MARK SINGLE NOTIFICATION AS READ
// PUT /api/notifications/:id/read
// =====================================================
router.put(
  "/:id/read",
  protect,
  markNotificationAsRead
);

// =====================================================
// DELETE ALL NOTIFICATIONS
// DELETE /api/notifications
// =====================================================
router.delete(
  "/",
  protect,
  deleteAllNotifications
);

// =====================================================
// DELETE SINGLE NOTIFICATION
// DELETE /api/notifications/:id
// =====================================================
router.delete(
  "/:id",
  protect,
  deleteNotification
);

export default router;