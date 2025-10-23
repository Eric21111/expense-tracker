import bcrypt from "bcrypt";
import User from "../models/User.js";
import VerificationCode from "../models/VerificationCode.js";
import { generateVerificationCode, sendVerificationEmail } from "../utils/emailService.js";

// Forgot Password - Send verification code
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const emailLower = email.toLowerCase();
  
    // Check if user exists in database
    const user = await User.findOne({ email: emailLower });
    
    if (!user) {
      return res.status(404).json({ error: "❌ Email not found in our system. Please check your email or register." });
    }

    // Check if user registered with Google (check provider field)
    if (user.provider === 'google') {
      return res.status(400).json({ error: "❌ This account was created with Google. Please use Google login instead." });
    }

    // Generate verification code
    const code = generateVerificationCode();

    // Delete any existing verification codes for this email
    await VerificationCode.deleteMany({ email: emailLower });

    // Save new verification code
    const verificationCode = new VerificationCode({
      email: emailLower,
      code: code,
    });
    await verificationCode.save();

    // Send email with verification code
    try {
      await sendVerificationEmail(email, code);
      console.log(`📧 Verification code sent to ${email}`);
    } catch (emailError) {
      // If email fails, still allow testing by logging the code
      console.log(`⚠️ Email failed, but here's your code for testing: ${code}`);
    }

    res.status(200).json({ 
      message: "✅ Verification code sent to your email!",
      // TEMPORARY: Remove this after email is fixed
      debugCode: code
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ 
      error: "Failed to process request. Please try again.",
      details: error.message
    });
  }
};

// Verify Code
export const verifyCode = async (req, res) => {
  const { email, code } = req.body;
  
  try {
    if (!email || !code) {
      return res.status(400).json({ error: "Email and code are required" });
    }

    // Find verification code
    const verificationCode = await VerificationCode.findOne({ 
      email: email.toLowerCase(),
      code: code 
    });

    if (!verificationCode) {
      return res.status(400).json({ error: "❌ Invalid or expired verification code" });
    }

    res.status(200).json({ 
      message: "✅ Code verified successfully",
      verified: true 
    });
  } catch (error) {
    console.error("Verify code error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  
  try {
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Verify code again
    const verificationCode = await VerificationCode.findOne({ 
      email: email.toLowerCase(),
      code: code 
    });

    if (!verificationCode) {
      return res.status(400).json({ error: "❌ Invalid or expired verification code" });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash and update password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    // Delete verification code
    await VerificationCode.deleteOne({ _id: verificationCode._id });

    res.status(200).json({ message: "✅ Password reset successfully!" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Password reset failed" });
  }
};

