// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// import { io } from "socket.io-client";
// import { useAuth } from "./AuthContext.jsx";
// import api from "../api/axios.js";

// const NotificationContext = createContext();

// const SOCKET_URL =
//   import.meta.env.VITE_SOCKET_URL ;

// export const NotificationProvider = ({ children }) => {
//   const { user } = useAuth();

//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(false);

//   // =====================================================
//   // FETCH ALL NOTIFICATIONS
//   // =====================================================
//   const fetchNotifications = async () => {
//     if (!user?._id) return;

//     try {
//       setLoading(true);

//       const { data } = await api.get("/notifications");

//       setNotifications(data);

//       const unread = data.filter(
//         (notification) => !notification.isRead
//       ).length;

//       setUnreadCount(unread);
//     } catch (error) {
//       console.error(
//         "Failed to fetch notifications:",
//         error
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // FETCH UNREAD COUNT
//   // =====================================================
//   const fetchUnreadCount = async () => {
//     if (!user?._id) return;

//     try {
//       const { data } = await api.get(
//         "/notifications/unread/count"
//       );

//       setUnreadCount(data.count);
//     } catch (error) {
//       console.error(
//         "Failed to fetch unread count:",
//         error
//       );
//     }
//   };

//   // =====================================================
//   // MARK SINGLE NOTIFICATION AS READ
//   // =====================================================
//   const markAsRead = async (notificationId) => {
//     try {
//       const { data } = await api.put(
//         `/notifications/${notificationId}/read`
//       );

//       setNotifications((prev) =>
//         prev.map((notification) =>
//           notification._id === notificationId
//             ? data
//             : notification
//         )
//       );

//       setUnreadCount((prev) =>
//         prev > 0 ? prev - 1 : 0
//       );
//     } catch (error) {
//       console.error(
//         "Failed to mark notification as read:",
//         error
//       );
//     }
//   };

//   // =====================================================
//   // MARK ALL AS READ
//   // =====================================================
//   const markAllAsRead = async () => {
//     try {
//       await api.put("/notifications/read-all");

//       setNotifications((prev) =>
//         prev.map((notification) => ({
//           ...notification,
//           isRead: true,
//         }))
//       );

//       setUnreadCount(0);
//     } catch (error) {
//       console.error(
//         "Failed to mark all notifications as read:",
//         error
//       );
//     }
//   };

//   // =====================================================
//   // DELETE SINGLE NOTIFICATION
//   // =====================================================
//   const deleteNotification = async (notificationId) => {
//     try {
//       await api.delete(
//         `/notifications/${notificationId}`
//       );

//       setNotifications((prev) => {
//         const notification = prev.find(
//           (item) => item._id === notificationId
//         );

//         if (notification && !notification.isRead) {
//           setUnreadCount((count) =>
//             count > 0 ? count - 1 : 0
//           );
//         }

//         return prev.filter(
//           (item) => item._id !== notificationId
//         );
//       });
//     } catch (error) {
//       console.error(
//         "Failed to delete notification:",
//         error
//       );
//     }
//   };

//   // =====================================================
//   // DELETE ALL
//   // =====================================================
//   const deleteAllNotifications = async () => {
//     try {
//       await api.delete("/notifications");

//       setNotifications([]);
//       setUnreadCount(0);
//     } catch (error) {
//       console.error(
//         "Failed to delete all notifications:",
//         error
//       );
//     }
//   };

//   // =====================================================
//   // INITIAL FETCH
//   // =====================================================
//   useEffect(() => {
//     if (!user?._id) {
//       setNotifications([]);
//       setUnreadCount(0);
//       return;
//     }

//     fetchNotifications();
//   }, [user?._id]);

//   // =====================================================
//   // REAL-TIME SOCKET.IO
//   // =====================================================
//   useEffect(() => {
//     if (!user?._id) return;

//     const socket = io(SOCKET_URL, {
//       withCredentials: true,
//     });

//     console.log(
//       "Connecting socket for user:",
//       user._id
//     );

//     socket.on("connect", () => {
//       console.log(
//         "Socket connected:",
//         socket.id
//       );

//       // IMPORTANT:
//       // Backend expects userId directly
//       socket.emit("join", user._id);

//       // Join staff/admin rooms if applicable
//       if (user.role === "staff") {
//         socket.emit("join_staff");
//       }

//       if (user.role === "admin") {
//         socket.emit("join_admin");
//       }
//     });

//     // ===================================================
//     // CUSTOMER NOTIFICATION
//     // ===================================================
//     socket.on(
//       "new_notification",
//       (notification) => {
//         console.log(
//           "🔔 New notification:",
//           notification
//         );

//         setNotifications((prev) => {
//           // Prevent duplicate notification
//           const exists = prev.some(
//             (item) =>
//               item._id === notification._id
//           );

//           if (exists) {
//             return prev;
//           }

//           return [
//             notification,
//             ...prev,
//           ];
//         });

//         setUnreadCount((prev) => prev + 1);
//       }
//     );

//     // ===================================================
//     // STAFF / ADMIN NEW ORDER
//     // ===================================================
//     socket.on("new_order", (notification) => {
//       console.log(
//         "🔔 New order notification:",
//         notification
//       );

