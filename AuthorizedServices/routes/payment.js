import express from "express";
import { authenticateToken } from "../middleware/middleware.js";
import { checkout, paymemtVerification } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/checkout", authenticateToken, checkout);
router.post("/verification", authenticateToken, paymemtVerification);
export default router;
