import express from "express";
import { register, login, googleAuth } from "../controllers/authController.js";

const router = express.Router();

// POST /users/register
router.post("/register", register);

// POST /users/login
router.post("/login", login);

// POST /users/google
router.post("/google", googleAuth);

export default router;

