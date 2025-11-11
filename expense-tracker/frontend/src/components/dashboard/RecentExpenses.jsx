import React, { useState, useEffect } from "react";
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

const RecentExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchRecentExpenses = async () => {
      try {
        setLoading(true);
        const response = await getTransactions({ type: "expense" });
        
        if (response.success) {
          const recentExpenses = response.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(transaction => {
              const config = categoryConfig[transaction.category] || categoryConfig["Others"];
              return {
                ...transaction,
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

    fetchRecentExpenses();
  }, []);

  return (
    <div
      className="lg:col-span-2 bg-white p-6 shadow-md"
      style={{ borderRadius: "30px" }}
    >
      <h2 className="text-xl font-bold text-green-600 mb-6">Recent Expenses</h2>
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading recent expenses...
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No expenses found yet
          </div>
        ) : (
          expenses.map((expense, index) => (
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
                  <p className={`font-semibold text-gray-800`}>{expense.category}</p>
                  <p className="text-sm text-gray-500">{expense.time}</p>
                </div>
              </div>
              <p className="text-lg font-bold text-red-600">
                -PHP {Math.abs(expense.amount).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentExpenses;