import React, { useState, useEffect } from "react";
import { getTransactionSummary } from "../../services/transactionService";

const BudgetProgress = ({ dateRange }) => {
  const [budgetData, setBudgetData] = useState({
    totalBudget: 50000, 
    totalExpense: 0,
    percentage: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgetData();
  }, [dateRange]);

  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      
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
        const totalBudget = 50000; 
        const percentage = totalBudget > 0 ? Math.min((totalExpense / totalBudget) * 100, 100) : 0;
        
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
      <h2
        className="text-xl font-bold mb-8 text-center"
        style={{ color: "#34A853" }}
      >
        Budget Progress
      </h2>
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
            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              stroke={budgetData.percentage >= 90 ? "#EA4335" : budgetData.percentage >= 70 ? "#FBBC04" : "#34A853"}
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
                      color: budgetData.percentage >= 90 ? "#EA4335" : budgetData.percentage >= 70 ? "#FBBC04" : "#34A853", 
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
                    PHP {budgetData.totalExpense.toLocaleString()} / {budgetData.totalBudget.toLocaleString()}
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