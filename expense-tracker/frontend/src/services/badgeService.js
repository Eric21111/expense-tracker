const checkAndSaveBudgetCompletion = async (userEmail) => {
  if (!userEmail) return {};
  
  const budgets = JSON.parse(localStorage.getItem(`budgets_${userEmail}`) || '[]');
  let transactions = [];
  try {
    const response = await fetch('http://localhost:5000/transactions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': userEmail
      }
    });
    if (response.ok) {
      const data = await response.json();
      transactions = data.transactions || [];
    }
  } catch (error) {
    console.error('Error fetching transactions for completion check:', error);
  }
  
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

export const calculateBadgeProgress = async (badge, userEmail) => {
  if (!userEmail) {
    return { current: 0, target: 1, unlocked: false };
  }

  let transactions = [];
  try {
    const response = await fetch('http://localhost:5000/transactions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': userEmail
      }
    });
    if (response.ok) {
      const data = await response.json();
      transactions = data.transactions || [];
    }
  } catch (error) {
    console.error('Error fetching transactions for badge calculation:', error);
    transactions = [];
  }
  
  const budgets = JSON.parse(localStorage.getItem(`budgets_${userEmail}`) || '[]');
  const archivedBudgets = JSON.parse(localStorage.getItem(`archivedBudgets_${userEmail}`) || '[]');
  const allBudgets = [...budgets, ...archivedBudgets];
  
  const completions = await checkAndSaveBudgetCompletion(userEmail);
  
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

export const getBadgeStats = async (userEmail) => {
  if (!userEmail) {
    return { total: 0, unlocked: 0, inProgress: 0 };
  }

  try {
    const response = await fetch('http://localhost:5000/api/badges/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': userEmail
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.stats;
    }
  } catch (error) {
    console.error('Error fetching badge stats:', error);
  }

  return { total: 19, unlocked: 0, inProgress: 0 };
};

export const checkNewBadges = async (userEmail, badgeDefinitions) => {
  if (!userEmail || !badgeDefinitions) return [];
  
  let shownBadges = [];
  try {
    const shownResponse = await fetch('http://localhost:5000/api/badges/shown', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': userEmail
      }
    });
    if (shownResponse.ok) {
      const data = await shownResponse.json();
      shownBadges = data.shownBadges || [];
    }
  } catch (error) {
    console.error('Error fetching shown badges:', error);
  }
  
  const newlyUnlocked = [];
  
  for (const badge of badgeDefinitions) {
    const progress = await calculateBadgeProgress(badge, userEmail);
    const isShown = shownBadges.includes(badge.id);
    
    if (progress.unlocked && !isShown) {
      newlyUnlocked.push(badge);
      
      try {
        await fetch('http://localhost:5000/api/badges/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-email': userEmail
          },
          body: JSON.stringify({
            badgeId: badge.id,
            name: badge.name,
            unlocked: true,
            progress: progress
          })
        });
      } catch (error) {
        console.error('Error saving badge progress:', error);
      }
    }
  }
  
  return newlyUnlocked;
};

export const markBadgeAsShown = async (userEmail, badgeId) => {
  if (!userEmail || !badgeId) return;
  
  try {
    await fetch('http://localhost:5000/api/badges/mark-shown', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': userEmail
      },
      body: JSON.stringify({ badgeId })
    });
  } catch (error) {
    console.error('Error marking badge as shown:', error);
  }
};

export const clearUserBadgeData = (userEmail) => {
  if (!userEmail) return;
  
  localStorage.removeItem(`badgeProgress_${userEmail}`);
  localStorage.removeItem(`budgetCompletions_${userEmail}`);
  localStorage.removeItem(`shownBadges_${userEmail}`);
};

export const getAllBadgeProgress = async (userEmail) => {
  if (!userEmail) return {};
  
  try {
    const response = await fetch('http://localhost:5000/api/badges', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': userEmail
      }
    });

    if (response.ok) {
      const data = await response.json();
      const badgeProgress = {};
      (data.badges || []).forEach(badge => {
        badgeProgress[badge.badgeId] = {
          unlocked: badge.unlocked,
          unlockedAt: badge.unlockedAt,
          progress: badge.progress
        };
      });
      return badgeProgress;
    }
  } catch (error) {
    console.error('Error fetching badge progress:', error);
  }
  
  return {};
};

export const checkBudgetCompletions = checkAndSaveBudgetCompletion;
