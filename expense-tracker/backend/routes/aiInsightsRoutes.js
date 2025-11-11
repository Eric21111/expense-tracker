import express from "express";
import { getAIInsights } from "../controllers/aiInsightsController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, getAIInsights);

export default router;
