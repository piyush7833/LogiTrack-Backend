import express from "express";
import { body, validationResult } from "express-validator";
import Vehicle from "../models/Vehicle.js";
import { createVehicle, deleteVehicle, getAllVehicles, getVehicleById, updateVehicle } from "../controllers/vehicle.js";
import { authenticateToken, isAdmin } from "../middleware/middleware.js";
const router = express.Router();

router.post("/create",  authenticateToken,isAdmin, createVehicle )

router.get("/get",authenticateToken,isAdmin, getAllVehicles)
router.get("/get/:id",authenticateToken,isAdmin, getVehicleById)
router.delete("/delete/:id",authenticateToken,isAdmin, deleteVehicle)
router.put("/update/:id",authenticateToken,isAdmin, updateVehicle)

router.get(
  "/nearby-vehicles",
  [
    body("startLocation.latitude")
      .isFloat({ min: -90, max: 90 })
      .withMessage("Start location latitude must be between -90 and 90."),
    body("startLocation.longitude")
      .isFloat({ min: -180, max: 180 })
      .withMessage("Start location longitude must be between -180 and 180."),
    body("endLocation.latitude")
      .isFloat({ min: -90, max: 90 })
      .withMessage("End location latitude must be between -90 and 90."),
    body("endLocation.longitude")
      .isFloat({ min: -180, max: 180 })
      .withMessage("End location longitude must be between -180 and 180."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      return res.status(400).json({ message: firstError.msg });
    }

    const { startLocation, endLocation } = req.body;

    try {
      const vehicles = await Vehicle.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [startLocation.longitude, startLocation.latitude],
            },
            distanceField: "dist.calculated",
            maxDistance: 5000,
            spherical: true,
            query: {
              $or: [
                {
                  currentLocation: {
                    $geoWithin: {
                      $centerSphere: [
                        [startLocation.longitude, startLocation.latitude],
                        5 / 6378.1,
                      ],
                    },
                  },
                },
                {
                  currentLocation: {
                    $geoWithin: {
                      $centerSphere: [
                        [endLocation.longitude, endLocation.latitude],
                        5 / 6378.1,
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      ]);
      return res.json(vehicles);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "An error occurred while fetching nearby vehicles." });
    }
  }
);

export default router;
