import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import Account from "../models/Account.js";
import mongoose from "mongoose";

export const createTransaction = async (req, res) => {
  try {
    const { type, category, amount, account, date, description, photos, icon, bgGradient, budgetId, accountId } = req.body;
    const userId = req.userId;

    console.log('🟢 BACKEND: Creating transaction');
    console.log('  Category:', category);
    console.log('  Amount:', amount);
    console.log('  BudgetId received:', budgetId);
    console.log('  AccountId received:', accountId);

    const transactionData = {
      userId,
      type,
      category,
      amount,
      account,
      date,
      description,
      photos,
      icon,
      bgGradient,
      budgetId,
      accountId 
    };

    let budget = null;
    if (budgetId && mongoose.Types.ObjectId.isValid(budgetId)) {
      transactionData.budgetRef = budgetId;

      budget = await Budget.findOne({ _id: budgetId, userId });
      if (budget) {
        console.log('✅ Budget found:', { _id: budget._id, category: budget.category, accountId: budget.accountId });
      } else {
        console.warn(`❌ Budget ${budgetId} not found for user ${userId}`);
      }
    }

    const transaction = new Transaction(transactionData);
    await transaction.save();

    console.log('✅ Transaction saved:', { _id: transaction._id, budgetId: transaction.budgetId, category: transaction.category });

    let targetAccountId = accountId;
    if (!targetAccountId && budget && budget.accountId) {
      targetAccountId = budget.accountId;
    }

    if (targetAccountId) {
      try {
        console.log('🔍 Looking for account with ID:', targetAccountId);

        const accountToUpdate = await Account.findById(targetAccountId);

        if (accountToUpdate) {
          const oldBalance = accountToUpdate.balance;
          if (type === 'expense') {
            accountToUpdate.balance -= amount;
            console.log('💸 DEDUCTED from account:', {
              accountId: targetAccountId,
              accountName: accountToUpdate.name,
              amount,
              oldBalance,
              newBalance: accountToUpdate.balance
            });
          } else if (type === 'income') {
            accountToUpdate.balance += amount;
            console.log('💰 ADDED to account:', {
              accountId: targetAccountId,
              accountName: accountToUpdate.name,
              amount,
              oldBalance,
              newBalance: accountToUpdate.balance
            });
          }
          await accountToUpdate.save();
          console.log('✅ Account balance updated successfully');
        } else {
          console.error(`❌ Account not found with ID: ${targetAccountId}`);
        }
      } catch (accountError) {
        console.error('❌ Error updating account balance:', accountError.message);
        console.error('Stack:', accountError.stack);
      }
    } else {
      if (!budget) {
        console.warn('⚠️ No budget found for transaction and no accountId provided');
      } else if (!budget.accountId) {
        console.warn('⚠️ Budget has no accountId:', { budgetId: budget._id, category: budget.category });
      }
    }

    res.status(201).json({ success: true, transaction });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const userId = req.userId;
    const { type, startDate, endDate, category, budgetId } = req.query;

    const filter = { userId };

    if (type && type !== "all") {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (budgetId) {
      filter.budgetId = budgetId;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter)
      .sort({ date: -1, createdAt: -1, _id: -1 });
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const transaction = await Transaction.findOne({ _id: id, userId });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const updates = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const transaction = await Transaction.findOneAndDelete({ _id: id, userId });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({ success: true, message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransactionSummary = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    let query = { userId };
    let dateStart = startDate ? new Date(startDate) : null;
    let dateEnd = endDate ? new Date(endDate) : null;

    if (dateStart && dateEnd) {
      query.date = {
        $gte: dateStart,
        $lte: dateEnd,
      };
    }

    const transactions = await Transaction.find(query);

    const summary = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "expense") {
          acc.totalExpense += transaction.amount;
        } else if (transaction.type === "income") {
          acc.totalIncome += transaction.amount;
        }
        return acc;
      },
      { totalExpense: 0, totalIncome: 0 }
    );

    summary.transactionCount = transactions.length;

    const expenseTransactions = transactions.filter(t => t.type === "expense");

    if (expenseTransactions.length > 0) {
      const uniqueDates = new Set();

      expenseTransactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        uniqueDates.add(dateString);
      });

      const uniqueDaysWithTransactions = uniqueDates.size;

      summary.averageDailySpending = uniqueDaysWithTransactions > 0
        ? summary.totalExpense / uniqueDaysWithTransactions
        : 0;

      summary.daysCalculated = uniqueDaysWithTransactions;
      summary.uniqueDates = Array.from(uniqueDates).sort();

      console.log('Average Daily Spending Calculation:', {
        totalExpense: summary.totalExpense,
        uniqueDaysWithTransactions,
        uniqueDates: Array.from(uniqueDates).sort(),
        average: summary.averageDailySpending,
        explanation: `${summary.totalExpense} ÷ ${uniqueDaysWithTransactions} unique days = ${summary.averageDailySpending}`
      });
    } else {
      summary.averageDailySpending = 0;
      summary.daysCalculated = 0;
      summary.uniqueDates = [];
    }

    summary.averageDailySpending = Math.round(summary.averageDailySpending * 100) / 100;

    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("Error fetching transaction summary:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearDemoTransactions = async (req, res) => {
  try {
    const result = await Transaction.deleteMany({
      $or: [
        { amount: { $in: [2000, 5000, 10000] } },
        {
          $and: [
            { amount: { $gte: 1000 } },
            { amount: { $mod: [1000, 0] } }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: `Cleared ${result.deletedCount} demo transactions`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Error clearing demo transactions:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
