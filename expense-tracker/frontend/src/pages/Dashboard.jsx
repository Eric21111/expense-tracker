import React, { useState, useEffect } from "react";
import Sidebar from "../components/shared/Sidebar";
import { useSidebar } from '../contexts/SidebarContext';
import { useCurrency } from '../contexts/CurrencyContext';
import ManIllustration from "../assets/man.svg";
import Header from "../components/shared/Header2"; 
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import StatCard from "../components/dashboard/StatCard";
import DashboardCalendar from "../components/dashboard/DashboardCalendar";
import ExpenseBreakdownChart from "../components/dashboard/ExpenseBreakdownChart";
import BudgetProgress from "../components/dashboard/BudgetProgress";
import AchievementsCard from "../components/dashboard/AchievementsCard";
import RecentExpenses from "../components/dashboard/RecentExpenses";
import AiInsights from "../components/dashboard/AiInsights";
import { FaPiggyBank, FaWallet, FaMoneyBillWave } from "react-icons/fa"; 
import Header2 from "../components/shared/Header2";
import { getTransactionSummary, getTransactions } from "../services/transactionService";
import { loadBudgetsWithReset } from "../services/budgetService";
import { processAndShowAlerts } from "../services/notificationService";

const Dashboard = () => {
  const [username, setUsername] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [dashboardView, setDashboardView] = useState(() => {
    return localStorage.getItem("dashboardView") || "Monthly";
  });
  const { isExpanded } = useSidebar();
  const { formatAmount, getCurrencySymbol } = useCurrency();
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalExpense: 0,
    totalIncome: 0,
  });
  const [accountsBalance, setAccountsBalance] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dateRange, setDateRange] = useState(null);
  const [hasDataInRange, setHasDataInRange] = useState(true);
  
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDateRangeChange = (startDate, endDate) => {
    if (startDate && endDate) {
      setDateRange({
        start: startDate,
        end: endDate
      });
    } else {
      setDateRange(null);
      setHasDataInRange(true);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUsername(user.name || user.displayName || "User");
        setUserEmail(user.email || "");
        
        setTimeout(() => {
          window.dispatchEvent(new Event('pageLoad'));
        }, 1000);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleDashboardViewChange = (event) => {
      setDashboardView(event.detail);
    };

    window.addEventListener("dashboardViewChange", handleDashboardViewChange);
    return () => {
      window.removeEventListener("dashboardViewChange", handleDashboardViewChange);
    };
  }, []);

  useEffect(() => {
    const loadBudgets = () => {
      if (!userEmail) return;
      
      const budgetItems = loadBudgetsWithReset(userEmail);
      if (budgetItems && budgetItems.length > 0) {
        const total = budgetItems.reduce((sum, budget) => sum + budget.amount, 0);
        setTotalBudget(total);
      } else {
        setTotalBudget(0);
      }
    };

    if (userEmail) {
      loadBudgets();
    }
  }, [userEmail]);

  const loadAccountsBalance = () => {
    if (!userEmail) return 0;
    
    const savedAccounts = localStorage.getItem(`accounts_${userEmail}`);
    if (savedAccounts) {
      try {
        const accounts = JSON.parse(savedAccounts);
        return accounts
          .filter(account => account.enabled)
          .reduce((sum, account) => sum + (account.balance || 0), 0);
      } catch (e) {
        console.error('Error parsing accounts:', e);
      }
    }
    return 0;
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        if (!userEmail) return;
        
        setLoading(true);
        
        let startDate, endDate;
        if (dateRange) {
          startDate = new Date(dateRange.start);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(dateRange.end);
          endDate.setHours(23, 59, 59, 999);
        } else {
          const now = new Date();
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          endDate.setHours(23, 59, 59, 999);
        }

        const summaryResponse = await getTransactionSummary({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

        const incomeResponse = await getTransactions({
          type: 'income',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

        if (summaryResponse.success) {
          const totalAccountsBalance = loadAccountsBalance();
          setAccountsBalance(totalAccountsBalance);
          
          const updatedSummary = {
            ...summaryResponse.summary,
            totalBalance: totalAccountsBalance
          };
          setSummary(updatedSummary);
          
          const budgets = await loadBudgetsWithReset(userEmail);
          
          const grouped = {};
          let singleTotal = 0;
          
          budgets.forEach((budget) => {
            if (budget.groupId) {
              if (!grouped[budget.groupId]) {
                grouped[budget.groupId] = budget.totalBudget || budget.amount;
              }
            } else {
              singleTotal += budget.amount;
            }
          });
          
          const totalBudgetAmount = Object.values(grouped).reduce((sum, val) => sum + val, singleTotal);
          setTotalBudget(totalBudgetAmount);

          if (incomeResponse.success) {
            const incomeTransactions = incomeResponse.transactions || [];
            const gifts = incomeTransactions.filter(t => t.category === 'Gift' || t.category === 'Gifts')
              .reduce((sum, t) => sum + t.amount, 0);
            const income = incomeTransactions.filter(t => t.category !== 'Gift' && t.category !== 'Gifts')
              .reduce((sum, t) => sum + t.amount, 0);
            
            if (dateRange) {
              const totalIncomeInRange = gifts + income;
              setHasDataInRange(prev => prev || totalIncomeInRange > 0);
            }
          }

          if (userEmail && !dateRange) {
            processAndShowAlerts(userEmail);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchSummary();
    }
  }, [userEmail, refreshTrigger, dateRange]);
  
  useEffect(() => {
    if (userEmail) {
      const totalAccountsBalance = loadAccountsBalance();
      setAccountsBalance(totalAccountsBalance);
      
      setSummary(prevSummary => ({
        ...prevSummary,
        totalBalance: totalAccountsBalance
      }));
    }
  }, [userEmail, refreshTrigger]);
  
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === `accounts_${userEmail}` && userEmail) {
        const totalAccountsBalance = loadAccountsBalance();
        setAccountsBalance(totalAccountsBalance);
        setSummary(prevSummary => ({
          ...prevSummary,
          totalBalance: totalAccountsBalance
        }));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userEmail]);

  return (
    <div className="flex min-h-screen bg-[#F5F5F5] font-poppins relative">
      <Sidebar />
      <main
        className={`flex-1 bg-[#F5F5F5] transition-all duration-300 ease-in-out relative z-0 ${
          isExpanded ? "lg:ml-64" : "lg:ml-20"
        } ml-0`}
      >
      
        <Header2 username={username} title="Dashboard" />

        <div className="p-4 sm:p-6 lg:p-8">

          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-3">
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              <WelcomeBanner
                username={username}
                illustration={ManIllustration}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <StatCard
                  title="Total Balance"
                  amount={loading ? "Loading..." : formatAmount(summary.totalBalance)}
                  description="Total money in all accounts"
                  icon={<span className="text-green-600 text-xl sm:text-2xl font-bold">{getCurrencySymbol()}</span>}
                />
                <StatCard
                  title="Total Expenses"
                  amount={loading ? "Loading..." : formatAmount(summary.totalExpense)}
                  description={dateRange ? `Spent in selected period` : "Spent so far this month"}
                  icon={<FaWallet className="text-green-600 text-xl sm:text-2xl" />}
                />
                <StatCard
                  title="Total Budgeted"
                  amount={loading ? "Loading..." : formatAmount(totalBudget)}
                  description="Saved amount this month"
                  icon={<FaPiggyBank className="text-green-600 text-xl sm:text-2xl" />}
                />
              </div>
            </div>
            <DashboardCalendar 
              onDateRangeChange={handleDateRangeChange} 
              viewType={dashboardView}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[2.5fr_0.9fr_0.8fr] gap-4 sm:gap-6 mb-4 sm:mb-6 items-stretch">
              {(!dateRange || hasDataInRange) ? (
              <ExpenseBreakdownChart dateRange={dateRange} />
            ) : (
              <div className="bg-white p-4 sm:p-6 shadow-md rounded-2xl sm:rounded-[30px] flex items-center justify-center min-h-[200px]">
                <div className="text-center text-gray-500">
                  <p className="text-lg mb-2">📊</p>
                  <p className="font-medium">No expenses to display</p>
                  <p className="text-sm">Select a different date range or add expenses</p>
                </div>
              </div>
            )}
            <BudgetProgress dateRange={dateRange} />
            <div className="hidden xl:block">
              <AchievementsCard />
            </div>
          </div>
          
          <div className="block xl:hidden mb-4 sm:mb-6">
            <AchievementsCard />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <RecentExpenses dateRange={dateRange} />
            <AiInsights />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;