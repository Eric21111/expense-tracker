import express from "express";
import { forgotPassword, verifyCode, resetPassword } from "../controllers/passwordController.js";

const router = express.Router();

// POST /users/forgot-password
router.post("/forgot-password", forgotPassword);

// POST /users/verify-code
router.post("/verify-code", verifyCode);

// POST /users/reset-password
router.post("/reset-password", resetPassword);

export default router;

