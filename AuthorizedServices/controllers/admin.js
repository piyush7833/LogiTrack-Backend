import mongoose from "mongoose";
import Driver from "../models/Driver.js";
import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";

export const getDriverAnalytics = async (req, res) => {
  try {
    const driverId = req.params.id;
    console.log(driverId);
    const { ObjectId } = mongoose.Types;
    const driverAnalytics = await Driver.aggregate([
      {
        $match: { _id: new ObjectId(driverId) },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "driverId",
          as: "bookings",
        },
      },
      {
        $unwind: "$bookings",
      },
      {
        $group: {
          _id: "$_id",
          totalEarnings: { $sum: "$bookings.price" },
          totalTrips: { $sum: 1 },
          totalDuration: {
            $sum: {
              $let: {
                vars: {
                  parts: { $split: ["$bookings.duration", " "] },
                },
                in: {
                  $add: [
                    {
                      $multiply: [
                        { $toInt: { $arrayElemAt: ["$$parts", 0] } },
                        3600,
                      ],
                    },
                    {
                      $multiply: [
                        { $toInt: { $arrayElemAt: ["$$parts", 2] } },
                        60,
                      ],
                    },
                  ],
                },
              },
            },
          },
          totalDistance: { $sum: "$bookings.distance" },
          isAvailable: { $first: "$isAvailable" },
          runningTrip: {
            $first: {
              $cond: {
                if: { $eq: ["$isAvailable", false] },
                then: {
                  srcName: "$bookings.srcName",
                  destnName: "$bookings.destnName",
                },
                else: null,
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          totalEarnings: 1,
          totalTrips: 1,
          totalDuration: {
            $let: {
              vars: {
                hours: { $floor: { $divide: ["$totalDuration", 3600] } },
                minutes: {
                  $floor: { $mod: [{ $divide: ["$totalDuration", 60] }, 60] },
                },
              },
              in: {
                $concat: [
                  { $toString: "$$hours" },
                  " hr ",
                  { $toString: "$$minutes" },
                  " mins",
                ],
              },
            },
          },
          totalDistance: 1,
          isAvailable: 1,
          runningTrip: 1,
        },
      },
    ]);
    return res.status(200).json({ data: { driverAnalytics } });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to fetch driver analytics" });
  }
};

export const getVehicleAnalytics = async (req, res) => {
  try {
    const vehicleId = req.params.id;
    const { ObjectId } = mongoose.Types;
    const vehicleAnalytics = await Vehicle.aggregate([
      {
        $match: { _id: new ObjectId(vehicleId) },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "vehicleId",
          as: "bookings",
        },
      },
      {
        $unwind: "$bookings",
      },
      {
        $match: {
          "bookings.status": "completed",
        },
      },
      {
        $group: {
          _id: "$_id",
          totalEarnings: { $sum: "$bookings.price" },
          totalTrips: { $sum: 1 },
          totalDuration: {
            $sum: {
              $let: {
                vars: {
                  parts: { $split: ["$bookings.duration", " "] },
                },
                in: {
                  $add: [
                    {
                      $multiply: [
                        { $toInt: { $arrayElemAt: ["$$parts", 0] } },
                        3600,
                      ],
                    },
                    {
                      $multiply: [
                        { $toInt: { $arrayElemAt: ["$$parts", 2] } },
                        60,
                      ],
                    },
                  ],
                },
              },
            },
          },
          totalDistance: { $sum: "$bookings.distance" },
        },
      },
      {
        $project: {
          _id: 1,
          totalEarnings: 1,
          totalTrips: 1,
          totalDuration: {
            $let: {
              vars: {
                hours: { $floor: { $divide: ["$totalDuration", 3600] } },
                minutes: {
                  $floor: { $mod: [{ $divide: ["$totalDuration", 60] }, 60] },
                },
              },
              in: {
                $concat: [
                  { $toString: "$$hours" },
                  " hr ",
                  { $toString: "$$minutes" },
                  " mins",
                ],
              },
            },
          },
          totalDistance: 1,
        },
      },
    ]);
    return res.status(200).json({ data: { vehicleAnalytics } });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to fetch vehicle analytics" });
  }
};

async function getTopEfficientDrivers() {
    try {
      const bookings = await Booking.aggregate([
        {
          $group: {
            _id: "$driverId",
            totalEfficiency: {
              $avg: {
                $divide: [
                  { $subtract: ["$endTime", "$startTime"] },
                  {
                    $add: [
                      { $multiply: [{ $toInt: { $arrayElemAt: [{ $split: ["$duration", " "] }, 0] } }, 60] },
                      { $toInt: { $arrayElemAt: [{ $split: ["$duration", " "] }, 2] } }
                    ]
                  }
                ]
              }
            }
          }
        },
        {
          $sort: { totalEfficiency: -1 }
        },
        {
          $limit: 5
        }
      ]);
      console.log(bookings,"bookings");
      // Get driver details along with their efficiency value
      const topDrivers = await Driver.find({
        _id: { $in: bookings.map(b => b._id) }
      }).select("licenseNumber isAvailable currentLocation").populate("userId","name email").lean();
  
      // Attach efficiency value to the driver object

      const results = topDrivers.map(driver => {
        const booking = bookings.find(b => b._id.toString() === driver._id.toString());
        return {
          driver: driver.userId.email,
          drive: driver.userId.name,
          efficiency: booking.totalEfficiency.toFixed(2),
        }
      });
      return results;
    } catch (error) {
      console.error(error);
    }
  }

export const getAllDriverAnalytics = async (req, res) => {
  try {
    const drivers=await getTopEfficientDrivers();
    return res.status(200).json({ data: {driverAnalytics: drivers.sort((a, b) =>   b["efficiency"]-a["efficiency"]) } });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to fetch driver analytics" });
  }
};

export const getAllVehicleAnalytics = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ adminId: req.user.id }).select(
      "_id type"
    );

    if (vehicles.length === 0) {
      return res
        .status(404)
        .json({ message: "No vehicles found for this admin." });
    }

    const vehicleTypeMap = {};
    vehicles.forEach((vehicle) => {
      vehicleTypeMap[vehicle._id] = vehicle.type;
    });

    const bookings = await Booking.find({
      vehicleId: { $in: Object.keys(vehicleTypeMap) },
    }).select("vehicleId");

    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for these vehicles." });
    }

    const vehicleTypeCount = {
      "mini truck": 0,
      truck: 0,
      "big truck": 0,
    };

    bookings.forEach((booking) => {
      const vehicleType = vehicleTypeMap[booking.vehicleId];
      if (vehicleType) {
        vehicleTypeCount[vehicleType] += 1;
      }
    });

    const sortedVehicleDemand = Object.entries(vehicleTypeCount)
      .sort((a, b) => a[1] - b[1])
      .map(([type, count]) => ({ type, count }));

    return res.status(200).json({
      data: {allVehicleAnalytics: sortedVehicleDemand},
    });
  } catch (error) {
    console.error("Error fetching vehicle demand:", error.message);
    return res.status(500).json({
      message: "Server error while fetching vehicle demand.",
      error: error.message,
    });
  }
};
