import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
