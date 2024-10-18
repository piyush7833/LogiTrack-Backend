import express from "express";
import {  getBooking, getParticularBooking, updateBooking } from "../controllers/booking.js";
import { authenticateToken, isNotAdmin } from "../middleware/middleware.js";
import { createBooking } from "../sockets/socketHandler.js";

const router = express.Router();

router.post("/",authenticateToken,isNotAdmin,createBooking)
router.get("/get-all",authenticateToken,isNotAdmin,getBooking)
router.get("/get/:id", authenticateToken,isNotAdmin,getParticularBooking)
router.put("/update/:id",authenticateToken,isNotAdmin,updateBooking)

export default router;
