import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  userEmail: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  label: {
    type: String,
    default: ""
  },
  name: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  icon: {
    type: String,
    default: ""
  },
  iconColor: {
    type: String,
    default: "#34A853"
  },
  gradient: {
    type: String,
    default: "from-green-400 to-green-500"
  },
  accountId: {
    type: String,
    default: null
  },
  dueDate: {
    type: Date,
    default: null
  },
  groupId: {
    type: String,
    default: null
  },
  budgetType: {
    type: String,
    enum: ["single", "multi", "Multi"],
    default: "single"
  },
  totalBudget: {
    type: Number,
    default: null
  },
  categoryCount: {
    type: Number,
    default: 1
  },
  monthKey: {
    type: String,
    default: null
  },
  lastResetDate: {
    type: Date,
    default: null
  },
  lastExpenseReset: {
    type: Date,
    default: null
  },
  expenseResetDate: {
    type: Date,
    default: null
  },
  previousDueDate: {
    type: Date,
    default: null
  },
  autoRenew: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  archivedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

BudgetSchema.index({ userId: 1, isActive: 1 });
BudgetSchema.index({ userEmail: 1, isActive: 1 });
BudgetSchema.index({ groupId: 1 });

const Budget = mongoose.model("Budget", BudgetSchema);

export default Budget;
