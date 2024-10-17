import { Server as SocketIoServer } from "socket.io";
import { handleSocketEvents } from "../controllers/driver.js";

const createSocketServer = (server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Driver connected: ${socket.id}`);
    handleSocketEvents(io, socket);
  });

  return io;
};

export default createSocketServer;
