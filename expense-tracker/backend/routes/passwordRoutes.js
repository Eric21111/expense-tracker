import express from "express";
import { forgotPassword, verifyCode, resetPassword } from "../controllers/passwordController.js";

const router = express.Router();


router.post("/forgot-password", forgotPassword);


router.post("/verify-code", verifyCode);


router.post("/reset-password", resetPassword);

export default router;

