import { Bell } from "lucide-react";
import { useNotifications } from "../context/NotificationContext.jsx";

const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
  } = useNotifications();

  return (
    <div className="dropdown">
      <button
        className="btn position-relative"
        data-bs-toggle="dropdown"
      >
        <Bell size={22} />

        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <div
        className="dropdown-menu dropdown-menu-end p-0"
        style={{
          width: "360px",
          maxHeight: "500px",
          overflowY: "auto",
        }}
      >
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h6 className="mb-0">
            Notifications
          </h6>

          <span className="text-muted small">
            {unreadCount} unread
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center p-4 text-muted">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-3 border-bottom ${
                !notification.isRead
                  ? "bg-light"
                  : ""
              }`}
              onClick={() =>
                !notification.isRead &&
                markAsRead(notification._id)
              }
              style={{
                cursor: "pointer",
              }}
            >
              <div className="d-flex justify-content-between">
                <strong>
                  {notification.title}
                </strong>

                {!notification.isRead && (
                  <span className="badge bg-primary">
                    New
                  </span>
                )}
              </div>

              <p className="mb-1 small">
                {notification.message}
              </p>

              <small className="text-muted">
                {new Date(
                  notification.createdAt
                ).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationBell;