const checkAndSaveBudgetCompletion = (userEmail) => {
  if (!userEmail) return;
  
  const budgets = JSON.parse(localStorage.getItem(`budgets_${userEmail}`) || '[]');
  const transactions = JSON.parse(localStorage.getItem(`transactions_${userEmail}`) || '[]');
  const completions = JSON.parse(localStorage.getItem(`budgetCompletions_${userEmail}`) || '{}');
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  budgets.forEach(budget => {
    const budgetId = budget.id || budget.name;
    
    if (budget.monthKey) {
      const [year, month] = budget.monthKey.split('-').map(Number);
      const budgetMonth = month - 1;
      
      if (currentYear > year || (currentYear === year && currentMonth > budgetMonth)) {
        const completionKey = `${budgetId}_${year}-${String(month).padStart(2, '0')}`;
        
        if (!completions[completionKey]) {
          const monthExpenses = transactions.filter(t => {
            const tDate = new Date(t.date);
            return t.type === 'expense' &&
                   tDate.getFullYear() === year &&
                   tDate.getMonth() === budgetMonth &&
                   (budget.category ? t.category === budget.category : true) &&
                   (!budget.id || t.budgetId === budget.id);
          });
          
          const totalExpenses = monthExpenses.reduce((sum, t) => sum + (t.amount || 0), 0);
          const budgetAmount = budget.items 
            ? budget.items.reduce((sum, item) => sum + (item.amount || 0), 0)
            : (budget.amount || 0);
          
          completions[completionKey] = {
            budgetId: budgetId,
            category: budget.category || budget.items?.map(i => i.category).join(','),
            period: `${year}-${String(month).padStart(2, '0')}`,
            budgetAmount: budgetAmount,
            spentAmount: totalExpenses,
            stayedUnder: totalExpenses <= budgetAmount,
            completedAt: new Date().toISOString()
          };
        }
      }
    }
    
    if (budget.dueDate && budget.lastExpenseReset) {
      const dueDate = new Date(budget.dueDate);
      const resetDate = new Date(budget.lastExpenseReset);
      
      if (resetDate > dueDate) {
        const completionKey = `${budgetId}_due_${budget.dueDate}`;
        
        if (!completions[completionKey]) {
          const periodExpenses = transactions.filter(t => {
            const tDate = new Date(t.date);
            return t.type === 'expense' &&
                   tDate <= dueDate &&
                   (budget.category ? t.category === budget.category : true) &&
                   (!budget.id || t.budgetId === budget.id);
          });
          
          const totalExpenses = periodExpenses.reduce((sum, t) => sum + (t.amount || 0), 0);
          const budgetAmount = budget.items 
            ? budget.items.reduce((sum, item) => sum + (item.amount || 0), 0)
            : (budget.amount || 0);
          
          completions[completionKey] = {
            budgetId: budgetId,
            category: budget.category || budget.items?.map(i => i.category).join(','),
            period: `due_${budget.dueDate}`,
            budgetAmount: budgetAmount,
            spentAmount: totalExpenses,
            stayedUnder: totalExpenses <= budgetAmount,
            completedAt: new Date().toISOString()
          };
        }
      }
    }
  });
  
  localStorage.setItem(`budgetCompletions_${userEmail}`, JSON.stringify(completions));
  return completions;
};

