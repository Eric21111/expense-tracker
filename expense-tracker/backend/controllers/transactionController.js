import Transaction from "../models/Transaction.js";

export const createTransaction = async (req, res) => {
  try {
    const { type, category, amount, account, date, description, photos, icon, bgGradient, budgetId } = req.body;
    const userId = req.userId;

    const transaction = new Transaction({
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
      budgetId
    });

    await transaction.save();
    res.status(201).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const userId = req.userId;
    const { type, startDate, endDate, category } = req.query;

    const filter = { userId };
    
    if (type && type !== "all") {
      filter.type = type;
    }
    
    if (category) {
      filter.category = category;
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
