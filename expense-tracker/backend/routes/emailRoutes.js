import express from 'express';
import { sendBudgetAlert, sendWelcome } from '../controllers/emailController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/budget-alert', authenticate, sendBudgetAlert);

router.post('/welcome', authenticate, sendWelcome);

export default router;
