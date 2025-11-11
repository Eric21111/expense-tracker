import React, { useState, useEffect } from "react";
import Sidebar from "../components/shared/Sidebar";
import Header from "../components/shared/Header2";
import { useSidebar } from "../contexts/SidebarContext";
import { FaHandHoldingUsd, FaCoins } from "react-icons/fa";

import TransactionSummaryCard from "../components/transactions/TransactionSummaryCard";
import TransactionListCard from "../components/transactions/TransactionListCard";
import StatCard from "../components/transactions/StatCard";

import AddTransactionModal from "../components/transactions/AddTransactionModal";
import { getTransactionSummary } from "../services/transactionService";

const TransactionsPage = () => {
  const [username, setUsername] = useState("User");
  const { isExpanded } = useSidebar();
  

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
   
    if (Object.keys(dateFilters).length === 0) {
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getTransactionSummary(dateFilters);
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
    <div className="flex min-h-screen bg-[#F5F5F5] font-poppins">
      <Sidebar />
      <main
        className={`flex-1 bg-[#F5F5F5] transition-all duration-300 ease-in-out ${
          isExpanded ? "ml-64" : "ml-20"
        }`}
      >
        <Header username={username} title="Transactions" />

        <div className="p-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <TransactionListCard 
              refreshTrigger={refreshTrigger}
              onDateFilterChange={setDateFilters}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <TransactionSummaryCard 
              refreshTrigger={refreshTrigger}
              dateFilters={dateFilters}
            />

            <div className="grid grid-cols-2 gap-6">
              <StatCard
                icon={<FaHandHoldingUsd className="text-xl" />}
                value={loading ? "..." : transactionCount.toString()}
                title="Number of Transactions"
                subtitle="Total transactions this month"
                iconColor="#10B981"
                titleColor="#10B981"
              />
              <StatCard
                icon={<FaCoins className="text-xl" />}
                value={loading ? "..." : `PHP ${Math.round(averageDailySpending).toLocaleString()}`}
                title="Average Daily Spending"
                subtitle="Average amount spent per day"
                iconColor="#10B981"
                titleColor="#10B981"
              />
            </div>

          
            <button
              onClick={() => setIsModalOpen(true)} 
              className="fixed bottom-8 right-8 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-200 hover:scale-110"
            >
              <span className="text-3xl">+</span>
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