import React, { useState, useEffect } from "react";
import { FaArrowDown, FaArrowRight } from "react-icons/fa";
import { getTransactionSummary } from "../../services/transactionService";
import { useCurrency } from "../../contexts/CurrencyContext";

const TransactionSummaryCard = ({ refreshTrigger, dateFilters }) => {
  const { formatAmount } = useCurrency();
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0
  });
  const [accountBalance, setAccountBalance] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserEmail(user.email || "");
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!userEmail) return;
    
    const loadAccountBalance = () => {
      const savedAccounts = localStorage.getItem(`accounts_${userEmail}`);
      if (savedAccounts) {
        try {
          const accounts = JSON.parse(savedAccounts);
          const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
          setAccountBalance(totalBalance);
        } catch (error) {
          console.error("Error loading accounts from localStorage:", error);
          setAccountBalance(0);
        }
      } else {
        setAccountBalance(0);
      }
    };
    
    loadAccountBalance();
  }, [userEmail, refreshTrigger]);

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
     
      className="p-4 sm:p-6 rounded-2xl shadow-lg text-white flex flex-col"
      style={{
        background: "linear-gradient(to right, #6EE7B7, #3B82F6)",
        borderRadius: "20px",
      
        minHeight: "200px", 
      }}
    >
      <div>
        <h3 className="text-sm sm:text-base font-medium text-gray-100">Total Balance</h3>
        <p className="text-xs sm:text-sm text-gray-200">Total balance in all accounts</p>
      </div>

  
      <div className="flex-1 flex items-center justify-center">
        {loading ? (
          <p className="text-xl sm:text-2xl font-semibold tracking-tight my-3 sm:my-4">Loading...</p>
        ) : (
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight my-3 sm:my-4">
{formatAmount(accountBalance)}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white border-opacity-30">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <FaArrowDown className="text-white text-sm sm:text-lg" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-100">Income</p>
            <p className="text-base sm:text-xl font-semibold">
{loading ? "..." : formatAmount(summary.totalIncome)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <FaArrowRight className="text-white text-sm sm:text-lg" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-100">Expense</p>
            <p className="text-base sm:text-xl font-semibold">
{loading ? "..." : formatAmount(summary.totalExpense)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummaryCard;