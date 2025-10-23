import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  provider: { type: String, default: "local" },
});

const User = mongoose.model("User", UserSchema);

const VerificationCodeSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, 
});

const VerificationCode = mongoose.model("VerificationCode", VerificationCodeSchema);


app.post("/users/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists." });

    const hashed = await bcrypt.hash(password, 10);
    await new User({ name, email, password: hashed }).save();
    res.status(201).json({ message: "✅ Registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed." });
  }
});


app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid password." });

    res.status(200).json({ message: "✅ Login successful", user: { email: user.email } });
  } catch {
    res.status(500).json({ error: "Login failed." });
  }
});

app.post("/users/google", async (req, res) => {
  const { name, email, photoURL, uid } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ name, email, provider: "google" });
    await user.save();
  }
  res.status(200).json({ message: "✅ Google login successful", user });
});


app.get("/test-email", async (req, res) => {
  try {

    await transporter.verify();
    res.json({ 
      success: true, 
      message: "Email configuration is working!",
      user: process.env.EMAIL_USER 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      user: process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASSWORD
    });
  }
});


const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: `"Trackit - Expense Tracker" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Password Reset Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #34A853 0%, #4CAF50 100%);
            padding: 30px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .code-box {
            background-color: #f0f9f4;
            border: 2px dashed #34A853;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
          }
          .code {
            font-size: 36px;
            font-weight: bold;
            color: #34A853;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
          }
          .message {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
          }
          .footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            color: #999;
            font-size: 14px;
          }
          .warning {
            color: #e74c3c;
            font-weight: bold;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          <div class="content">
            <p class="message">
              You requested to reset your password for your Trackit account.
            </p>
            <p class="message">
              Use the verification code below to complete the password reset process:
            </p>
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            <p class="message">
              This code will expire in <strong>10 minutes</strong>.
            </p>
            <p class="message warning">
              ⚠️ If you didn't request this, please ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>© 2025 Trackit - Expense Tracker. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    console.log('Attempting to send email to:', email);
    console.log('Using EMAIL_USER:', process.env.EMAIL_USER);
    console.log('Has EMAIL_PASSWORD:', !!process.env.EMAIL_PASSWORD);
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('❌ Email sending error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw new Error('Failed to send verification email');
  }
};


app.post("/users/forgot-password", async (req, res) => {
  const { email } = req.body;
  
  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const emailLower = email.toLowerCase();
  
 
    const user = await User.findOne({ email: emailLower });
    
    if (!user) {
      return res.status(404).json({ error: "❌ Email not found in our system. Please check your email or register." });
    }


    if (user.provider === 'google') {
      return res.status(400).json({ error: "❌ This account was created with Google. Please use Google login instead." });
    }


    const code = generateVerificationCode();

   
    await VerificationCode.deleteMany({ email: emailLower });

   
    const verificationCode = new VerificationCode({
      email: emailLower,
      code: code,
    });
    await verificationCode.save();

    await sendVerificationEmail(email, code);
    console.log(`📧 Verification code sent to ${email}`);

    res.status(200).json({ 
      message: "✅ Verification code sent to your email!"
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ 
      error: "Failed to process request. Please try again.",
      details: error.message 
    });
  }
});


app.post("/users/verify-code", async (req, res) => {
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
      message: "✅ Code verified successfully",
      verified: true 
    });
  } catch (error) {
    console.error("Verify code error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
});


app.post("/users/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;
  
  try {
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    
    const verificationCode = await VerificationCode.findOne({ 
      email: email.toLowerCase(),
      code: code 
    });

    if (!verificationCode) {
      return res.status(400).json({ error: "❌ Invalid or expired verification code" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();


    await VerificationCode.deleteOne({ _id: verificationCode._id });

    res.status(200).json({ message: "✅ Password reset successfully!" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Password reset failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
