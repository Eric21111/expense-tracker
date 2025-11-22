import { format } from 'date-fns';

const API_BASE_URL = "http:

const getUserInfo = () => {
  try {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
  } catch (error) {
    console.error("Error getting user info:", error);
  }
  return null;
};

const getHeaders = () => {
  const user = getUserInfo();
  return {
    "Content-Type": "application/json",
    "x-user-email": user?.email || ""
  };
};

export const createBudget = async (budgetData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/budgets`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(budgetData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create budget");
    }

    window.dispatchEvent(new Event('budgetCreated'));
    
    return data;
  } catch (error) {
    console.error("Error creating budget:", error);
    throw error;
  }
};

export const getBudgets = async (includeArchived = false) => {
  try {
    const params = includeArchived ? "?includeArchived=true" : "";
    const response = await fetch(`${API_BASE_URL}/budgets${params}`, {
      method: "GET",
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch budgets");
    }

    return data.budgets || [];
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw error;
  }
};

export const getBudgetById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: "GET",
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch budget");
    }

    return data.budget;
  } catch (error) {
    console.error("Error fetching budget:", error);
    throw error;
  }
};

export const updateBudget = async (id, updates) => {
  try {
    const url = Array.isArray(updates) 
      ? `${API_BASE_URL}/budgets/bulk/update` 
      : `${API_BASE_URL}/budgets/${id}`;
      
    const response = await fetch(url, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to update budget");
    }

    window.dispatchEvent(new Event('budgetUpdated'));
    
    return data;
  } catch (error) {
    console.error("Error updating budget:", error);
    throw error;
  }
};

export const deleteBudget = async (id, permanent = false) => {
  try {
    const params = permanent ? "?permanent=true" : "";
    const response = await fetch(`${API_BASE_URL}/budgets/${id}${params}`, {
      method: "DELETE",
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete budget");
    }

    window.dispatchEvent(new Event('budgetDeleted'));
    
    return data;
  } catch (error) {
    console.error("Error deleting budget:", error);
    throw error;
  }
};

export const archiveBudgetGroup = async (groupId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/budgets/archive-group/${groupId}`, {
      method: "PUT",
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to archive budget group");
    }

    window.dispatchEvent(new Event('budgetDeleted'));
    
    return data;
  } catch (error) {
    console.error("Error archiving budget group:", error);
    throw error;
  }
};

export const restoreBudget = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/budgets/restore/${id}`, {
      method: "PUT",
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to restore budget");
    }

    window.dispatchEvent(new Event('budgetUpdated'));
    
    return data;
  } catch (error) {
    console.error("Error restoring budget:", error);
    throw error;
  }
};

export const getArchivedBudgets = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/budgets/archived`, {
      method: "GET",
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch archived budgets");
    }

    return data.budgets || [];
  } catch (error) {
    console.error("Error fetching archived budgets:", error);
    throw error;
  }
};

export const bulkCreateBudgets = async (budgets) => {
  try {
    const response = await fetch(`${API_BASE_URL}/budgets/bulk`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ budgets })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to bulk create budgets");
    }

    return data;
  } catch (error) {
    console.error("Error bulk creating budgets:", error);
    throw error;
  }
};

export const resetMonthlyBudgets = async () => {
  try {
    const monthKey = format(new Date(), 'yyyy-MM');
    
    const response = await fetch(`${API_BASE_URL}/budgets/reset-monthly`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ monthKey })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to reset monthly budgets");
    }

    return data;
  } catch (error) {
    console.error("Error resetting monthly budgets:", error);
    throw error;
  }
};

