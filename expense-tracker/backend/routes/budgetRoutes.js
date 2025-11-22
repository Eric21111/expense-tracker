import express from "express";
import {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  archiveBudgetGroup,
  restoreBudget,
  getArchivedBudgets,
  bulkCreateBudgets,
  resetMonthlyBudgets,
  getBudgetWithTransactions
} from "../controllers/budgetController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getBudgets);

router.get("/archived", getArchivedBudgets);

router.get("/:id", getBudgetById);

router.get("/:id/transactions", getBudgetWithTransactions);

router.post("/", createBudget);

router.post("/bulk", bulkCreateBudgets);

router.post("/reset-monthly", resetMonthlyBudgets);

router.put("/:id", updateBudget);

router.put("/bulk/update", updateBudget);

router.put("/archive-group/:groupId", archiveBudgetGroup);

router.put("/restore/:id", restoreBudget);

router.delete("/:id", deleteBudget);

export default router;
