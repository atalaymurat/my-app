const { Server } = require("socket.io");
const { allowedOrigins } = require("./corsOptions");
const jwt = require("jsonwebtoken");
const logger = require("./logger");

let io;

const init = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.cookie
          ?.split(";")
          .find((c) => c.trim().startsWith("accessToken="))
          ?.split("=")[1];

      if (!token) return next(new Error("Unauthorized - no token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const role = decoded.orgRole;
      const isAdmin =
        decoded.roles?.includes("superadmin") ||
        role === "admin" ||
        role === "owner";

      if (!isAdmin) return next(new Error("Forbidden - not admin"));

      socket.user = decoded;
      next();
    } catch (err) {
      logger.error({ message: "Socket auth error", error: err.message });
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join("logs");
    socket.on("disconnect", () => {});
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
};

module.exports = { init, getIO };
