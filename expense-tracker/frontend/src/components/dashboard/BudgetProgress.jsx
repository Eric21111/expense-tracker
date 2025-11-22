import React, { useState, useEffect } from "react";
import { getTransactionSummary } from "../../services/transactionService";
import { getBudgets } from "../../services/budgetApiService";
import { useCurrency } from "../../contexts/CurrencyContext";

const BudgetProgress = ({ dateRange }) => {
  const { formatAmount } = useCurrency();
  const [budgetData, setBudgetData] = useState({
    totalBudget: 0, 
    totalExpense: 0,
    percentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserEmail(user.email || '');
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetchAllBudgetData();
    }
  }, [userEmail, dateRange]);
  
  const fetchAllBudgetData = async () => {
    if (!userEmail) return;
    
    try {
      if (loading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      
      let totalBudget = 0;
      const budgetResult = await getBudgets();
      console.log('📊 BudgetProgress - Budgets response:', budgetResult);
      
      let budgetItems = [];
      if (budgetResult.success && budgetResult.budgets) {
        budgetItems = budgetResult.budgets;
      } else if (Array.isArray(budgetResult)) {
        budgetItems = budgetResult;
      }
      
      if (budgetItems && budgetItems.length > 0) {
        const grouped = {};
        let singleTotal = 0;
        
        budgetItems.forEach((budget) => {
          if (budget.groupId) {
            if (!grouped[budget.groupId]) {
              grouped[budget.groupId] = budget.totalBudget || budget.amount;
            }
          } else {
            singleTotal += budget.amount || 0;
          }
        });
        totalBudget = Object.values(grouped).reduce((sum, val) => sum + val, singleTotal);
        console.log('📊 BudgetProgress - Total Budget:', totalBudget, 'from', budgetItems.length, 'budgets');
      }
      let filters = {};
      if (dateRange) {
        const startDate = new Date(dateRange.start);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        
        filters = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        };
      }
      
      const response = await getTransactionSummary(filters);
      
      if (response.success) {
        const totalExpense = response.summary.totalExpense || 0;
        const percentage = totalBudget > 0 ? Math.min((totalExpense / totalBudget) * 100, 100) : 0;
        
        console.log('📊 BudgetProgress - Final data:', {
          totalBudget,
          totalExpense,
          percentage: Math.round(percentage)
        });
        
        setBudgetData({
          totalBudget,
          totalExpense,
          percentage: Math.round(percentage)
        });
      }
    } catch (error) {
      console.error("Error fetching budget data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const radius = 80;
  const circumference = Math.PI * radius;
  const progressLength = (circumference * budgetData.percentage) / 100;
  const remainingLength = circumference - progressLength;
  return (
    <div
      className="bg-white p-6 shadow-md flex flex-col"
      style={{ borderRadius: "30px" }}
    >
      <div className="flex items-center justify-center mb-8">
        <h2
          className="text-xl font-bold text-center"
          style={{ color: "#34A853" }}
        >
          Budget Progress
        </h2>
        {refreshing && (
          <div className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Refreshing..."></div>
        )}
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-[260px] mx-auto">
          <svg
            className="w-full"
            viewBox="0 0 200 110"
            style={{ height: "130px" }}
          >
            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              stroke="#C8E6C9"
              strokeWidth="22"
              fill="none"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: "#4ADE80", stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: "#22C55E", stopOpacity: 1}} />
              </linearGradient>
              <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: "#FCD34D", stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: "#F59E0B", stopOpacity: 1}} />
              </linearGradient>
              <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: "#F87171", stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: "#DC2626", stopOpacity: 1}} />
              </linearGradient>
            </defs>
            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              stroke={
                budgetData.percentage > 80 
                  ? "url(#redGradient)" 
                  : budgetData.percentage > 50 
                    ? "url(#yellowGradient)" 
                    : "url(#greenGradient)"
              }
              strokeWidth="22"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${progressLength} ${circumference}`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center" style={{ marginTop: "10px" }}>
              {loading ? (
                <p className="text-sm text-gray-600">Loading...</p>
              ) : (
                <>
                  <p
                    className="font-bold mb-2"
                    style={{ 
                      color: budgetData.percentage > 80 ? "#DC2626" : budgetData.percentage > 50 ? "#F59E0B" : "#22C55E", 
                      fontSize: "30px" 
                    }}
                  >
                    {budgetData.percentage}%
                  </p>
                  <p
                    className="text-sm font-normal"
                    style={{ color: "#424242" }}
                  >
                    of budget used
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatAmount(budgetData.totalExpense)} / {formatAmount(budgetData.totalBudget)}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetProgress;