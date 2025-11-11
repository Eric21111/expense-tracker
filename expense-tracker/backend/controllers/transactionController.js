import Transaction from "../models/Transaction.js";

export const createTransaction = async (req, res) => {
  try {
    const { type, category, amount, account, date, description, photos, icon, bgGradient } = req.body;
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
      bgGradient
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

    const transactions = await Transaction.find(filter).sort({ date: -1 });
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

    const filter = { userId };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter);

    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      totalBalance: 0,
      transactionCount: transactions.length,
      averageDailySpending: 0
    };

    transactions.forEach(transaction => {
      if (transaction.type === "income") {
        summary.totalIncome += transaction.amount;
      } else {
        summary.totalExpense += transaction.amount;
      }
    });

    summary.totalBalance = summary.totalIncome - summary.totalExpense;

    if (transactions.length > 0) {
      const dates = transactions.map(t => new Date(t.date));
      const firstTransactionDate = new Date(Math.min(...dates));
      firstTransactionDate.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let effectiveEnd = today;
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        if (end < today) {
          effectiveEnd = end;
        }
      }
      
      const daysDifference = Math.floor((effectiveEnd - firstTransactionDate) / (1000 * 60 * 60 * 24)) + 1;
      summary.averageDailySpending = daysDifference > 0 ? summary.totalExpense / daysDifference : 0;
    }

    res.status(200).json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
