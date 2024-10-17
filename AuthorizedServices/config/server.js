import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import chalk from "chalk";
import bookingRoutes from "../routes/booking.js";
import authRoutes from "../routes/auth.js";
import locationRoutes from "../routes/location.js";
import vehicleRoutes from "../routes/vehicle.js";
import driverRoutes from "../routes/driver.js";
import priceRoutes from "../routes/price.js";

const allowedOrigins = ["http://localhost:3000"];

const getColorStatus = (status) => {
  if (status >= 500) return chalk.red(status);
  if (status >= 400) return chalk.yellow(status);
  if (status >= 300) return chalk.cyan(status);
  if (status >= 200) return chalk.green(status);
  return status;
};

morgan.token("status", (req, res) => getColorStatus(res.statusCode));

const createServer = () => {
  const app = express();
  
  // Middlewares
  app.use(morgan(":method :url :status :response-time ms - :res[content-length]"));
  app.use(cors({ origin: allowedOrigins, credentials: true }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/location", locationRoutes);
  app.use("/api/vehicle", vehicleRoutes);
  app.use("/api/driver", driverRoutes);
  app.use("/api/price", priceRoutes);
  app.use("/api/bookings", bookingRoutes);

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ success: false, message: err.message || "Something went wrong" });
  });

  return app;
};

export default createServer;