//       // Convert staff/admin order notification
//       // into the same notification format.
//       setNotifications((prev) => [
//         {
//           _id: `socket-${Date.now()}`,
//           title: notification.title,
//           message: notification.message,
//           type: "new_order",
//           isRead: false,
//           createdAt: new Date().toISOString(),
//           order: notification.orderId,
//         },
//         ...prev,
//       ]);

//       setUnreadCount((prev) => prev + 1);
//     });

//     return () => {
//       console.log(
//         "Disconnecting socket..."
//       );

//       socket.disconnect();
//     };
//   }, [user?._id, user?.role]);

//   return (
//     <NotificationContext.Provider
//       value={{
//         notifications,
//         unreadCount,
//         loading,

//         fetchNotifications,
//         fetchUnreadCount,

//         markAsRead,
//         markAllAsRead,

//         deleteNotification,
//         deleteAllNotifications,
//       }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = () =>
//   useContext(NotificationContext);

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { io } from "socket.io-client";
import { useAuth } from "./AuthContext.jsx";
import api from "../api/axios.js";

const NotificationContext = createContext(null);

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "http://localhost:5000";


console.log("SOCKET URL:", SOCKET_URL);
export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const socketRef = useRef(null);

  // =====================================================
  // FETCH ALL NOTIFICATIONS
  // =====================================================

  const fetchNotifications = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);

      const { data } = await api.get("/notifications");

      const notificationList = Array.isArray(data)
        ? data
        : [];

      setNotifications(notificationList);

      const unread = notificationList.filter(
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

      setUnreadCount(data?.count || 0);
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
    if (!notificationId) return;

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
  // MARK ALL AS READ
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
    if (!notificationId) return;

    try {
      const notification = notifications.find(
        (item) => item._id === notificationId
      );

      await api.delete(
        `/notifications/${notificationId}`
      );

      setNotifications((prev) =>
        prev.filter(
          (item) => item._id !== notificationId
        )
      );

      if (notification && !notification.isRead) {
        setUnreadCount((prev) =>
          prev > 0 ? prev - 1 : 0
        );
      }
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
    if (!user?._id) {
      return;
    }

    // Prevent duplicate socket connection
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    console.log(
      "Connecting Socket.IO:",
      SOCKET_URL
    );

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    // ===================================================
    // CONNECT
    // ===================================================

    socket.on("connect", () => {
      console.log(
        "✅ Socket connected:",
        socket.id
      );

      // Backend expects userId
      socket.emit("join", user._id);

      console.log(
        "Joined user room:",
        `user_${user._id}`
      );

      // Staff
      if (
        user.role === "staff" ||
        user.role === "employee"
      ) {
        socket.emit("join_staff");

        console.log(
          "Joined staff room"
        );
      }

      // Admin
      if (
        user.role === "admin" ||
        user.role === "superAdmin"
      ) {
        socket.emit("join_admin");

        console.log(
          "Joined admin room"
        );
      }
    });

    // ===================================================
    // CONNECT ERROR
    // ===================================================

    socket.on("connect_error", (error) => {
      console.error(
        "❌ Socket connection error:",
        error.message
      );
    });

    // ===================================================
    // DISCONNECT
    // ===================================================

    socket.on("disconnect", (reason) => {
      console.log(
        "⚠️ Socket disconnected:",
        reason
      );
    });

    // ===================================================
    // CUSTOMER NOTIFICATION
    // ===================================================

    socket.on(
      "new_notification",
      (notification) => {
        console.log(
          "🔔 New notification:",
          notification
        );

        if (!notification?._id) {
          return;
        }

        setNotifications((prev) => {
          const exists = prev.some(
            (item) =>
              item._id === notification._id
          );

          if (exists) {
            return prev;
          }

          return [
            notification,
            ...prev,
          ];
        });

        // Only increase count if notification is unread
        if (!notification.isRead) {
          setUnreadCount((prev) => prev + 1);
        }
      }
    );

    // ===================================================
    // STAFF / ADMIN NEW ORDER
    // ===================================================

    socket.on(
      "new_order",
      (notification) => {
        console.log(
          "🔔 New order:",
          notification
        );

        if (!notification) {
          return;
        }

        const socketNotification = {
          _id: `socket-${Date.now()}-${Math.random()}`,
          title:
            notification.title ||
            "New Order",
          message:
            notification.message ||
            "A new order has been placed.",
          type: "new_order",
          isRead: false,
          createdAt:
            new Date().toISOString(),
          order:
            notification.orderId ||
            notification.order ||
            null,
        };

        setNotifications((prev) => [
          socketNotification,
          ...prev,
        ]);

        setUnreadCount((prev) => prev + 1);
      }
    );

    // ===================================================
    // CLEANUP
    // ===================================================

    return () => {
      console.log(
        "🔌 Disconnecting Socket.IO..."
      );

      socket.removeAllListeners();
      socket.disconnect();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [user?._id, user?.role]);

  // =====================================================
  // CONTEXT
  // =====================================================

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

// =====================================================
// HOOK
// =====================================================

export const useNotifications = () => {
  const context = useContext(
    NotificationContext
  );

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
};