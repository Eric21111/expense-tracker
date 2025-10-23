import bcrypt from "bcrypt";
import User from "../models/User.js";

// Register new user
export const register = async (req, res) => {
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
};

// Login user
export const login = async (req, res) => {
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
};

// Google login/register
export const googleAuth = async (req, res) => {
  const { name, email, photoURL, uid } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ name, email, provider: "google" });
    await user.save();
  }
  res.status(200).json({ message: "✅ Google login successful", user });
};

