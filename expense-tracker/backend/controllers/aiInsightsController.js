import Transaction from "../models/Transaction.js";

const generateFallbackInsights = (totalExpense, totalIncome, categorySpending, budgets, transactions, currency = 'PHP') => {
  const insights = [];

  const getCurrencySymbol = (curr) => {
    const symbols = {
      'PHP': '₱',
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    };
    return symbols[curr] || curr;
  };

  const exchangeRates = {
    'PHP': 1,
    'USD': 0.018,
    'EUR': 0.017,
    'GBP': 0.014
  };

  const convertAmount = (amount, fromCurrency = 'PHP', toCurrency = currency) => {
    if (fromCurrency === toCurrency) return amount;
    const rate = exchangeRates[toCurrency] || 1;
    return amount * rate;
  };

  const calculateBudgetSpent = (budgetId, category, isMultiBudget, groupId) => {
    let spent = 0;

    if (isMultiBudget && groupId) {
      const groupSpecificExpenses = transactions.filter(t =>
        t.type === 'expense' &&
        t.budgetId && t.budgetId === groupId &&
        t.category.toLowerCase() === category?.toLowerCase()
      );
      const unassignedExpenses = transactions.filter(t =>
        t.type === 'expense' &&
        !t.budgetId &&
        t.category.toLowerCase() === category?.toLowerCase()
      );
      spent = groupSpecificExpenses.reduce((sum, t) => sum + t.amount, 0) +
        unassignedExpenses.reduce((sum, t) => sum + t.amount, 0);
    } else {
      const budgetSpecificExpenses = transactions.filter(t =>
        t.type === 'expense' &&
        t.budgetId &&
        (t.budgetId === budgetId?.toString() || t.budgetId === budgetId)
      );
      const unassignedExpenses = transactions.filter(t =>
        t.type === 'expense' &&
        !t.budgetId &&
        t.category.toLowerCase() === category?.toLowerCase()
      );
      spent = budgetSpecificExpenses.reduce((sum, t) => sum + t.amount, 0) +
        unassignedExpenses.reduce((sum, t) => sum + t.amount, 0);
    }

    return spent;
  };

  let totalBudget = 0;
  let actualTotalSpent = 0;
  const processedGroups = new Set();

  budgets.forEach(budget => {
    if (budget.groupId && !processedGroups.has(budget.groupId)) {
      const groupBudgets = budgets.filter(b => b.groupId === budget.groupId);
      const budgetAmount = budget.totalBudget || groupBudgets.reduce((sum, b) => sum + b.amount, 0);
      totalBudget += budgetAmount;

      const totalSpent = groupBudgets.reduce((sum, b) => {
        return sum + calculateBudgetSpent(b.id || b.groupId, b.category, true, b.groupId);
      }, 0);
      actualTotalSpent += totalSpent;

      processedGroups.add(budget.groupId);
    } else if (!budget.groupId) {
      totalBudget += budget.amount;
      const budgetId = budget.id || budget.groupId;
      const spent = calculateBudgetSpent(budgetId, budget.category, false, null);
      actualTotalSpent += spent;
    }
  });

  const overallPercentage = totalBudget > 0 ? ((actualTotalSpent / totalBudget) * 100).toFixed(0) : 0;

  if (budgets.length > 0) {
    if (overallPercentage > 100) {
      insights.push({
        type: "warning",
        title: "Over Budget!",
        message: `You've exceeded your total budget by ${(overallPercentage - 100)}%. Review your spending immediately.`
      });
    } else if (overallPercentage > 80) {
      insights.push({
        type: "warning",
        title: "Budget Alert",
        message: `You've used ${overallPercentage}% of your budget. Monitor your remaining expenses carefully.`
      });
    } else if (overallPercentage > 0) {
      insights.push({
        type: "success",
        title: "Good Budget Management",
        message: `You've used ${overallPercentage}% of your budget. Keep tracking your expenses!`
      });
    }

    const processedMultiBudgets = new Set();
    const overBudgetItems = [];

    budgets.forEach(budget => {
      if (budget.groupId && processedMultiBudgets.has(budget.groupId)) {
        return;
      }

      if (budget.groupId) {
        const groupBudgets = budgets.filter(b => b.groupId === budget.groupId);
        const totalBudgetAmount = budget.totalBudget || groupBudgets.reduce((sum, b) => sum + b.amount, 0);

        const totalSpent = groupBudgets.reduce((sum, b) => {
          return sum + calculateBudgetSpent(b.id || b.groupId, b.category, true, b.groupId);
        }, 0);

        if (totalSpent > totalBudgetAmount) {
          overBudgetItems.push({
            name: budget.name || 'Multiple Categories',
            isMulti: true,
            spent: totalSpent,
            budget: totalBudgetAmount
          });
        }
        processedMultiBudgets.add(budget.groupId);
      } else {
        const budgetId = budget.id || budget.groupId;
        const spent = calculateBudgetSpent(budgetId, budget.category, false, null);
        if (spent > budget.amount) {
          overBudgetItems.push({
            name: budget.category,
            isMulti: false,
            spent: spent,
            budget: budget.amount
          });
        }
      }
    });

    if (overBudgetItems.length > 0) {
      const item = overBudgetItems[0];
      const budgetType = item.isMulti ? 'shared budget' : 'budget';
      const exceededAmount = convertAmount(item.spent - item.budget);
      insights.push({
        type: "warning",
        title: item.isMulti ? "Shared Budget Exceeded" : "Category Over Budget",
        message: `${item.name} ${budgetType} exceeded by ${getCurrencySymbol(currency)}${exceededAmount.toFixed(0)}. Consider reducing expenses.`
      });
    }
  } else {
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    if (totalExpense > totalIncome && totalIncome > 0) {
      insights.push({
        type: "warning",
        title: "Spending Alert",
        message: "Your expenses exceed your income. Consider creating budgets to better manage your finances."
      });
    } else if (savingsRate > 0) {
      insights.push({
        type: "success",
        title: "Good Progress!",
        message: `You're saving ${savingsRate.toFixed(0)}% of your income. Try setting category budgets for better control.`
      });
    }
  }

  let topSpendingCategory = null;
  let maxSpending = 0;

  budgets.forEach(budget => {
    if (!budget.groupId || !processedGroups.has(budget.groupId)) {
      const budgetId = budget.id || budget.groupId;
      const spent = budget.groupId
        ? calculateBudgetSpent(budgetId, budget.category, true, budget.groupId)
        : calculateBudgetSpent(budgetId, budget.category, false, null);

      if (spent > maxSpending) {
        maxSpending = spent;
        topSpendingCategory = {
          category: budget.category,
          spent: spent,
          budget: budget,
          isMultiBudget: !!budget.groupId
        };
      }
    }
  });

  Object.entries(categorySpending).forEach(([category, amount]) => {
    const hasBudget = budgets.some(b => b.category.toLowerCase() === category.toLowerCase());
    if (!hasBudget && amount > maxSpending) {
      maxSpending = amount;
      topSpendingCategory = {
        category: category,
        spent: amount,
        budget: null,
        isMultiBudget: false
      };
    }
  });

  if (topSpendingCategory) {
    if (topSpendingCategory.budget) {
      const budgetAmount = topSpendingCategory.isMultiBudget
        ? topSpendingCategory.budget.totalBudget
        : topSpendingCategory.budget.amount;
      const percentage = ((topSpendingCategory.spent / budgetAmount) * 100).toFixed(0);
      const convertedSpent = convertAmount(topSpendingCategory.spent);
      const convertedBudget = convertAmount(budgetAmount);
      insights.push({
        type: "info",
        title: "Top Spending Category",
        message: `${topSpendingCategory.category} used ${percentage}% of its budget (${getCurrencySymbol(currency)}${convertedSpent.toFixed(0)} / ${getCurrencySymbol(currency)}${convertedBudget.toFixed(0)}).`
      });
    } else {
      const percentage = totalExpense > 0 ? ((topSpendingCategory.spent / totalExpense) * 100).toFixed(0) : 0;
      const convertedSpent = convertAmount(topSpendingCategory.spent);
      insights.push({
        type: "info",
        title: "Top Spending Category",
        message: `${topSpendingCategory.category} accounts for ${percentage}% of expenses (${getCurrencySymbol(currency)}${convertedSpent.toFixed(0)}). Consider setting a budget for this category.`
      });
    }
  }

  if (budgets.length === 0 && totalExpense > 0) {
    insights.push({
      type: "info",
      title: "Budget Recommendation",
      message: "Create category budgets to get better insights and control over your spending."
    });
  } else if (totalExpense === 0) {
    insights.push({
      type: "info",
      title: "Get Started",
      message: "Start tracking your expenses to receive personalized budget insights."
    });
  }

  return insights.slice(0, 3);
};

