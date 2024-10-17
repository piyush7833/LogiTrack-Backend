// server.js
import { Server } from 'socket.io';
import './app.js'; // Import to ensure initialization
import socketHandlers from './socket/socketHandler.js';
import dotenv from "dotenv";
import http from "http";
<<<<<<< HEAD
import mongoose from 'mongoose';
=======
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
dotenv.config();
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins, you can specify specific origins if needed
    methods: ["GET", "POST"]
  }
});

<<<<<<< HEAD
const connect = () => {
  mongoose.set("strictQuery", false);
  mongoose
      .connect(process.env.MONGO)
      .then(() => {
          console.log("Connected to DB");
      })
      .catch((err) => {
          throw err;
      });
};
connect()

=======
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
socketHandlers(io);

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
