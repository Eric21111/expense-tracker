import express from "express";
import { register, login, googleAuth, deleteAccount, resetData, verifyEmail, resendVerification, verifyPasswordChangeCode, sendPasswordChangeCode, changePassword, updateUsername, updatePhoto, checkEmail } from "../controllers/authController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/check-email", checkEmail);

router.post("/register", register);

router.post("/login", login);

router.post("/google", googleAuth);

router.post("/delete", deleteAccount);
router.post("/reset-data", resetData);

router.post("/verify-email", verifyEmail);

router.post("/resend-verification", resendVerification);

router.post("/send-password-change-code", sendPasswordChangeCode);
router.post("/verify-password-code", verifyPasswordChangeCode);
router.post("/change-password", changePassword);

router.post("/update-username", updateUsername);

router.post("/update-photo", upload.single('photo'), updatePhoto);

export default router;

