import bcrypt from "bcrypt";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Badge from "../models/Badge.js";
import Account from "../models/Account.js";
import Budget from "../models/Budget.js";
import Notification from "../models/Notification.js";
import VerificationCode from "../models/VerificationCode.js";
import PendingRegistration from "../models/PendingRegistration.js";
import { generateVerificationCode, sendVerificationEmail } from "../utils/emailService.js";

export const checkEmail = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ exists: false, error: "Email is required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    const existingPending = await PendingRegistration.findOne({ email: email.toLowerCase() });
    
    const exists = !!(existingUser || existingPending);
    
    return res.status(200).json({ exists });
  } catch (error) {
    console.error("Check email error:", error);
    return res.status(500).json({ exists: false, error: "Failed to check email" });
  }
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`Registration attempt with existing email: ${email}`);
      return res.status(400).json({ error: "Email already exists. Please use a different email or login." });
    }

    const existingPending = await PendingRegistration.findOne({ email: email.toLowerCase() });
    if (existingPending) {
      await PendingRegistration.deleteOne({ email: email.toLowerCase() });
    }

    const hashed = await bcrypt.hash(password, 10);
    const code = generateVerificationCode();

    const pendingReg = new PendingRegistration({
      name,
      email: email.toLowerCase(),
      password: hashed,
      verificationCode: code
    });
    await pendingReg.save();

    await VerificationCode.deleteMany({ email });

    const verificationCode = new VerificationCode({
      email,
      code,
    });
    await verificationCode.save();

    sendVerificationEmail(email, code, 'registration')
      .then(() => {
        console.log(`📧 Verification code sent to ${email}`);
      })
      .catch((emailError) => {
        console.log(`⚠️ Email failed, but here's your code for testing: ${code}`);
        console.error('Email error details:', emailError);
      });

    res.status(201).json({
      message: "✅ Registration successful! Please verify your email.",
      requiresVerification: true,
      debugCode: code
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    if (user.provider !== 'google' && !user.isVerified) {
      return res.status(403).json({
        error: "Please verify your email before logging in.",
        requiresVerification: true
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid password." });

    res.status(200).json({
      message: "✅ Login successful",
      user: {
        email: user.email,
        name: user.name,
        photoURL: user.photoURL,
        role: user.role || 'User',
        _id: user._id,
        provider: user.provider || 'local'
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed." });
  }
};

export const googleAuth = async (req, res) => {
  const { name, email, photoURL, uid } = req.body;
  let user = await User.findOne({ email });

  if (!user) {
    user = new User({
      name,
      email,
      photoURL,
      role: "User",
      provider: "google",
      isVerified: true
    });
    await user.save();
  } else if (photoURL && user.photoURL !== photoURL) {
    user.photoURL = photoURL;
    await user.save();
  }

  res.status(200).json({ message: "✅ Google login successful", user });
};

export const updatePhoto = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No photo file provided." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const photoURL = `${req.protocol}:

    user.photoURL = photoURL;
    await user.save();

    res.status(200).json({
      message: "✅ Photo updated successfully",
      photoURL: photoURL
    });
  } catch (error) {
    console.error("Update photo error:", error);
    res.status(500).json({ error: "Failed to update photo." });
  }
};

export const deleteAccount = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    console.log(`Attempting to delete account for email: "${email}"`);

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for email: "${email}"`);
      return res.status(404).json({ error: "User not found." });
    }
    console.log(`User found: ${user._id}`);

    const deletedTransactions = await Transaction.deleteMany({ userId: user._id });
    console.log(`Deleted ${deletedTransactions.deletedCount} transactions for user ${email}`);

    const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const emailRegex = new RegExp(`^${escapedEmail}$`, 'i');
    console.log(`Using email regex: ${emailRegex}`);

    const deletedBadges = await Badge.deleteMany({ userEmail: { $regex: emailRegex } });
    console.log(`Deleted ${deletedBadges.deletedCount} badges for user ${email}`);

    const deletedAccounts = await Account.deleteMany({ userEmail: { $regex: emailRegex } });
    console.log(`Deleted ${deletedAccounts.deletedCount} accounts for user ${email}`);

    await User.deleteOne({ email });
    console.log(`User document deleted for ${email}`);

    res.status(200).json({
      message: "✅ Account and all associated data deleted successfully",
      deletedTransactions: deletedTransactions.deletedCount,
      deletedBadges: deletedBadges.deletedCount,
      deletedAccounts: deletedAccounts.deletedCount
    });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ error: "Failed to delete account." });
  }
};

export const resetData = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    console.log(`Attempting to reset data for email: "${email}"`);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const deletedTransactions = await Transaction.deleteMany({ userId: user._id });
    console.log(`Deleted ${deletedTransactions.deletedCount} transactions for user ${email}`);

    const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const emailRegex = new RegExp(`^${escapedEmail}$`, 'i');

    const deletedBadges = await Badge.deleteMany({ userEmail: { $regex: emailRegex } });
    console.log(`Deleted ${deletedBadges.deletedCount} badges for user ${email}`);

    const deletedAccounts = await Account.deleteMany({ userEmail: { $regex: emailRegex } });
    console.log(`Deleted ${deletedAccounts.deletedCount} accounts for user ${email}`);

    const deletedBudgets = await Budget.deleteMany({ 
      $or: [
        { userId: user._id },
        { userEmail: { $regex: emailRegex } }
      ]
    });
    console.log(`Deleted ${deletedBudgets.deletedCount} budgets for user ${email}`);

    const deletedNotifications = await Notification.deleteMany({ userId: user._id });
    console.log(`Deleted ${deletedNotifications.deletedCount} notifications for user ${email}`);

    res.status(200).json({
      message: "✅ All data reset successfully",
      deletedTransactions: deletedTransactions.deletedCount,
      deletedBadges: deletedBadges.deletedCount,
      deletedAccounts: deletedAccounts.deletedCount,
      deletedBudgets: deletedBudgets.deletedCount,
      deletedNotifications: deletedNotifications.deletedCount
    });
  } catch (err) {
    console.error("Reset data error:", err);
    res.status(500).json({ error: "Failed to reset data." });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  try {
    if (!email || !code) {
      return res.status(400).json({ error: "Email and code are required" });
    }

    const verificationCode = await VerificationCode.findOne({
      email: email.toLowerCase(),
      code: code
    });

    if (!verificationCode) {
      return res.status(400).json({ error: "❌ Invalid or expired verification code" });
    }

    const pendingReg = await PendingRegistration.findOne({
      email: email.toLowerCase(),
      verificationCode: code
    });

    if (!pendingReg) {
      return res.status(404).json({ error: "Registration data not found or code mismatch" });
    }

    const newUser = new User({
      name: pendingReg.name,
      email: pendingReg.email,
      password: pendingReg.password,
      isVerified: true,
      provider: "local"
    });
    await newUser.save();

    await VerificationCode.deleteOne({ _id: verificationCode._id });
    await PendingRegistration.deleteOne({ _id: pendingReg._id });

    console.log(`✅ User account created for verified email: ${email}`);

    res.status(200).json({
      message: "✅ Email verified successfully!",
      verified: true
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
};

export const resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already verified. Please login." });
    }

    const pendingReg = await PendingRegistration.findOne({ email: email.toLowerCase() });

    if (!pendingReg) {
      return res.status(404).json({ error: "No pending registration found. Please register first." });
    }

    const code = generateVerificationCode();

    pendingReg.verificationCode = code;
    await pendingReg.save();

    await VerificationCode.deleteMany({ email: email.toLowerCase() });

    const verificationCode = new VerificationCode({
      email: email.toLowerCase(),
      code: code,
    });
    await verificationCode.save();

    sendVerificationEmail(email, code, 'registration')
      .then(() => {
        console.log(`📧 Verification code resent to ${email}`);
      })
      .catch((emailError) => {
        console.log(`⚠️ Email failed, but here's your code for testing: ${code}`);
      });

    res.status(200).json({
      message: "✅ New verification code sent to your email!",
      debugCode: code
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ error: "Failed to resend verification code" });
  }
};

