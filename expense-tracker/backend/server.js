import 'dotenv/config';
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import aiInsightsRoutes from "./routes/aiInsightsRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import badgeRoutes from "./routes/badgeRoutes.js";
import transporter from "./utils/emailService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

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


app.use("/users", authRoutes);
app.use("/users", passwordRoutes);
app.use("/transactions", transactionRoutes);
app.use("/ai-insights", aiInsightsRoutes);
app.use("/email", emailRoutes);
app.use("/api", badgeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
