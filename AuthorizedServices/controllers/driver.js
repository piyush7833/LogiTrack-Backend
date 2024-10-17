import { validationResult } from "express-validator";
import Driver from "../models/Driver.js";
import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";
import { delAsync, getAsync, setAsync } from "../config/redis.js";

// import Booking from "../models/Booking.js";
// import { activeBookings } from "./booking.js";

export const createDriver = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(400).json({ message: firstError.msg });
  }
  try {
    const { name, username, email, password, phone, licenseNumber } = req.body;
    const adminCacheKey = `admin-drivers:${req.user.id}`;
    const userData = {
      name,
      username,
      email,
      phone,
      password,
      role: "driver",
    };
    const user = new User(userData);
    const newUser=await user.save();
    const driverData = {
      licenseNumber,
      adminId: req.user.id,
      userId: newUser._id,
    };
    const driver = new Driver(driverData);
    const newDriver = await driver.save();
    await user.save();
    await delAsync(adminCacheKey);
    res.status(201).json({
      data: {
        driver: {
          _id: newDriver._id,
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          licenseNumber: newDriver.licenseNumber,
          role: user.role,
          createdAt: newDriver.createdAt,
          updatedAt: newDriver.updatedAt,
        },
      },
      message: "Driver created successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [
        {
          message: "An error occurred while creating the driver.",
        },
      ],
    });
  }
};

export const getAllDrivers = async (req, res) => {
  try {
    const adminCacheKey = `admin-drivers:${req.user.id}`; 
    const cachedDrivers = await getAsync(adminCacheKey);
    if (cachedDrivers) {
      return res.status(200).json({ data: { drivers: JSON.parse(cachedDrivers) } });
    }
    const drivers = await Driver.find({ adminId: req.user.id })
      .populate("userId", "name username email phone role")
      .populate("vehicleId", "model licensePlate");

    const driverDetails = drivers.map((driver) => ({
      _id: driver._id,
      name: driver.userId.name,
      username: driver.userId.username,
      email: driver.userId.email,
      phone: driver.userId.phone,
      licenseNumber: driver.licenseNumber,
      role: driver.userId.role,
      vehicle: driver.vehicleId
        ? {
            model: driver.vehicleId.model,
            numberPlate: driver.vehicleId.numberPlate,
          }
        : null,
    }));
<<<<<<< HEAD
    await setAsync(adminCacheKey, JSON.stringify(driverDetails), 'EX', 6000);
=======
    await setAsync(adminCacheKey, JSON.stringify(drivers), 'EX', 6000);
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
    res
      .status(200)
      .json({
        data: { drivers: driverDetails },
        message: "Drivers fetched successfully.",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [
        {
          message: "An error occurred while fetching drivers.",
        },
      ],
    });
  }
};

export const getParticularDriver = async (req, res) => {
  try {
    const cacheKey = `driver:${req.params.id}`; 
    const cachedDriver = await getAsync(cacheKey);
    if (cachedDriver) {
      return res.status(200).json({ data: { driver: JSON.parse(cachedDriver) } });
    }
    const driver = await Driver.findById(req.params.id)
      .populate("userId", "name username email phone role")
      .populate("vehicleId", "model licensePlate");
<<<<<<< HEAD

    if (!driver) {
      return res.status(404).json({ message: "Driver not found." });
    }

=======
    if (!driver) {
      return res.status(404).json({ message: "Driver not found." });
    }
    if (driver.adminId.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this driver." });
    }
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
    const driverDetails = {
      _id: driver._id,
      name: driver.userId.name,
      username: driver.userId.username,
      email: driver.userId.email,
      phone: driver.userId.phone,
      licenseNumber: driver.licenseNumber,
      isAvailable: driver.isAvailable,
      currentLocation: driver.currentLocation,
      role: driver.userId.role,
      vehicle: driver.vehicleId
        ? {
            model: driver.vehicleId.model,
            numberPlate: driver.vehicleId.numberPlate,
          }
        : null,
    };
    await setAsync(cacheKey, JSON.stringify(driverDetails), 'EX', 6000);
    res.status(200).json({ data: { driver: driverDetails } });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [
        {
          message: "An error occurred while fetching the driver.",
        },
      ],
    });
  }
};


export const updateDriver = async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(400).json({ message: firstError.msg });
  }
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "licenseNumber",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
);
if (!isValidOperation) {
  return res.status(400).send({ message: "Invalid updates!" });
}