export const verifyPasswordChangeCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    if (!email || !code) {
      return res.status(400).json({ error: "Email and code are required" });
    }

    const verificationCode = await VerificationCode.findOne({
      email: email.toLowerCase(),
      code: code
    });

    if (!verificationCode) {
      return res.status(400).json({ error: "❌ Invalid or expired verification code" });
    }

    res.status(200).json({
      message: "✅ Code verified successfully!",
      verified: true
    });
  } catch (error) {
    console.error("Password change code verification error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
};

export const sendPasswordChangeCode = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const code = generateVerificationCode();

    await VerificationCode.deleteMany({ email: email.toLowerCase() });

    const verificationCode = new VerificationCode({
      email: email.toLowerCase(),
      code: code,
    });
    await verificationCode.save();

    sendVerificationEmail(email, code, 'password-change')
      .then(() => {
        console.log(`📧 Password change verification code sent to ${email}`);
      })
      .catch((emailError) => {
        console.log(`⚠️ Email failed, but here's your code for testing: ${code}`);
      });

    res.status(200).json({
      message: "✅ Verification code sent to your email!",
      debugCode: code
    });
  } catch (error) {
    console.error("Send password change code error:", error);
    res.status(500).json({ error: "Failed to send verification code" });
  }
};

export const changePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.provider === 'google') {
      return res.status(400).json({ error: "Password change not available for Google accounts" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "✅ Password updated successfully!" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};

export const updateUsername = async (req, res) => {
  const { email, newUsername } = req.body;

  try {
    if (!email || !newUsername) {
      return res.status(400).json({ error: "Email and new username are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = newUsername.trim();
    await user.save();

    res.status(200).json({
      message: "✅ Username updated successfully!",
      user: {
        email: user.email,
        name: user.name,
        _id: user._id,
        provider: user.provider || 'local'
      }
    });
  } catch (error) {
    console.error("Update username error:", error);
    res.status(500).json({ error: "Failed to update username" });
  }
};

