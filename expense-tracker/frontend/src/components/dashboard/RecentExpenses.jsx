import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { getBudgets } from '../../services/budgetApiService';
import {
  FaHamburger,
  FaCar,
  FaBolt,
  FaShoppingBag,
  FaShoppingCart,
  FaTheaterMasks,
  FaEllipsisH,
} from "react-icons/fa";
import { getTransactions } from "../../services/transactionService";

const RecentExpenses = ({ dateRange }) => {
  const { formatAmount } = useCurrency();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);

  const categoryConfig = {
    "Food": {
      icon: FaHamburger,
      color: "bg-gradient-to-r from-[#FB923C] to-[#EA580C]"
    },
    "Transportation": {
      icon: FaCar,
      color: "bg-gradient-to-r from-[#60A5FA] to-[#2563EB]"
    },
    "Bills": {
      icon: FaBolt,
      color: "bg-gradient-to-r from-[#C084FC] to-[#9333EA]"
    },
    "Entertainment": {
      icon: FaTheaterMasks,
      color: "bg-gradient-to-r from-[#FBBF24] to-[#F59E0B]"
    },
    "Shopping": {
      icon: FaShoppingBag,
      color: "bg-gradient-to-r from-[#EC407A] to-[#E91E63]"
    },
    "Grocery": {
      icon: FaShoppingCart,
      color: "bg-gradient-to-r from-[#66BB6A] to-[#4CAF50]"
    },
    "Others": {
      icon: FaEllipsisH,
      color: "bg-gradient-to-r from-[#4ade80] to-[#22c55e]"
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const transactionDate = new Date(date);
    const diffTime = Math.abs(now - transactionDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const fetchRecentExpenses = async () => {
    try {
      setLoading(true);

      const budgetsResult = await getBudgets();
      if (budgetsResult) {
        setBudgets(budgetsResult);
        console.log('✅ Loaded budgets:', budgetsResult);
      }

      let filters = { type: "expense" };
      if (dateRange) {
        const startDate = new Date(dateRange.start);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);

        filters.startDate = startDate.toISOString();
        filters.endDate = endDate.toISOString();
      }

      const response = await getTransactions(filters);

      if (response.success) {
        const recentExpenses = response.transactions
          .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            const dateDiff = dateB - dateA;

            if (dateDiff === 0) {
              if (a._id && b._id) {
                return b._id.localeCompare(a._id);
              }
              if (a.createdAt && b.createdAt) {
                return new Date(b.createdAt) - new Date(a.createdAt);
              }
            }

            return dateDiff;
          })
          .slice(0, 5)
          .map(transaction => {
            
            const mainCategory = transaction.category.includes(' - ')
              ? transaction.category.split(' - ')[0]
              : transaction.category;
            const config = categoryConfig[mainCategory] || categoryConfig["Others"];

            const displayCategory = transaction.category.includes(' - ')
              ? transaction.category.split(' - ')[1]
              : transaction.category;

            return {
              ...transaction,
              displayCategory,
              icon: config.icon,
              color: config.color,
              time: getTimeAgo(transaction.date)
            };
          });

        setExpenses(recentExpenses);
      }
    } catch (error) {
      console.error("Error fetching recent expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBudgetInfo = (transaction) => {
    if (!transaction.budgetId) {
      console.log('No budgetId for transaction:', transaction);
      return null;
    }

    console.log('Looking for budget with ID:', transaction.budgetId, 'Available budgets:', budgets);

    const budget = budgets.find(b => {
      const budgetIdMatch = (b.id && String(b.id) === String(transaction.budgetId)) ||
        (b._id && String(b._id) === String(transaction.budgetId));
      const groupIdMatch = b.groupId && String(b.groupId) === String(transaction.budgetId);
      return budgetIdMatch || groupIdMatch;
    });

    if (!budget) {
      console.log('No budget found for transaction:', transaction);
      return null;
    }

    console.log('Found budget:', budget);

    return budget.label || budget.name || null;
  };

  useEffect(() => {
    fetchRecentExpenses();
  }, [dateRange]);

  return (
    <div
      className="lg:col-span-2 bg-white p-6 shadow-md"
      style={{ borderRadius: "30px" }}
    >
      <h2 className="text-xl font-bold text-green-600 mb-6">
        Recent Expenses
      </h2>
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading recent expenses...
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {dateRange
              ? "No expenses found in the selected date range"
              : "No expenses found yet"
            }
          </div>
        ) : (
          expenses.map((expense, index) => {
            const budgetInfo = getBudgetInfo(expense);
            return (
              <div
                key={expense._id || index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${expense.color}`}
                  >
                    <expense.icon className="text-white text-xl" />
                  </div>
                  <div>
                    <p className={`font-semibold text-gray-800`}>
                      {expense.displayCategory || expense.category}
                      {budgetInfo && (
                        <span className="text-xs font-medium text-green-600 ml-2">• {budgetInfo}</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">{expense.time}</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-red-600">
                  -{formatAmount(Math.abs(expense.amount))}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentExpenses;