import express from "express";
import { authenticateToken, isAdmin } from "../middleware/middleware.js";
import { createDriver, deleteDriver, getAllDrivers, getParticularDriver, updateDriver, updateDriverLocation } from "../controllers/driver.js";

const router = express.Router();

router.post("/create",authenticateToken,isAdmin, createDriver);
router.get("/get",authenticateToken,isAdmin, getAllDrivers);
router.get("/get/:id",authenticateToken, getParticularDriver);
router.put("/update/:id",authenticateToken,isAdmin, updateDriver);
router.delete("/delete/:id",authenticateToken,isAdmin, deleteDriver);
router.put("/update-via-location/:id", updateDriverLocation);

export default router;
