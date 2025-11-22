import React, { useState, useEffect } from "react";
import Sidebar from "../components/shared/Sidebar";
import Header from "../components/shared/Header2";
import { useSidebar } from '../contexts/SidebarContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { FaHandHoldingUsd, FaCoins } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";

import TransactionSummaryCard from "../components/transactions/TransactionSummaryCard";
import TransactionListCard from "../components/transactions/TransactionListCard";
import StatCard from "../components/transactions/StatCard";
import BudgetCardsModal from "../components/transactions/BudgetCardsModal";

import { getTransactionSummary } from "../services/transactionService";
import { checkAndStartTour } from '../utils/tutorial';

const TransactionsPage = () => {
  const [username, setUsername] = useState("User");
  const { isExpanded } = useSidebar();
  const { formatAmount, getCurrencySymbol } = useCurrency();

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [averageDailySpending, setAverageDailySpending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dateFilters, setDateFilters] = useState({});
  const [showBudgetCardsModal, setShowBudgetCardsModal] = useState(false);

  useEffect(() => {
    checkAndStartTour();
  }, []);

  const handleTransactionAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleOpenBudgetCards = () => {
    setShowBudgetCardsModal(true);
  };

  const handleCloseBudgetCards = () => {
    setShowBudgetCardsModal(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUsername(user.name || user.displayName || "User");
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        let filters = dateFilters;
        if (Object.keys(dateFilters).length === 0) {
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          filters = {
            startDate: startOfMonth.toISOString(),
            endDate: endOfMonth.toISOString()
          };
        }

        const response = await getTransactionSummary(filters);
        if (response.success) {
          setTransactionCount(response.summary.transactionCount || 0);
          setAverageDailySpending(response.summary.averageDailySpending || 0);
        }
      } catch (err) {
        console.error("Error fetching transaction stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshTrigger, dateFilters]);

  return (
    <div className="flex min-h-screen bg-[#F5F5F5] font-poppins relative">
      <Sidebar />
      <main
        className={`flex-1 bg-[#F5F5F5] transition-all duration-300 ease-in-out relative z-0 ${isExpanded ? "lg:ml-64" : "lg:ml-20"
          } ml-0`}
      >
        <Header username={username} title="Transactions" />

        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6">
          <div className="xl:col-span-3">
            <TransactionListCard
              refreshTrigger={refreshTrigger}
              onDateFilterChange={setDateFilters}
            />
          </div>

          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            <TransactionSummaryCard
              refreshTrigger={refreshTrigger}
              dateFilters={dateFilters}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <StatCard
                icon={<FaHandHoldingUsd className="text-lg sm:text-xl" />}
                value={loading ? "..." : transactionCount.toString()}
                title="Number of Transactions"
                subtitle="Total transactions this month"
                iconColor="#10B981"
                titleColor="#10B981"
              />
              <StatCard
                icon={<FaCoins className="text-lg sm:text-xl" />}
                value={loading ? "..." : formatAmount(Math.round(averageDailySpending))}
                title="Average Daily Spending"
                subtitle="Average on days with expenses"
                iconColor="#10B981"
                titleColor="#10B981"
              />
            </div>
          </div>
        </div>

        <button
          id="add-transaction-button"
          onClick={handleOpenBudgetCards}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-[#4CAF50] text-white rounded-full shadow-lg hover:bg-[#45a049] transition-all hover:scale-105 flex items-center justify-center z-50"
          aria-label="Quick Expense"
        >
          <FiPlus className="text-xl sm:text-2xl" />
        </button>

        <BudgetCardsModal
          isOpen={showBudgetCardsModal}
          onClose={handleCloseBudgetCards}
          refreshTrigger={refreshTrigger}
          onExpenseAdded={handleTransactionAdded}
        />
      </main>
    </div>
  );
};

export default TransactionsPage;