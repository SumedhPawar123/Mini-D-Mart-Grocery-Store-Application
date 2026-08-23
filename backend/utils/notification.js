import Notification from "../models/Notification.js";
import { getIO } from "./socket.js";

export const sendNotification = async ({
  recipient,
  title,
  message,
  type = "order_created",
  order = null,
}) => {
  const notification = await Notification.create({
    recipient,
    title,
    message,
    type,
    order,
  });

  const io = getIO();

  // Send to specific user
  io.to(`user_${recipient}`).emit(
    "new_notification",
    notification
  );

  return notification;
};