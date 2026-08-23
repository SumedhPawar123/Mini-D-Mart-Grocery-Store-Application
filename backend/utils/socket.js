let io;

export const initializeSocket = (socketIO) => {
  io = socketIO;

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // User joins their own room
    socket.on("join", (userId) => {
      if (!userId) return;

      socket.join(`user_${userId}`);

      console.log(
        `User ${userId} joined room user_${userId}`
      );
    });

    // Staff room
    socket.on("join_staff", () => {
      socket.join("staff");

      console.log(
        `Socket ${socket.id} joined staff room`
      );
    });

    // Admin room
    socket.on("join_admin", () => {
      socket.join("admin");

      console.log(
        `Socket ${socket.id} joined admin room`
      );
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};