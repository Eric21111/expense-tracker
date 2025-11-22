import Budget from "../models/Budget.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const createBudget = async (req, res) => {
  try {
    const userId = req.userId;
    const userEmail = req.headers['x-user-email'];
    const budgetData = req.body;

    if (!Array.isArray(budgetData)) {
      const budget = new Budget({
        ...budgetData,
        userId,
        userEmail
      });
      await budget.save();
      return res.status(201).json({ success: true, budget });
    }

    const budgets = await Promise.all(
      budgetData.map(async (data) => {
        const budget = new Budget({
          ...data,
          userId,
          userEmail
        });
        return await budget.save();
      })
    );

    res.status(201).json({ success: true, budgets });
  } catch (error) {
    console.error('Error creating budget:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBudgets = async (req, res) => {
  try {
    const userId = req.userId;
    const userEmail = req.headers['x-user-email'];
    const { includeArchived } = req.query;

    const filter = { 
      userId,
      isActive: includeArchived === 'true' ? { $in: [true, false] } : true 
    };

    const budgets = await Budget.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, budgets });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBudgetById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const budget = await Budget.findOne({ _id: id, userId });

    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    res.status(200).json({ success: true, budget });
  } catch (error) {
    console.error('Error fetching budget:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const updates = req.body;

    if (id && id !== 'bulk') {
      const budget = await Budget.findOneAndUpdate(
        { _id: id, userId },
        updates,
        { new: true, runValidators: true }
      );

      if (!budget) {
        return res.status(404).json({ success: false, message: "Budget not found" });
      }

      return res.status(200).json({ success: true, budget });
    }

    if (Array.isArray(updates)) {
      const updatedBudgets = await Promise.all(
        updates.map(async (update) => {
          const { _id, ...updateData } = update;
          return await Budget.findOneAndUpdate(
            { _id, userId },
            updateData,
            { new: true, runValidators: true }
          );
        })
      );

      return res.status(200).json({ success: true, budgets: updatedBudgets });
    }

    res.status(400).json({ success: false, message: "Invalid update request" });
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { permanent } = req.query;

    if (permanent === 'true') {
      const budget = await Budget.findOneAndDelete({ _id: id, userId });
      
      if (!budget) {
        return res.status(404).json({ success: false, message: "Budget not found" });
      }

      return res.status(200).json({ success: true, message: "Budget permanently deleted" });
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: id, userId },
      { 
        isActive: false, 
        archivedAt: new Date() 
      },
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    res.status(200).json({ success: true, budget, message: "Budget archived" });
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const archiveBudgetGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.userId;

    const result = await Budget.updateMany(
      { groupId, userId },
      { 
        isActive: false, 
        archivedAt: new Date() 
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: "No budgets found to archive" });
    }

    res.status(200).json({ 
      success: true, 
      message: `${result.modifiedCount} budgets archived`,
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error archiving budget group:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const restoreBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const budget = await Budget.findOneAndUpdate(
      { _id: id, userId },
      { 
        isActive: true, 
        archivedAt: null 
      },
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    res.status(200).json({ success: true, budget, message: "Budget restored" });
  } catch (error) {
    console.error('Error restoring budget:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getArchivedBudgets = async (req, res) => {
  try {
    const userId = req.userId;

    const budgets = await Budget.find({ 
      userId, 
      isActive: false,
      archivedAt: { $ne: null }
    }).sort({ archivedAt: -1 });

    res.status(200).json({ success: true, budgets });
  } catch (error) {
    console.error('Error fetching archived budgets:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bulkCreateBudgets = async (req, res) => {
  try {
    const userId = req.userId;
    const userEmail = req.headers['x-user-email'];
    const { budgets } = req.body;

    if (!Array.isArray(budgets)) {
      return res.status(400).json({ success: false, message: "Budgets must be an array" });
    }

    const existingCount = await Budget.countDocuments({ userId, isActive: true });
    if (existingCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "User already has budgets in database" 
      });
    }

    const createdBudgets = await Promise.all(
      budgets.map(async (budgetData) => {
        
        const { id, ...data } = budgetData;
        
        const budget = new Budget({
          ...data,
          userId,
          userEmail
        });
        return await budget.save();
      })
    );

    res.status(201).json({ 
      success: true, 
      budgets: createdBudgets,
      message: `Successfully migrated ${createdBudgets.length} budgets` 
    });
  } catch (error) {
    console.error('Error bulk creating budgets:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetMonthlyBudgets = async (req, res) => {
  try {
    const userId = req.userId;
    const { monthKey } = req.body;

    const result = await Budget.updateMany(
      { userId, isActive: true },
      { 
        monthKey,
        lastResetDate: new Date()
      }
    );

    res.status(200).json({ 
      success: true, 
      message: `Reset ${result.modifiedCount} budgets for new month`,
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error resetting monthly budgets:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBudgetWithTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const budget = await Budget.findOne({ _id: id, userId });
    
    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    const transactions = await Transaction.find({ 
      userId,
      budgetId: id.toString()
    }).sort({ date: -1, createdAt: -1 });

    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

    res.status(200).json({ 
      success: true, 
      budget: {
        ...budget.toObject(),
        transactions,
        totalSpent,
        remaining: budget.amount - totalSpent,
        percentageUsed: ((totalSpent / budget.amount) * 100).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error fetching budget with transactions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
