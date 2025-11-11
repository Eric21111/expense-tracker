import React, { useState, useEffect } from "react";
import Sidebar from "../components/shared/Sidebar";
import { useSidebar } from "../contexts/SidebarContext";
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
import { FaPiggyBank } from "react-icons/fa"; 
import Header2 from "../components/shared/Header2";

const Dashboard = () => {
  const [username, setUsername] = useState("User");
  const { isExpanded } = useSidebar();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUsername(user.name || user.displayName || "User");
      } catch (e) {}
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F5F5F5] font-poppins">
      <Sidebar />
      <main
        className={`flex-1 bg-[#F5F5F5] transition-all duration-300 ease-in-out ${
          isExpanded ? "ml-64" : "ml-20"
        }`}
      >
      
        <Header2 username={username} title="Dashboard" />

        <div className="p-8">
      
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 space-y-6">
              <WelcomeBanner
                username={username}
                illustration={ManIllustration}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Total Balance"
                  amount="PHP 7,500"
                  description="Remaining funds this month."
                  icon={<span className="text-green-600 text-2xl font-bold">₱</span>}
                />
                <StatCard
                  title="Total Expenses"
                  amount="PHP 11,000"
                  description="Spent so far this month."
                  icon={<FaPiggyBank className="text-green-600 text-2xl" />}
                />
                <StatCard
                  title="Total Savings"
                  amount="PHP 1,500"
                  description="Saved amount this month."
                  icon={<FaPiggyBank className="text-green-600 text-2xl" />}
                />
              </div>
            </div>
            <DashboardCalendar />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[2fr_1.2fr_0.8fr] gap-6 mb-6 items-stretch">
            <ExpenseBreakdownChart />
            <BudgetProgress />
            <AchievementsCard />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <RecentExpenses />
            <AiInsights />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;