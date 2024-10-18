// server.js
import { Server } from "socket.io";
import "./app.js"; // Import to ensure initialization
import socketHandlers from "./socket/socketHandler.js";
import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";
dotenv.config();
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins, you can specify specific origins if needed
    methods: ["GET", "POST"],
  },
});

const connect = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000, // Increase timeout to 20 seconds
      socketTimeoutMS: 45000, //
    })
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      throw err;
    });
};
connect();

socketHandlers(io);

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
