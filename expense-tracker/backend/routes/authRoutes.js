import express from "express";
import { register, login, googleAuth, deleteAccount, verifyEmail, resendVerification, verifyPasswordChangeCode, sendPasswordChangeCode, changePassword, updateUsername } from "../controllers/authController.js";

const router = express.Router();


router.post("/register", register);


router.post("/login", login);


router.post("/google", googleAuth);


router.post("/delete", deleteAccount);

router.post("/verify-email", verifyEmail);

router.post("/resend-verification", resendVerification);

router.post("/send-password-change-code", sendPasswordChangeCode);
router.post("/verify-password-code", verifyPasswordChangeCode);
router.post("/change-password", changePassword);

router.post("/update-username", updateUsername);

export default router;

