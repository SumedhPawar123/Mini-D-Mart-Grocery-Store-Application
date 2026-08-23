import Notification from "../models/Notification.js";

// =====================================================
// GET MY NOTIFICATIONS
// GET /api/notifications
// =====================================================
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    })
      .populate("order", "totalAmount status createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);

    res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
};

// =====================================================
// GET UNREAD NOTIFICATIONS
// GET /api/notifications/unread
// =====================================================
export const getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
      isRead: false,
    })
      .populate("order", "totalAmount status createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Get unread notifications error:", error);

    res.status(500).json({
      message: "Failed to fetch unread notifications",
    });
  }
};

// =====================================================
// GET UNREAD NOTIFICATION COUNT
// GET /api/notifications/unread/count
// =====================================================
export const getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      count,
    });
  } catch (error) {
    console.error("Get notification count error:", error);

    res.status(500).json({
      message: "Failed to get notification count",
    });
  }
};

// =====================================================
// MARK SINGLE NOTIFICATION AS READ
// PUT /api/notifications/:id/read
// =====================================================
export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    console.error("Mark notification as read error:", error);

    res.status(500).json({
      message: "Failed to mark notification as read",
    });
  }
};

// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// PUT /api/notifications/read-all
// =====================================================
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user._id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);

    res.status(500).json({
      message: "Failed to mark all notifications as read",
    });
  }
};

// =====================================================
// DELETE SINGLE NOTIFICATION
// DELETE /api/notifications/:id
// =====================================================
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Delete notification error:", error);

    res.status(500).json({
      message: "Failed to delete notification",
    });
  }
};

// =====================================================
// DELETE ALL NOTIFICATIONS
// DELETE /api/notifications
// =====================================================
export const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      recipient: req.user._id,
    });

    res.status(200).json({
      message: "All notifications deleted successfully",
    });
  } catch (error) {
    console.error("Delete all notifications error:", error);

    res.status(500).json({
      message: "Failed to delete all notifications",
    });
  }
};