export const calculateBadgeProgress = (badge, userEmail) => {
  if (!userEmail) {
    return { current: 0, target: 1, unlocked: false };
  }

  const transactions = JSON.parse(localStorage.getItem(`transactions_${userEmail}`) || '[]');
  const budgets = JSON.parse(localStorage.getItem(`budgets_${userEmail}`) || '[]');
  const archivedBudgets = JSON.parse(localStorage.getItem(`archivedBudgets_${userEmail}`) || '[]');
  const allBudgets = [...budgets, ...archivedBudgets];
  
  const completions = checkAndSaveBudgetCompletion(userEmail);
  
  let current = 0;
  let target = badge.requirement.count;
  let unlocked = false;

  switch (badge.requirement.type) {
    case 'expense':
      current = transactions.filter(t => t.type === 'expense').length;
      break;

    case 'income':
      current = transactions.filter(t => t.type === 'income').length;
      break;

    case 'budget':
      const singleBudgets = allBudgets.filter(b => !b.items);
      current = singleBudgets.length;
      break;

    case 'multi-budget':
      const multiBudgets = allBudgets.filter(b => b.items && b.items.length > 0);
      current = multiBudgets.length;
      break;

    case 'category-budget':
      const category = badge.requirement.category;
      
      if (completions) {
        const categoryCompletions = Object.values(completions).filter(c => 
          c.category && c.category.includes(category) && c.stayedUnder
        );
        
        if (categoryCompletions.length > 0) {
          current = 1;
        }
      }
      
      if (current === 0) {
        const categoryBudgets = budgets.filter(b => 
          b.category === category || 
          (b.items && b.items.some(item => item.category === category))
        );
        
        if (categoryBudgets.length > 0) {
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          
          const categoryExpenses = transactions.filter(t => {
            const tDate = new Date(t.date);
            return t.type === 'expense' && 
                   t.category === category &&
                   tDate.getMonth() === currentMonth &&
                   tDate.getFullYear() === currentYear;
          });
          
          const totalExpense = categoryExpenses.reduce((sum, t) => sum + (t.amount || 0), 0);
          const budgetAmount = categoryBudgets.reduce((sum, b) => {
            if (b.items) {
              const item = b.items.find(i => i.category === category);
              return sum + (item?.amount || 0);
            }
            return sum + (b.amount || 0);
          }, 0);

          if (budgetAmount > 0 && totalExpense <= budgetAmount) {
            current = 1;
          }
        }
      }
      break;

    case 'under-budget-month':
      
      if (completions) {
        const monthlyCompletions = {};
        
        Object.values(completions).forEach(c => {
          if (c.period && c.period !== 'current') {
            if (!monthlyCompletions[c.period]) {
              monthlyCompletions[c.period] = { total: 0, stayedUnder: 0 };
            }
            monthlyCompletions[c.period].total++;
            if (c.stayedUnder) {
              monthlyCompletions[c.period].stayedUnder++;
            }
          }
        });
        
        for (const period in monthlyCompletions) {
          const month = monthlyCompletions[period];
          if (month.total > 0 && month.total === month.stayedUnder) {
            current = 1;
            break;
          }
        }
      }
      
      if (current === 0) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyExpenses = transactions.filter(t => {
          const date = new Date(t.date);
          return t.type === 'expense' && 
                 date.getMonth() === currentMonth && 
                 date.getFullYear() === currentYear;
        });
        
        const totalMonthlyExpense = monthlyExpenses.reduce((sum, t) => sum + (t.amount || 0), 0);
        const totalBudgetAmount = budgets.reduce((sum, b) => {
          if (b.items) {
            return sum + b.items.reduce((itemSum, item) => itemSum + (item.amount || 0), 0);
          }
          return sum + (b.amount || 0);
        }, 0);
        
        if (totalBudgetAmount > 0 && totalMonthlyExpense <= totalBudgetAmount) {
          current = 1;
        }
      }
      break;

    default:
      current = 0;
  }

  unlocked = current >= target;

  const badgeProgress = JSON.parse(localStorage.getItem(`badgeProgress_${userEmail}`) || '{}');
  if (unlocked && !badgeProgress[badge.id]) {
    badgeProgress[badge.id] = {
      unlockedAt: new Date().toISOString(),
      progress: { current, target, unlocked }
    };
    localStorage.setItem(`badgeProgress_${userEmail}`, JSON.stringify(badgeProgress));
  }

  return { current, target, unlocked };
};

export const getBadgeStats = (userEmail) => {
  if (!userEmail) {
    return { total: 0, unlocked: 0, inProgress: 0 };
  }

  const badgeProgress = JSON.parse(localStorage.getItem(`badgeProgress_${userEmail}`) || '{}');
  const unlockedCount = Object.keys(badgeProgress).length;

  return {
    total: 19,
    unlocked: unlockedCount,
    inProgress: 0
  };
};

export const checkNewBadges = (userEmail, badgeDefinitions) => {
  if (!userEmail || !badgeDefinitions) return [];
  
  const shownBadges = JSON.parse(localStorage.getItem(`shownBadges_${userEmail}`) || '[]');
  
  const currentProgress = JSON.parse(localStorage.getItem(`badgeProgress_${userEmail}`) || '{}');
  
  const newlyUnlocked = [];
  
  badgeDefinitions.forEach(badge => {
    const progress = calculateBadgeProgress(badge, userEmail);
    const isInProgress = !!currentProgress[badge.id];
    const isShown = shownBadges.includes(badge.id);
    
    if (progress.unlocked && !isShown) {
      newlyUnlocked.push(badge);
    }
  });
  
  return newlyUnlocked;
};

export const markBadgeAsShown = (userEmail, badgeId) => {
  if (!userEmail || !badgeId) return;
  
  const shownBadges = JSON.parse(localStorage.getItem(`shownBadges_${userEmail}`) || '[]');
  
  if (!shownBadges.includes(badgeId)) {
    shownBadges.push(badgeId);
    localStorage.setItem(`shownBadges_${userEmail}`, JSON.stringify(shownBadges));
  }
};

export const clearUserBadgeData = (userEmail) => {
  if (!userEmail) return;
  
  localStorage.removeItem(`badgeProgress_${userEmail}`);
  localStorage.removeItem(`budgetCompletions_${userEmail}`);
  localStorage.removeItem(`shownBadges_${userEmail}`);
};

export const getAllBadgeProgress = (userEmail) => {
  if (!userEmail) return {};
  
  return JSON.parse(localStorage.getItem(`badgeProgress_${userEmail}`) || '{}');
};

export const checkBudgetCompletions = checkAndSaveBudgetCompletion;
