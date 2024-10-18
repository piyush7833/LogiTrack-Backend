import Booking from "../models/Booking.js";
import Driver from "../models/Driver.js";
import { io } from "../index.js";
import { delAsync } from "../config/redis.js";


export const getBooking = async (req, res) => {
    try {
        const driver=await Driver.findOne({userId:req.user.id});
        let bookings;
        if(driver){
             bookings = await Booking.find({driverId: driver._id}).sort({createdAt: -1});
        }
        else{
            bookings = await Booking.find({userId: req.user.id}).sort({createdAt: -1});
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
        return res.json({data:{booking:updatedBooking}, message: "Booking updated successfully" });
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
        
        if(booking.driverId.toString()!==req.user.driverId && booking.userId._id.toString()!==req.user.id){
            console.log(booking.userId.toString(),req.user.id);
            return res.status(401).json({ message: "You are not authorized to fetch this booking" });
        }
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
