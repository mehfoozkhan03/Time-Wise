import { Server } from "socket.io";

let io;

// userId -> socketId
const onlineUsers = new Map();

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:9000",
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    // User joins after login
    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

export const getIO = () => io;

export const getUserSocket = (userId) => {
  return onlineUsers.get(userId.toString());
};