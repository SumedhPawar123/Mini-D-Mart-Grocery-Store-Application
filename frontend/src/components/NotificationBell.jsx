import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  X,
} from "lucide-react";

import { useNotifications } from "../context/NotificationContext.jsx";

const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  // =====================================================
  // CLOSE WHEN CLICKING OUTSIDE
  // =====================================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =====================================================
  // FORMAT DATE
  // =====================================================
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // CLICK NOTIFICATION
  // =====================================================
  const handleNotificationClick = (
    notification
  ) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      {/* =================================================
          BELL BUTTON
      ================================================= */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell
          size={21}
          strokeWidth={2}
        />

        {/* UNREAD BADGE */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black rounded-full min-w-[19px] h-[19px] px-1 flex items-center justify-center shadow-md">
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {/* =================================================
          NOTIFICATION DROPDOWN
      ================================================= */}
      {open && (
        <div className="absolute right-0 mt-3 w-[360px] max-w-[calc(100vw-2rem)] bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100]">
          
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-sm text-gray-900">
                Notifications
              </h3>

              <p className="text-[11px] text-gray-400 mt-0.5">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "You're all caught up"}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-[11px] font-semibold text-brand hover:opacity-70 px-2 py-1 rounded-lg"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}
          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 px-5 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bell
                    size={22}
                    className="text-gray-400"
                  />
                </div>

                <p className="text-sm font-semibold text-gray-600">
                  No notifications
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  You're all caught up!
                </p>
              </div>
            ) : (
              notifications.map(
                (notification) => (
                  <div
                    key={notification._id}
                    onClick={() =>
                      handleNotificationClick(
                        notification
                      )
                    }
                    className={`relative px-4 py-3 border-b border-gray-100 cursor-pointer transition ${
                      !notification.isRead
                        ? "bg-blue-50/70 hover:bg-blue-50"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {/* UNREAD INDICATOR */}
                    {!notification.isRead && (
                      <span className="absolute left-1.5 top-4 w-2 h-2 rounded-full bg-blue-500" />
                    )}

                    <div className="flex gap-3">
                      {/* ICON */}
                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                          !notification.isRead
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Bell size={17} />
                      </div>

                      {/* CONTENT */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-gray-900">
                            {notification.title}
                          </h4>

                          {!notification.isRead && (
                            <span className="flex-shrink-0 text-[9px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                              NEW
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-gray-400">
                            {formatDate(
                              notification.createdAt
                            )}
                          </span>

                          {!notification.isRead && (
                            <span className="flex items-center gap-1 text-[10px] text-blue-500 font-semibold">
                              <Check size={12} />
                              Click to read
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;