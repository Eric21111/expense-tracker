import express from "express";
import { register, login, googleAuth, deleteAccount } from "../controllers/authController.js";

const router = express.Router();


router.post("/register", register);


router.post("/login", login);


router.post("/google", googleAuth);


router.post("/delete", deleteAccount);

export default router;

