import { isAfter, startOfMonth, format } from 'date-fns';

const getCurrentMonthKey = () => {
  return format(new Date(), 'yyyy-MM');
};

const shouldResetBudgets = (budgets) => {
  if (!budgets || budgets.length === 0) return false;

  const currentMonthKey = getCurrentMonthKey();
  const budgetMonthKey = budgets[0]?.monthKey;

  return budgetMonthKey && budgetMonthKey !== currentMonthKey;
};

const addMonthTracking = (budgets) => {
  const currentMonthKey = getCurrentMonthKey();
  return budgets.map(budget => ({
    ...budget,
    monthKey: currentMonthKey,
    lastResetDate: new Date().toISOString()
  }));
};

const resetBudgetAmounts = (budgets) => {
  const currentMonthKey = getCurrentMonthKey();
  return budgets.map(budget => ({
    ...budget,
    
    monthKey: currentMonthKey,
    lastResetDate: new Date().toISOString()
  }));
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
  return date.toISOString().split('T')[0];
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

const loadBudgetsWithReset = (userEmail) => {
  if (!userEmail) return [];

  const savedBudgets = localStorage.getItem(`budgets_${userEmail}`);
  if (!savedBudgets) return [];

  try {
    let budgets = JSON.parse(savedBudgets);
    
    budgets = processDueDateResets(budgets);
    let hasChanges = false;
    
    const dueDateResets = budgets.filter(b => b.lastExpenseReset && !JSON.parse(savedBudgets).find(sb => sb.id === b.id)?.lastExpenseReset);
    if (dueDateResets.length > 0) {
      hasChanges = true;
      console.log('Expenses reset for budgets with passed due dates:', dueDateResets.map(b => b.category));
    }
    
    if (shouldResetBudgets(budgets)) {
      console.log('Budgets reset for new month:', getCurrentMonthKey());
      const resetBudgets = resetBudgetAmounts(budgets);
      
      localStorage.setItem(`budgets_${userEmail}`, JSON.stringify(resetBudgets));
      
      const resetNotification = {
        date: new Date().toISOString(),
        monthKey: getCurrentMonthKey(),
        resetCount: budgets.length
      };
      localStorage.setItem(`budget_reset_${userEmail}`, JSON.stringify(resetNotification));
      
      return resetBudgets;
    } else {
      const budgetsWithTracking = budgets.some(b => !b.monthKey) 
        ? addMonthTracking(budgets) 
        : budgets;
      
      if (hasChanges || budgets !== budgetsWithTracking) {
        localStorage.setItem(`budgets_${userEmail}`, JSON.stringify(budgetsWithTracking));
      }
      
      return budgetsWithTracking;
    }
  } catch (error) {
    console.error('Error loading budgets:', error);
    return [];
  }
};

const saveBudgetsWithTracking = (userEmail, budgets) => {
  if (!userEmail) return;
  
  const budgetsWithTracking = addMonthTracking(budgets);
  localStorage.setItem(`budgets_${userEmail}`, JSON.stringify(budgetsWithTracking));
};

const getResetNotification = (userEmail) => {
  if (!userEmail) return null;
  
  const notification = localStorage.getItem(`budget_reset_${userEmail}`);
  if (!notification) return null;
  
  try {
    const resetData = JSON.parse(notification);
    const currentMonthKey = getCurrentMonthKey();
    
    return resetData.monthKey === currentMonthKey ? resetData : null;
  } catch (error) {
    return null;
  }
};

const clearResetNotification = (userEmail) => {
  if (!userEmail) return;
  localStorage.removeItem(`budget_reset_${userEmail}`);
};

const getCurrentMonthDisplay = () => {
  return format(new Date(), 'MMMM yyyy');
};

export { 
  loadBudgetsWithReset, 
  saveBudgetsWithTracking, 
  getResetNotification, 
  clearResetNotification, 
  getCurrentMonthDisplay 
};
