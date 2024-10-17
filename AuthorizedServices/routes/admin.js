import express from "express";
import { authenticateToken, isAdmin } from "../middleware/middleware.js";
<<<<<<< HEAD
import {   getAllDriverAnalytics, getAllVehicleAnalytics, getDriverAnalytics, getVehicleAnalytics } from "../controllers/admin.js";
=======
import { getDriverAnalytics, getVehicleAnalytics } from "../controllers/admin.js";
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69

const router = express.Router();

// router.post("/create",createBooking)
router.get("/get-vehicle/:id",authenticateToken,isAdmin,getVehicleAnalytics)
router.get("/get-driver/:id", authenticateToken,isAdmin,getDriverAnalytics)
<<<<<<< HEAD
router.get("/get-all-vehicle",authenticateToken,isAdmin,getAllVehicleAnalytics)
router.get("/get-all-driver",authenticateToken,isAdmin,getAllDriverAnalytics)

export default router;
 
=======

export default router;
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
