import express from "express";
import {
  authMe,
  getUserById,
  login,
  signup,
  updateUser,
} from "../controllers/auth.js";
import {authenticateToken} from "../middleware/middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/me", authenticateToken, authMe);

router.get("/get/:id", authenticateToken, getUserById);

router.put("/update", authenticateToken, updateUser);

export default router;