try {
    const cacheKey = `driver:${req.params.id}`; 
    const driver = await Driver.findById(req.params.id);
    const adminCacheKey = `admin-drivers:${driver.adminId}`;
    if (!driver) {
      return res.status(404).json({ message: "Driver not found." });
    }
    if (driver.adminId.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this driver." });
    }
<<<<<<< HEAD

=======
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("userId", "name username email phone role")
      .populate("vehicleId", "model licensePlate");

    const driverDetails = {
      _id: updatedDriver._id,
      name: updatedDriver.userId.name,
      username: updatedDriver.userId.username,
      email: updatedDriver.userId.email,
      phone: updatedDriver.userId.phone,
      licenseNumber: updatedDriver.licenseNumber,
      role: updatedDriver.userId.role,
      vehicle: updatedDriver.vehicleId
        ? {
            model: updatedDriver.vehicleId.model,
            numberPlate: updatedDriver.vehicleId.numberPlate,
          }
        : null,
    };
    await setAsync(cacheKey, JSON.stringify(driverDetails), 'EX', 6000);
    await delAsync(adminCacheKey);
    res.status(200).json({
      data: { driver: driverDetails },
      message: "Driver updated successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [
        {
          message: "An error occurred while updating the driver.",
        },
      ],
    });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const cacheKey = `driver:${req.params.id}`; 
    const driver = await Driver.findById(req.params.id);
    const adminCacheKey = `admin-drivers:${driver.adminId}`;
<<<<<<< HEAD
=======
    await Vehicle.findOneAndUpdate({ driverId: req.params.id }, { driverId: null });
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
    if (!driver) {
      return res.status(404).json({ message: "Driver not found." });
    }
    if (driver.adminId.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this driver." });
    }
<<<<<<< HEAD
    
    await Vehicle.findOneAndUpdate({ driverId: req.params.id }, { driverId: null });
=======
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
    await User.deleteOne({ _id: driver.userId });
    await Driver.deleteOne({ _id: req.params.id });
    await delAsync(cacheKey);
    await delAsync(adminCacheKey);
    res.status(200).json({ message: "Driver deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [
        {
          message: "An error occurred while deleting the driver.",
        },
      ],
    });
  }
};

export const updateDriverLocation = async (req, res) => {
  try {
    const cacheKey = `driver:${req.params.id}`; 
    const id = req.params.id;
    const { location } = req.body;
    
    if (!location || !location.lat || !location.lng) {
      return res.status(400).json({ message: "Invalid location data." });
    }

    const updatedDriver = await Driver.findByIdAndUpdate(
      id,
      { 
        $set: { "currentLocation.coordinates": [location.lat, location.lng] }
      },
      { new: true }
    );
    const adminCacheKey = `admin-drivers:${updatedDriver.adminId}`;
    await delAsync(cacheKey);
    await delAsync(adminCacheKey);
    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found." });
    }

    return res.status(200).json({ message: "Driver location updated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred while updating the driver location." });
  }
};

export const getNearByDrivers = async (src, vehicleType) => {
  try {
    const drivers = await Driver.aggregate([
      {
      // Find drivers within 5 km from the given location
      $geoNear: {
        near: {
        type: "Point",
        coordinates: src, // [longitude, latitude]
        },
        distanceField: "distance",
        maxDistance: 10000, // 10 km in meters
        spherical: true,
      },
      },
      {
      // Join with the Vehicle collection to filter by vehicle type
      $lookup: {
        from: "vehicles", // The name of the Vehicle collection in the database
        localField: "vehicleId",
        foreignField: "_id",
        as: "vehicle",
      },
      },
      {
      // Unwind the vehicle array to treat it as an object
      $unwind: "$vehicle",
      },
      {
      // Join with the User collection to fetch user details
      $lookup: {
        from: "users", // The name of the User collection in the database
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
      },
      {
      // Unwind the user array to treat it as an object
      $unwind: "$user",
      },
      {
      // Match the vehicle type to the specified type and check availability
      $match: {
        "vehicle.type": vehicleType,
        isAvailable: true,
      },
      },
      {
      // Optionally, project the fields you want to return
      $project: {
        licenseNumber: 1,
        isAvailable: 1,
        currentLocation: 1,
        "vehicle.type": 1,
        "vehicle.numberPlate": 1,
        "vehicle.model": 1,
        "user._id": 1,
        "user.name": 1,
        distance: {
        $round: [{ $divide: ["$distance", 1000] }, 2], // Distance in km
        },
      },
      },
      {
      // Sort by distance, closest first
      $sort: {
        distance: 1,
      },
      },
    ]);

    return drivers;
  } catch (error) {
    console.error("Error finding nearby drivers:", error);
    throw error;
  }
};






