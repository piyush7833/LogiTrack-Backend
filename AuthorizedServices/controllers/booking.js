import Booking from "../models/Booking.js";
import Driver from "../models/Driver.js";
import { io } from "../index.js";
import { delAsync } from "../config/redis.js";

<<<<<<< HEAD
=======
// export const createBooking = async (req, res) => {
//   try {
//     const { src, destn, vehicleType, price, srcName, destnName, distance } = req.body;
//     const booking = new Booking({
//       src: { type: "Point", coordinates: [src.lng, src.lat] },
//       destn: { type: "Point", coordinates: [destn.lng, destn.lat] },
//       distance,
//       price,
//       srcName,
//       destnName,
//       status: "pending",
//     });
//     await booking.save();

//     const notification = { srcName, destnName, distance, price };
//     const drivers = await getNearByDrivers(src, vehicleType);

//     if (drivers.length === 0) {
//       res.status(404).json({ message: "No nearby drivers found" });
//       return;
//     }

//     const bookingId = booking._id.toString();
//     activeBookings[bookingId] = { booking, notifiedDrivers: [] };

//     // Notify drivers
//     notifyDrivers(drivers, booking, notification, bookingId);

//     res.status(201).json({ booking });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to create booking" });
//   }
// };

// const notifyDrivers = (drivers, booking, notification, bookingId) => {
//   drivers.forEach((driver) => {
//     const driverId = driver._id.toString();
//     io.to(driverId).emit("newBooking", { booking, notification });
//     activeBookings[bookingId].notifiedDrivers.push(driverId);
//   });

//   let elapsed = 0;
//   const interval = setInterval(() => {
//     if (elapsed >= 60000 || activeBookings[bookingId]?.driverAssigned) {
//       clearInterval(interval);
//       delete activeBookings[bookingId];
//     } else {
//       activeBookings[bookingId].notifiedDrivers.forEach((driverId) => {
//         io.to(driverId).emit("newBooking", { booking, notification });
//       });
//       elapsed += 5000;
//     }
//   }, 5000);
// };


>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69

export const getBooking = async (req, res) => {
    try {
        const driver=await Driver.findOne({userId:req.user.id});
        let bookings;
        if(driver){
<<<<<<< HEAD
             bookings = await Booking.find({driverId: driver._id}).sort({createdAt: -1});
        }
        else{
            bookings = await Booking.find({userId: req.user.id}).sort({createdAt: -1});
=======
             bookings = await Booking.find({driverId: driver._id});
        }
        else{
            bookings = await Booking.find({userId: req.user.id});
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
        }
        if(!bookings || bookings.length === 0){
            return res.status(200).json({message: "No bookings found"});
        }
        return res.json({data:{bookings}, message: "Booking fetched successfully" });
    } catch (error) {
        console.error(error);
        return res
        .status(500)
        .json({ message: "An error occurred while fetching booking" });
    }
}

export const updateBooking = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['status'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).send({ message: 'Invalid updates!' });
    }

    try {
        const {id} = req.params;
<<<<<<< HEAD
        const booking = await Booking.findById(id);
        if(!booking){
            return res.status(404).json({ message: "Booking not found" });
        }
        if(booking.driverId.toString()!==req.user.driverId && booking.userId._id.toString()!==req.user.id){
            return res.status(401).json({ message: "You are not authorized to update this booking" });
        }
        if(booking.status==="completed" || booking.status==="cancelled"){
            return res.status(400).json({ message: "Booking is already completed or cancelled" });
        }
        if(req.body.status==="completed" && booking.status!=="collected"){
            return res.status(400).json({ message: "Booking can only be completed after it is collected" });
        }
        if(req.body.status==="collected" && booking.status!=="accepted"){
            return res.status(400).json({ message: "Booking can only be collected after it is accepted" });
        }
        
        const updatedBooking = await Booking.findByIdAndUpdate(id, {...req.body,endTime: Date.now()}, { new: true, runValidators: true });
        if(Object.keys(req.body).includes('status') ){
            if(req.body.status==="completed"){
                io.emit("bookingCompleted", { booking});
                const driver=await Driver.findByIdAndUpdate(booking.driverId, { isAvailable: true });
=======
        const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if(Object.keys(req.body).includes('status') ){
            if(req.body.status==="completed"){
                io.emit("bookingCompleted", { booking});
                const driver=await Driver.findByIdAndUpdate(booking.driverId, { isAvailable: true,endTime: Date.now() });
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
                const driverAdminCacheKey=`admin-drivers:${driver.adminId}`;
                delAsync(driverAdminCacheKey);

            }
            else if(req.body.status==="cancelled"){
                const driver=await Driver.findByIdAndUpdate(booking.driverId, { isAvailable: true });
                const driverAdminCacheKey=`admin-drivers:${driver.adminId}`;
                delAsync(driverAdminCacheKey);
                io.emit("bookingCancelled", { booking });
            }
            else if(req.body.status==="collected"){
                io.emit("bookingCollected", { booking });
            }
        }
<<<<<<< HEAD
        return res.json({data:{booking:updatedBooking}, message: "Booking updated successfully" });
=======
        return res.json({data:{booking}, message: "Booking updated successfully" });
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
    } catch (error) {
        console.error(error);
        return res
        .status(500)
        .json({ message: "An error occurred while updating booking" });
    }
}

export const getParticularBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id)
            .populate("vehicleId", "model type")
            .populate("userId", "name");
<<<<<<< HEAD
        
        if(booking.driverId.toString()!==req.user.driverId && booking.userId._id.toString()!==req.user.id){
            console.log(booking.userId.toString(),req.user.id);
            return res.status(401).json({ message: "You are not authorized to fetch this booking" });
        }
=======

>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        return res.json({data:{booking}, message: "Particular booking fetched successfully" });
    } catch (error) {
        console.error(error);
        return res
        .status(500)
        .json({ message: "An error occurred while fetching particular booking" });
    }
    }
