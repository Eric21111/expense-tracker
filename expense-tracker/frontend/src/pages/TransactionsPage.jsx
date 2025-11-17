import React, { useState, useEffect } from "react";
import Sidebar from "../components/shared/Sidebar";
import Header from "../components/shared/Header2";
import { useSidebar } from '../contexts/SidebarContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { FaHandHoldingUsd, FaCoins } from "react-icons/fa";

import TransactionSummaryCard from "../components/transactions/TransactionSummaryCard";
import TransactionListCard from "../components/transactions/TransactionListCard";
import StatCard from "../components/transactions/StatCard";

import AddTransactionModal from "../components/transactions/AddTransactionModal";
import { getTransactionSummary } from "../services/transactionService";

const TransactionsPage = () => {
  const [username, setUsername] = useState("User");
  const { isExpanded } = useSidebar();
  const { formatAmount, getCurrencySymbol } = useCurrency();
  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [averageDailySpending, setAverageDailySpending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dateFilters, setDateFilters] = useState({});

 
  const handleTransactionAdded = () => {
    setRefreshTrigger(prev => prev + 1);
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
        className={`flex-1 bg-[#F5F5F5] transition-all duration-300 ease-in-out relative z-0 ${
          isExpanded ? "lg:ml-64" : "lg:ml-20"
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

          
            <button
              onClick={() => setIsModalOpen(true)} 
              className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-200 hover:scale-110 z-10"
            >
              <span className="text-2xl sm:text-3xl">+</span>
            </button>
          </div>
        </div>
      </main>

     
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTransactionAdded={handleTransactionAdded}
      />
    </div>
  );
};

export default TransactionsPage;