export const loadBudgetsWithReset = async (userEmail) => {
  try {
    const budgets = await getBudgets();
    
    if (!budgets || budgets.length === 0) {
      return [];
    }

    const currentMonthKey = format(new Date(), 'yyyy-MM');
    const needsReset = budgets.some(b => b.monthKey && b.monthKey !== currentMonthKey);
    
    if (needsReset) {
      await resetMonthlyBudgets();
      
      return await getBudgets();
    }

    const processedBudgets = processDueDateResets(budgets);

    const hasChanges = processedBudgets.some((b, index) => 
      b.lastExpenseReset !== budgets[index].lastExpenseReset
    );
    
    if (hasChanges) {
      
      for (const budget of processedBudgets) {
        if (budget.lastExpenseReset && !budgets.find(b => b._id === budget._id)?.lastExpenseReset) {
          await updateBudget(budget._id, {
            lastExpenseReset: budget.lastExpenseReset,
            expenseResetDate: budget.expenseResetDate,
            previousDueDate: budget.previousDueDate,
            dueDate: budget.dueDate
          });
        }
      }
      return processedBudgets;
    }
    
    return budgets;
  } catch (error) {
    console.error("Error loading budgets with reset:", error);
    
    const savedBudgets = localStorage.getItem(`budgets_${userEmail}`);
    return savedBudgets ? JSON.parse(savedBudgets) : [];
  }
};

const processDueDateResets = (budgets) => {
  const now = new Date();
  
  return budgets.map(budget => {
    if (hasDueDatePassed(budget)) {
      const updatedBudget = {
        ...budget,
        lastExpenseReset: now.toISOString(),
        expenseResetDate: budget.dueDate,
        previousDueDate: budget.dueDate,
      };
      
      if (budget.autoRenew) {
        updatedBudget.dueDate = getNextDueDate(budget.dueDate);
      }
      
      return updatedBudget;
    }
    return budget;
  });
};

const hasDueDatePassed = (budget) => {
  if (!budget.dueDate) return false;
  
  const now = new Date();
  const dueDate = new Date(budget.dueDate);
  const lastReset = budget.lastExpenseReset ? new Date(budget.lastExpenseReset) : null;
  
  if (dueDate < now) {
    return !lastReset || lastReset < dueDate;
  }
  
  return false;
};

const getNextDueDate = (currentDueDate) => {
  const date = new Date(currentDueDate);
  date.setMonth(date.getMonth() + 1);
  return date.toISOString();
};

export const getCurrentMonthDisplay = () => {
  return format(new Date(), 'MMMM yyyy');
};

export const getResetNotification = (userEmail) => {
  const notification = localStorage.getItem(`budget_reset_${userEmail}`);
  if (!notification) return null;
  
  try {
    const resetData = JSON.parse(notification);
    const currentMonthKey = format(new Date(), 'yyyy-MM');
    
    return resetData.monthKey === currentMonthKey ? resetData : null;
  } catch (error) {
    return null;
  }
};

export const clearResetNotification = (userEmail) => {
  localStorage.removeItem(`budget_reset_${userEmail}`);
};

export const migrateBudgetsToDatabase = async () => {
  try {
    const user = getUserInfo();
    if (!user?.email) {
      throw new Error("User not logged in");
    }

    const dbBudgets = await getBudgets();
    if (dbBudgets.length > 0) {
      console.log("Budgets already exist in database");
      return { success: true, message: "Already migrated" };
    }

    const localBudgets = localStorage.getItem(`budgets_${user.email}`);
    if (!localBudgets) {
      console.log("No budgets in localStorage to migrate");
      return { success: true, message: "No budgets to migrate" };
    }
    
    const budgetsToMigrate = JSON.parse(localBudgets);

    const result = await bulkCreateBudgets(budgetsToMigrate);
    
    if (result.success) {
      
      localStorage.removeItem(`budgets_${user.email}`);
      console.log(`Successfully migrated ${result.budgets.length} budgets to database`);
    }
    
    return result;
  } catch (error) {
    console.error("Error migrating budgets:", error);
    throw error;
  }
};

export const saveBudgetsWithTracking = async (userEmail, budgets) => {
  try {
    
    console.log("saveBudgetsWithTracking called - using API");
    return true;
  } catch (error) {
    console.error("Error in saveBudgetsWithTracking:", error);
    return false;
  }
};
