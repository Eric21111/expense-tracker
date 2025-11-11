import express from "express";
import { 
  createTransaction, 
  getTransactions, 
  getTransactionById, 
  updateTransaction, 
  deleteTransaction,
  getTransactionSummary
} from "../controllers/transactionController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get transaction summary
router.get("/summary", getTransactionSummary);

// Get all transactions
router.get("/", getTransactions);

// Get a single transaction by ID
router.get("/:id", getTransactionById);

// Create a new transaction
router.post("/", createTransaction);

// Update a transaction
router.put("/:id", updateTransaction);

// Delete a transaction
router.delete("/:id", deleteTransaction);

export default router;