export const getAIInsights = async (req, res) => {
  try {
    const userId = req.userId;
    const { budgets, currency = 'PHP' } = req.body;

    const exchangeRates = {
      'PHP': 1,
      'USD': 0.018,
      'EUR': 0.017,
      'GBP': 0.014
    };

    const convertAmount = (amount, toCurrency = currency) => {
      if (toCurrency === 'PHP') return amount;
      const rate = exchangeRates[toCurrency] || 1;
      return amount * rate;
    };

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    if (transactions.length === 0) {
      return res.status(200).json({
        success: true,
        insights: [],
        noTransactions: true
      });
    }

    const categorySpending = {};
    let totalExpense = 0;
    let totalIncome = 0;

    transactions.forEach(t => {
      if (t.type === "expense") {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
        totalExpense += t.amount;
      } else {
        totalIncome += t.amount;
      }
    });

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key not configured"
      });
    }

    const calculateBudgetSpent = (budgetId, category, isMultiBudget, groupId, transactions) => {
      let spent = 0;

      if (isMultiBudget && groupId) {
        const groupSpecificExpenses = transactions.filter(t =>
          t.type === 'expense' &&
          t.budgetId && t.budgetId === groupId &&
          t.category.toLowerCase() === category?.toLowerCase()
        );
        const unassignedExpenses = transactions.filter(t =>
          t.type === 'expense' &&
          !t.budgetId &&
          t.category.toLowerCase() === category?.toLowerCase()
        );
        spent = groupSpecificExpenses.reduce((sum, t) => sum + t.amount, 0) +
          unassignedExpenses.reduce((sum, t) => sum + t.amount, 0);
      } else {
        const budgetSpecificExpenses = transactions.filter(t =>
          t.type === 'expense' &&
          t.budgetId &&
          (t.budgetId === budgetId?.toString() || t.budgetId === budgetId)
        );
        const unassignedExpenses = transactions.filter(t =>
          t.type === 'expense' &&
          !t.budgetId &&
          t.category.toLowerCase() === category?.toLowerCase()
        );
        spent = budgetSpecificExpenses.reduce((sum, t) => sum + t.amount, 0) +
          unassignedExpenses.reduce((sum, t) => sum + t.amount, 0);
      }

      return spent;
    };

    const budgetAnalysis = [];
    const processedGroups = new Set();
    let calculatedTotalBudget = 0;

    budgets?.forEach(budget => {
      if (budget.groupId && processedGroups.has(budget.groupId)) {
        return;
      }

      if (budget.groupId) {
        const groupBudgets = budgets.filter(b => b.groupId === budget.groupId);
        const totalBudgetAmount = budget.totalBudget || groupBudgets.reduce((sum, b) => sum + b.amount, 0);
        const categories = groupBudgets.map(b => b.category);

        const totalSpent = groupBudgets.reduce((sum, b) => {
          return sum + calculateBudgetSpent(b.id || b.groupId, b.category, true, b.groupId, transactions);
        }, 0);

        const percentage = totalBudgetAmount > 0 ? ((totalSpent / totalBudgetAmount) * 100).toFixed(1) : '0';

        const convertedSpent = convertAmount(totalSpent);
        const convertedBudget = convertAmount(totalBudgetAmount);
        budgetAnalysis.push(`${budget.name || 'Multiple Categories'} (shared budget for ${categories.join(', ')}): ${currency} ${convertedSpent.toFixed(0)} spent / ${currency} ${convertedBudget.toFixed(0)} budget (${percentage}% used)`);
        calculatedTotalBudget += totalBudgetAmount;
        processedGroups.add(budget.groupId);
      } else {
        const budgetId = budget.id || budget.groupId;
        const spent = calculateBudgetSpent(budgetId, budget.category, false, null, transactions);
        const percentage = budget.amount > 0 ? ((spent / budget.amount) * 100).toFixed(1) : '0';
        const convertedSpent = convertAmount(spent);
        const convertedBudget = convertAmount(budget.amount);
        budgetAnalysis.push(`${budget.category}: ${currency} ${convertedSpent.toFixed(0)} spent / ${currency} ${convertedBudget.toFixed(0)} budget (${percentage}% used)`);
        calculatedTotalBudget += budget.amount;
      }
    });

    Object.entries(categorySpending).forEach(([category, spent]) => {
      const hasBudget = budgets?.some(b => b.category.toLowerCase() === category.toLowerCase());
      if (!hasBudget) {
        const convertedSpent = convertAmount(spent);
        budgetAnalysis.push(`${category}: ${currency} ${convertedSpent.toFixed(0)} spent (no budget set)`);
      }
    });

    const categoryAnalysis = budgetAnalysis.join(", ");
    const totalBudget = calculatedTotalBudget;

    let actualTotalTrackedSpent = 0;
    const processedGroupsForTotal = new Set();

    budgets?.forEach(budget => {
      if (budget.groupId && !processedGroupsForTotal.has(budget.groupId)) {
        const groupBudgets = budgets.filter(b => b.groupId === budget.groupId);
        const totalSpent = groupBudgets.reduce((sum, b) => {
          return sum + calculateBudgetSpent(b.id || b.groupId, b.category, true, b.groupId, transactions);
        }, 0);
        actualTotalTrackedSpent += totalSpent;
        processedGroupsForTotal.add(budget.groupId);
      } else if (!budget.groupId) {
        const budgetId = budget.id || budget.groupId;
        const spent = calculateBudgetSpent(budgetId, budget.category, false, null, transactions);
        actualTotalTrackedSpent += spent;
      }
    });

    console.log('AI Insights Calculation:', {
      actualTotalTrackedSpent,
      totalBudget,
      percentage: totalBudget > 0 ? ((actualTotalTrackedSpent / totalBudget) * 100).toFixed(1) : '0'
    });

    const convertedTotalSpent = convertAmount(actualTotalTrackedSpent);
    const convertedTotalBudget = convertAmount(totalBudget);
    const convertedIncome = convertAmount(totalIncome);

    const prompt = `Analyze the following financial data and provide 3 personalized, actionable insights. Keep each insight concise (2-3 sentences).

Context:
- Currency: ${currency}
- Total Income: ${totalIncome > 0 ? `${currency} ${convertedIncome.toFixed(0)}` : 'Not recorded'}
- Total Budget Limit: ${currency} ${convertedTotalBudget.toFixed(0)}
- Total Spending: ${currency} ${convertedTotalSpent.toFixed(0)}
- Spending vs Budget: ${totalBudget > 0 ? ((actualTotalTrackedSpent / totalBudget) * 100).toFixed(1) : '0'}%
- Category Breakdown: ${categoryAnalysis || "No specific category data"}

Instructions:
1. Analyze spending patterns against budgets and income.
2. Identify critical issues (overspending, high utilization) first.
3. Provide positive reinforcement for good habits (savings, staying under budget).
4. Suggest specific actions (e.g., "Cut back on dining out", "Allocate more to savings").

Output Format (JSON Array):
[
  {
    "type": "warning" | "info" | "success",
    "title": "Short Catchy Title",
    "message": "Clear, actionable advice using ${currency} for values."
  }
]

Examples:
- Warning: "Overspending Alert", "You've exceeded your Food budget by ${currency} 500. Try cooking at home this week."
- Info: "Smart Tip", "You're spending 40% of your income on Wants. The 50/30/20 rule suggests keeping this under 30%."
- Success: "Great Job!", "You're under budget in 3 categories! Consider moving the surplus to your Savings goal."
`;

    const response = await fetch(
      `https:
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (data.error?.code === 429 || response.status === 429) {
        console.warn("Gemini API rate limit reached, returning fallback insights");
        return res.status(200).json({
          success: true,
          insights: generateFallbackInsights(totalExpense, totalIncome, categorySpending, budgets, transactions, currency),
          fallback: true
        });
      }
      console.error("Gemini API Error:", data);
      throw new Error(data.error?.message || "Failed to generate insights");
    }

    let insights;
    try {
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const jsonText = aiText.replace(/```json\n?|\n?```/g, '').trim();
      insights = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      insights = generateFallbackInsights(totalExpense, totalIncome, categorySpending, budgets, transactions, currency);
    }

    res.status(200).json({
      success: true,
      insights: insights.slice(0, 3)
    });

  } catch (error) {
    console.error("AI Insights Error:", error);
    return res.status(200).json({
      success: true,
      insights: generateFallbackInsights(totalExpense, totalIncome, categorySpending, budgets, transactions, currency),
      fallback: true,
      error: error.message
    });
  }
};
