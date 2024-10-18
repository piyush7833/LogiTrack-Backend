import { delAsync } from "../config/redis.js";
import { getNearByDrivers } from "../controllers/driver.js";
import { io } from "../index.js";
import Booking from "../models/Booking.js";
import Driver from "../models/Driver.js";
import User from "../models/User.js";

let activeBookings = {};

// Route for creating a booking
export const createBooking = async (req, res) => {
    try {
        const { src, destn, vehicleType, price, srcName, destnName, distance, duration } = req.body;
        const booking = new Booking({
            src: { type: "Point", coordinates: [src.lng, src.lat] },
            destn: { type: "Point", coordinates: [destn.lng, destn.lat] },
            distance, price, status: "pending",
            srcName, destnName, userId: req.user.id,
            duration
        });
        await booking.save();
        await User.findByIdAndUpdate(req.user.id, { isBooking: true });
        const notification = { srcName, destnName, distance, price };
        const drivers = await getNearByDrivers(src, vehicleType);

        if (drivers.length === 0) {
            res.status(404).json({ message: "No nearby drivers found" });
            return;
        }

        const bookingId = booking._id.toString();
        activeBookings[bookingId] = { booking, notifiedDrivers: [], driverAssigned: false };
        drivers.forEach((driver) => {
            const driverId = driver._id.toString();
            io.to(driverId).emit("newBooking", { booking, notification });
            activeBookings[bookingId].notifiedDrivers.push(driverId);
        });

        let elapsed = 0;
        const interval = setInterval(async () => {
            if (elapsed >= 60000 || !activeBookings[bookingId] || activeBookings[bookingId].driverAssigned) {
                clearInterval(interval);
                if (!activeBookings[bookingId].driverAssigned) {
                    io.emit("bookingNotAccepted", { booking: activeBookings[bookingId].booking });
                    await Booking.findByIdAndDelete(bookingId);
                }
                delete activeBookings[bookingId];
            } else {
                activeBookings[bookingId].notifiedDrivers.forEach((driverId) => {
                    io.to(driverId).emit("newBooking", { booking, notification });
                });
                elapsed += 5000;
            }
        }, 5000);

        res.status(201).json({ booking, drivers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create booking" });
    }
};

function socketHandlers(io) {
    io.on("connection", (socket) => {
        console.log(`Driver connected: ${socket.id}`);
        // Event to register a driver and join a room
        socket.on("registerDriver", (userId) => {
            if (userId) {
                socket.join(userId);
                console.log(`Driver registered: ${userId} and joined room: ${userId}`);
            } else {
                console.log("Driver registration failed: Invalid userId");
            }
        });
        // Event for accepting a booking
        socket.on("acceptBooking", async ({ bookingId, driverId }) => {
            const bookingData = activeBookings[bookingId];
            if (!bookingData || bookingData.driverAssigned) return;

            const booking = await Booking.findByIdAndUpdate(
                bookingId,
                { driverId, status: "accepted", startTime: Date.now() },
                { new: true }
            );
            await User.findByIdAndUpdate(booking.userId, { isBooking: false });
            const driver = await Driver.findByIdAndUpdate(booking.driverId, { isAvailable: false }).populate("userId", "name");
            const driverAdminCacheKey = `admin-drivers:${driver.adminId}`;
            delAsync(driverAdminCacheKey);
            await Booking.findByIdAndUpdate(bookingId, { vehicleId: driver.vehicleId })
                .populate("vehicleId", "model type")
                .populate("userId", "name");

            io.emit("bookingAccepted", { booking, driverName: driver.userId.name, driverId });
            activeBookings[bookingId].driverAssigned = true;

            socket.to(bookingData.notifiedDrivers).emit("bookingCancelled", { bookingId });
        });

        // Event for rejecting a booking
        socket.on("rejectBooking", ({ bookingId, driverId }) => {
            const bookingData = activeBookings[bookingId];
            if (!bookingData) return;
            const index = bookingData.notifiedDrivers.indexOf(driverId);
            if (index !== -1) {
                bookingData.notifiedDrivers.splice(index, 1);
            }
        });
        // Handle driver disconnection
        socket.on("disconnect", () => {
            console.log(`Driver disconnected: ${socket.id}`);
        });
    });
}

export default socketHandlers;
