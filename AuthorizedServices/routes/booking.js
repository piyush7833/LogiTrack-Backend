import express from "express";
import {  getBooking, getParticularBooking, updateBooking } from "../controllers/booking.js";
<<<<<<< HEAD
import { authenticateToken, isNotAdmin } from "../middleware/middleware.js";
=======
import { authenticateToken } from "../middleware/middleware.js";
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
import { createBooking } from "../sockets/socketHandler.js";

const router = express.Router();

<<<<<<< HEAD
router.post("/",authenticateToken,isNotAdmin,createBooking)
router.get("/get-all",authenticateToken,isNotAdmin,getBooking)
router.get("/get/:id", authenticateToken,isNotAdmin,getParticularBooking)
router.put("/update/:id",authenticateToken,isNotAdmin,updateBooking)
=======
router.post("/",authenticateToken,createBooking)
router.get("/get-all",authenticateToken,getBooking)
router.get("/get/:id", authenticateToken,getParticularBooking)
router.put("/update/:id",authenticateToken,updateBooking)
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69

export default router;
