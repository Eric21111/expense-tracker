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

router.use(authenticate);

router.get("/summary", getTransactionSummary);

router.get("/", getTransactions);

router.get("/:id", getTransactionById);

router.post("/", createTransaction);

router.put("/:id", updateTransaction);

router.delete("/:id", deleteTransaction);

export default router;
