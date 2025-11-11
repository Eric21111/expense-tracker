import 'dotenv/config';
import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import aiInsightsRoutes from "./routes/aiInsightsRoutes.js";
import transporter from "./utils/emailService.js";
const app = express();
app.use(cors());
app.use(express.json());

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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
