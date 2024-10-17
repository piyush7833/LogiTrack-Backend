import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server as SocketIoServer } from "socket.io";
import http from "http";
import Razorpay from "razorpay";

// routes
import authRoutes from "./routes/auth.js";
import vehicleRoutes from "./routes/vehicle.js";
import driverRoutes from "./routes/driver.js";
import bookingRoutes from "./routes/booking.js";
import adminroutes from "./routes/admin.js";
import paymentRoutes from "./routes/payment.js";
import socketHandlers from "./sockets/socketHandler.js";
import { redisClient } from "./config/redis.js";

const app = express();
const server = http.createServer(app);
export const io = new SocketIoServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
dotenv.config();

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

const allowedOrigins = ["http://localhost:3000","http://localhost:5000"];

const getColorStatus = (status) => {
    if (status >= 500) return chalk.red(status);
    if (status >= 400) return chalk.yellow(status);
    if (status >= 300) return chalk.cyan(status);
    if (status >= 200) return chalk.green(status);
    return status;
};

morgan.token("status", (req, res) => {
    const status = res.statusCode;
    return getColorStatus(status);
});

app.use(morgan(":method :url :status :response-time ms - :res[content-length]"));
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

app.use("/api/auth", authRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/driver", driverRoutes); 
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.get("/api/getkey", (req, res) =>
    res.status(200).json({ key: process.env.RZP_KEY_ID })
);
app.use("/api/admin",adminroutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    res.status(status).json({ success: false, message });
});

redisClient.on('connect', () => {
    console.log('Connected to Redis successfully');
  });
  
  redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

// Socket.IO configuration
socketHandlers(io);

// Start server
server.listen(8800, () => {
    connect();
    console.log("Connected to Server");
});
