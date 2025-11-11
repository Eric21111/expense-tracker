import React, { useState, useEffect } from "react";
import { FaArrowDown, FaArrowRight } from "react-icons/fa";
import { getTransactionSummary } from "../../services/transactionService";

const TransactionSummaryCard = ({ refreshTrigger, dateFilters }) => {
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await getTransactionSummary(dateFilters || {});
        if (response.success) {
          setSummary(response.summary);
        }
      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [refreshTrigger, dateFilters]);

  return (
    <div
     
      className="p-6 rounded-2xl shadow-lg text-white flex flex-col"
      style={{
        background: "linear-gradient(to right, #6EE7B7, #3B82F6)",
        borderRadius: "20px",
      
        minHeight: "220px", 
      }}
    >
      {/* --- TOP SECTION --- */}
      <div>
        <h3 className="text-base font-medium text-gray-100">Total Balance</h3>
        <p className="text-sm text-gray-200">Remaining funds this month</p>
      </div>

  
      <div className="flex-1 flex items-center justify-center">
        {loading ? (
          <p className="text-2xl font-semibold tracking-tight my-4">Loading...</p>
        ) : (
          <p className="text-4xl font-bold tracking-tight my-4">
            PHP {summary.totalBalance.toLocaleString()}
          </p>
        )}
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-white border-opacity-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <FaArrowDown className="text-white text-lg" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-100">Total Income</p>
            <p className="text-xl font-semibold">
              PHP {loading ? "..." : summary.totalIncome.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <FaArrowRight className="text-white text-lg" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-100">Total Expense</p>
            <p className="text-xl font-semibold">
              PHP {loading ? "..." : summary.totalExpense.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummaryCard;