import React, { useState, useMemo, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getTransactions } from "../../services/transactionService";
import { useCurrency } from "../../contexts/CurrencyContext";
import { loadBudgetsWithReset } from "../../services/budgetService";
import { Tooltip } from 'react-tooltip';
import SalaryIcon from "../../assets/categories/salary.svg";
import GiftIcon from "../../assets/categories/gift.svg";
import BillsIcon from "../../assets/categories/bills.svg";
import TransportationIcon from "../../assets/categories/transportation.svg";
import ShoppingIcon from "../../assets/categories/shopping.svg";

const TransactionListCard = ({ refreshTrigger, onDateFilterChange }) => {
  const { formatAmount } = useCurrency();
  const [activeTab, setActiveTab] = useState("All");
  const [activePeriod, setActivePeriod] = useState("Month");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [budgets, setBudgets] = useState([]);

  const categoryConfig = {
    "Salary": { icon: SalaryIcon, gradient: "linear-gradient(to bottom right, #FFA726, #FF8A00)", color: "#FFA726" },
    "Gift": { icon: GiftIcon, gradient: "linear-gradient(to bottom right, #FF7043, #FF5722)", color: "#FF7043" },
    "Food": { icon: ShoppingIcon, gradient: "linear-gradient(to bottom right, #FB923C, #EA580C)", color: "#FB923C" },
    "Transportation": { icon: TransportationIcon, gradient: "linear-gradient(to bottom right, #60A5FA, #2563EB)", color: "#60A5FA" },
    "Bills": { icon: BillsIcon, gradient: "linear-gradient(to bottom right, #C084FC, #9333EA)", color: "#C084FC" },
    "Entertainment": { icon: ShoppingIcon, gradient: "linear-gradient(to bottom right, #FBBF24, #F59E0B)", color: "#FBBF24" },
    "Shopping": { icon: ShoppingIcon, gradient: "linear-gradient(to bottom right, #EC407A, #E91E63)", color: "#EC407A" },
    "Grocery": { icon: ShoppingIcon, gradient: "linear-gradient(to bottom right, #66BB6A, #4CAF50)", color: "#66BB6A" },
    "Others": { icon: ShoppingIcon, gradient: "linear-gradient(to bottom right, #4ade80, #22c55e)", color: "#4ade80" },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem('user');
        const userEmail = storedUser ? JSON.parse(storedUser).email : null;
        
        if (userEmail) {
          const loadedBudgets = await loadBudgetsWithReset(userEmail);
          setBudgets(loadedBudgets || []);
        }
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        const filters = {
          startDate: startOfMonth.toISOString(),
          endDate: endOfMonth.toISOString()
        };
        
        const response = await getTransactions(filters);
        if (response.success) {
          const sortedTransactions = (response.transactions || []).sort((a, b) => {
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
          });
          setTransactions(sortedTransactions);
        }
        
        if (onDateFilterChange) {
          onDateFilterChange(filters);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  
  const filteredTransactions = useMemo(() => {
    let filtered = [];
    
    if (activeTab === "All") {
      filtered = [...transactions];
    } else if (activeTab === "Expenses") {
      filtered = transactions.filter((t) => t.type === "expense");
    } else if (activeTab === "Income") {
      filtered = transactions.filter((t) => t.type === "income");
    }
    
    return filtered.sort((a, b) => {
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
    });
  }, [activeTab, transactions]);

  
  const periodTotal = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);
  
  const categoryBreakdown = useMemo(() => {
    const relevantTransactions = activeTab === "Expenses" 
      ? filteredTransactions
      : activeTab === "Income" 
        ? filteredTransactions
        : filteredTransactions.filter(t => t.type === "expense");
    
    if (relevantTransactions.length === 0) return [];
    const categoryTotals = {};
    relevantTransactions.forEach(transaction => {
      const category = transaction.category || "Others";
      categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(transaction.amount);
    });
    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    const breakdown = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        color: categoryConfig[category]?.color || "#9CA3AF"
      }))
      .sort((a, b) => b.amount - a.amount);
    
    return breakdown;
  }, [filteredTransactions, activeTab]);
  
  const getBudgetInfo = (transaction) => {
    if (!transaction.budgetId) return null;
    const budget = budgets.find(b => 
      (b.id && b.id.toString() === transaction.budgetId) || 
      (b.groupId === transaction.budgetId)
    );
    
    if (!budget) return null;
    if (budget.groupId) {
      return budget.name || "Multiple Categories";
    }
    return budget.description || null;
  }; 

  const renderCategoryIcon = (transaction) => {
    const config = categoryConfig[transaction.category] || 
                   { icon: ShoppingIcon, gradient: "linear-gradient(to bottom right, #4ade80, #22c55e)" };
    
    return (
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: config.gradient }}
      >
        <img
          src={config.icon}
          alt="Category Icon"
          className="w-5 h-5 filter brightness-0 invert"
        />
      </div>
    );
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg" style={{ borderRadius: "20px" }}>
    
      <div className="flex justify-center items-center mb-4 sm:mb-6">
        <div className="flex justify-center space-x-2 sm:space-x-4">
          {["All", "Expenses", "Income"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1 text-sm sm:text-lg font-medium border-b-2 transition-colors duration-200 ${
                activeTab === tab
                  ? "text-black font-semibold border-green-500"
                  : "text-gray-500 hover:text-gray-700 border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div
        className="mb-4 sm:mb-6 border-2 border-dashed border-green-300 rounded-2xl p-3 sm:p-4 bg-[#F5FBF7]"
        style={{ borderRadius: "20px" }}
      >
      
        <div className="flex justify-around mb-3 sm:mb-4 overflow-x-auto">
          {["Day", "Week", "Month", "Year", "Period"].map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                activePeriod === period
                  ? "text-black border-b-2 border-green-500"
                  : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
              }`}
            >
              {period}
            </button>
          ))}
        </div>

   
        <div className="flex items-center justify-center gap-2 sm:gap-6 mb-3 sm:mb-4">
          <button className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 text-gray-600">
            <FaChevronLeft className="text-sm sm:text-base" />
          </button>
          <span className="text-sm sm:text-lg font-semibold text-gray-800">
            November, 2025
          </span>
          <button className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 text-gray-600">
            <FaChevronRight className="text-sm sm:text-base" />
          </button>
        </div>


        {activeTab !== "All" && categoryBreakdown.length > 0 && (
          <>
            <div className="flex w-full h-2 rounded-full overflow-hidden my-4 px-2">
              {categoryBreakdown.map((item, index) => (
                <div
                  key={`${item.category}-${index}`}
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  style={{ 
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                    minWidth: item.percentage > 0 ? '2px' : '0'
                  }}
                  data-tooltip-id="category-tooltip"
                  data-tooltip-content={`${item.category}: ${formatAmount(item.amount)} (${item.percentage.toFixed(1)}%)`}
                />
              ))}
            </div>
            <Tooltip id="category-tooltip" place="top" />
            
            <div className="flex flex-wrap justify-center gap-3 mt-2 mb-2">
              {categoryBreakdown.slice(0, 4).map((item, index) => (
                <div key={`legend-${item.category}-${index}`} className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-600">
                    {item.category} ({item.percentage.toFixed(0)}%)
                  </span>
                </div>
              ))}
              {categoryBreakdown.length > 4 && (
                <span className="text-xs text-gray-500">
                  +{categoryBreakdown.length - 4} more
                </span>
              )}
            </div>
          </>
        )}


        <p
          className={`text-2xl sm:text-3xl font-bold text-center mt-3 sm:mt-4 ${
           
            periodTotal >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
        
          {activeTab === "Income" && periodTotal > 0 ? "+" : ""}
{formatAmount(periodTotal)}
        </p>
      </div>

    
      <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading ? (
          <p className="text-center text-gray-500 py-4 text-sm sm:text-base">Loading transactions...</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-center text-gray-500 py-4 text-sm sm:text-base">No transactions found</p>
        ) : (
          filteredTransactions.map((transaction) => {
            const budgetInfo = getBudgetInfo(transaction);
            return (
              <div key={transaction._id} className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  {renderCategoryIcon(transaction)}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-gray-800 truncate">
                      {transaction.category}
                      {budgetInfo && (
                        <span className="text-xs text-gray-500 ml-1 sm:ml-2 hidden sm:inline">({budgetInfo})</span>
                      )}
                    </p>
                    {transaction.description && (
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{transaction.description}</p>
                    )}
                  </div>
                </div>
            <div className="text-right flex-shrink-0 ml-2">
              <p
                className={`font-semibold text-sm sm:text-base ${
                  transaction.type === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
{transaction.amount > 0 ? "+" : ""}{formatAmount(Math.abs(transaction.amount))}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
          </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransactionListCard;