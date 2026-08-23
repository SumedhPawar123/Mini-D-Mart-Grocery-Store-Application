import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { io } from "socket.io-client";
import { useAuth } from "./AuthContext.jsx";
import api from "../api/axios.js";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // FETCH ALL NOTIFICATIONS
  // =====================================================
  const fetchNotifications = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);

      const { data } = await api.get("/notifications");

      setNotifications(data);

      // Calculate unread count
      const unread = data.filter(
        (notification) => !notification.isRead
      ).length;

      setUnreadCount(unread);
    } catch (error) {
      console.error(
        "Failed to fetch notifications:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH UNREAD COUNT
  // =====================================================
  const fetchUnreadCount = async () => {
    if (!user?._id) return;

    try {
      const { data } = await api.get(
        "/notifications/unread/count"
      );

      setUnreadCount(data.count);
    } catch (error) {
      console.error(
        "Failed to fetch unread count:",
        error
      );
    }
  };

  // =====================================================
  // MARK SINGLE NOTIFICATION AS READ
  // =====================================================
  const markAsRead = async (notificationId) => {
    try {
      const { data } = await api.put(
        `/notifications/${notificationId}/read`
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? data
            : notification
        )
      );

      setUnreadCount((prev) =>
        prev > 0 ? prev - 1 : 0
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  };

  // =====================================================
  // MARK ALL NOTIFICATIONS AS READ
  // =====================================================
  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    }
  };

  // =====================================================
  // DELETE SINGLE NOTIFICATION
  // =====================================================
  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(
        `/notifications/${notificationId}`
      );

      setNotifications((prev) => {
        const notification = prev.find(
          (item) => item._id === notificationId
        );

        if (notification && !notification.isRead) {
          setUnreadCount((count) =>
            count > 0 ? count - 1 : 0
          );
        }

        return prev.filter(
          (item) => item._id !== notificationId
        );
      });
    } catch (error) {
      console.error(
        "Failed to delete notification:",
        error
      );
    }
  };

  // =====================================================
  // DELETE ALL NOTIFICATIONS
  // =====================================================
  const deleteAllNotifications = async () => {
    try {
      await api.delete("/notifications");

      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Failed to delete all notifications:",
        error
      );
    }
  };

  // =====================================================
  // INITIAL FETCH
  // =====================================================
  useEffect(() => {
    if (!user?._id) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();
  }, [user?._id]);

  // =====================================================
  // SOCKET.IO
  // =====================================================
  useEffect(() => {
    if (!user?._id) return;

    const socket = io("http://localhost:5000", {
      withCredentials: true,
    });

    socket.emit("join", {
      userId: user._id,
      role: user.role,
    });

    // -------------------------------------------------
    // CUSTOMER NOTIFICATION
    // -------------------------------------------------
    socket.on("new_notification", (notification) => {
      console.log(
        "New notification:",
        notification
      );

      setNotifications((prev) => [
        notification,
        ...prev,
      ]);

      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id, user?.role]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,

        fetchNotifications,
        fetchUnreadCount,

        markAsRead,
        markAllAsRead,

        deleteNotification,
        deleteAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () =>
  useContext(NotificationContext);