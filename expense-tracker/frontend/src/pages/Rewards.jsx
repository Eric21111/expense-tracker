import React, { useState, useEffect } from "react";
import Sidebar from "../components/shared/Sidebar";
import Header2 from "../components/shared/Header2";
import { useSidebar } from '../contexts/SidebarContext';
import { FaTrophy, FaMedal } from "react-icons/fa";
import BadgeCard from "../components/rewards/BadgeCard";
import { calculateBadgeProgress, checkBudgetCompletions } from "../services/badgeService";

import StarterSaverIcon from "../assets/badges icon/starter saver.svg";
import ThriftyHeroIcon from "../assets/badges icon/thrifty hero.svg";
import FinanceFollowerIcon from "../assets/badges icon/finance-follower 2.svg";
import GroceryGuruIcon from "../assets/badges icon/grocery-guru 2.svg";
import IncomeExpertIcon from "../assets/badges icon/income-expert 1.svg";
import FoodieSaverIcon from "../assets/badges icon/foodie-saver 1.svg";
import BillBossIcon from "../assets/badges icon/bill-boss 1.svg";
import ShopperSaverIcon from "../assets/badges icon/shopper-saver 1.svg";
import TravelSaverIcon from "../assets/badges icon/travel-saver 1.svg";
import GettingStartedIcon from "../assets/badges icon/getting-started 1.svg";
import IncomeInitiatorIcon from "../assets/badges icon/income iniator 1.svg";
import IncomeTrackerIcon from "../assets/badges icon/income tracker 1.svg";
import BudgetBuilderIcon from "../assets/badges icon/Budget builder.svg";
import FirstStepIcon from "../assets/badges icon/first step 1.svg";
import BudgetMasterIcon from "../assets/badges icon/budget master.svg";
import LedgerKeeperIcon from "../assets/badges icon/ledger keeper 1.svg";
import ExpenseExpertIcon from "../assets/badges icon/expenseexpert 1.svg";
import PlannerStarterIcon from "../assets/badges icon/planner starter 1.svg";
import PlannerProIcon from "../assets/badges icon/plannerpro 1.svg";

const Rewards = () => {
  const { isExpanded } = useSidebar();
  const [badges, setBadges] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("User");
  const [loading, setLoading] = useState(true);

  const badgeDefinitions = [
    {
      id: "starter-saver",
      name: "Starter Saver",
      description: "Made your first budget plan",
      icon: StarterSaverIcon,
      requirement: { type: "budget", count: 1 },
      color: "from-emerald-400 to-green-500"
    },
    {
      id: "thrifty-hero",
      name: "Thrifty Hero",
      description: "Stay under budget for a whole month",
      icon: ThriftyHeroIcon,
      requirement: { type: "under-budget-month", count: 1 },
      color: "from-emerald-400 to-green-500"
    },
    {
      id: "finance-follower",
      name: "Finance Follower",
      description: "50 income recorded",
      icon: FinanceFollowerIcon,
      requirement: { type: "income", count: 50 },
      color: "from-emerald-400 to-green-500"
    },
    {
      id: "grocery-guru",
      name: "Grocery Guru",
      description: "Stayed under budget for grocery",
      icon: GroceryGuruIcon,
      requirement: { type: "category-budget", category: "Grocery", count: 1 },
      color: "from-emerald-400 to-green-500"
    },
    {
      id: "income-expert",
      name: "Income Expert",
      description: "100 income recorded",
      icon: IncomeExpertIcon,
      requirement: { type: "income", count: 100 },
      color: "from-emerald-400 to-green-500"
    },
    {
      id: "foodie-saver",
      name: "Foodie Saver",
      description: "Stayed under budget for food",
      icon: FoodieSaverIcon,
      requirement: { type: "category-budget", category: "Food", count: 1 },
      color: "from-emerald-400 to-green-500"
    },
    {
      id: "bill-boss",
      name: "Bill Boss",
      description: "Kept the bills under budget",
      icon: BillBossIcon,
      requirement: { type: "category-budget", category: "Bills", count: 1 },
      color: "from-emerald-400 to-green-500"
    },
    {
      id: "shopper-saver",
      name: "Shopper Saver",
      description: "Stayed under Shopping budget",
      icon: ShopperSaverIcon,
      requirement: { type: "category-budget", category: "Shopping", count: 1 },
      color: "from-emerald-400 to-green-500"
    },
    {
      id: "travel-saver",
      name: "Travel Saver",
      description: "Stayed under budget in transportation cost",
      icon: TravelSaverIcon,
      requirement: { type: "category-budget", category: "Transportation", count: 1 },
      color: "from-emerald-400 to-green-500"
    },
    {
      id: "getting-started",
      name: "Getting Started",
      description: "Made 10 expenses",
      icon: GettingStartedIcon,
      requirement: { type: "expense", count: 10 },
      color: "from-emerald-400 to-green-500"
    },
    {
      id: "income-initiator",
      name: "Income Initiator",
      description: "Add your first income",
      icon: IncomeInitiatorIcon,
      requirement: { type: "income", count: 1 },
      color: "from-emerald-400 to-green-500"
    },
    {
      id: "income-tracker",
      name: "Income Tracker",
      description: "10 income recorded",
      icon: IncomeTrackerIcon,
      requirement: { type: "income", count: 10 },
      color: "from-emerald-400 to-green-500"
    },
    {
      id: "budget-builder",
      name: "Budget Builder",
      description: "Created your first multiple-budget",
      icon: BudgetBuilderIcon,
      requirement: { type: "multi-budget", count: 1 },
      color: "from-emerald-400 to-green-500"
    },
    {
      id: "first-step",
      name: "First Step",
      description: "Made your first expense",
      icon: FirstStepIcon,
      requirement: { type: "expense", count: 1 },
      color: "from-emerald-400 to-green-500"
    },
    {
      id: "budget-master",
      name: "Budget Master",
      description: "Made 100 budget plan",
      icon: BudgetMasterIcon,
      requirement: { type: "budget", count: 100 },
      color: "from-emerald-400 to-green-500"
    },
    {
      id: "ledger-keeper",
      name: "Ledger Keeper",
      description: "Made 50 expenses",
      icon: LedgerKeeperIcon,
      requirement: { type: "expense", count: 50 },
      color: "from-emerald-400 to-green-500"
    },
    {
      id: "expense-expert",
      name: "Expense Expert",
      description: "Made 100 expenses",
      icon: ExpenseExpertIcon,
      requirement: { type: "expense", count: 100 },
      color: "from-emerald-400 to-green-500"
    },
    {
      id: "planner-starter",
      name: "Planner Starter",
      description: "Made 10 budget plan",
      icon: PlannerStarterIcon,
      requirement: { type: "budget", count: 10 },
      color: "from-emerald-400 to-green-500"
    },
    {
      id: "planner-pro",
      name: "Planner Pro",
      description: "Made 50 budget plan",
      icon: PlannerProIcon,
      requirement: { type: "budget", count: 50 },
      color: "from-emerald-400 to-green-500"
    }
  ];

  const loadBadges = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const email = user.email;
    
    setUsername(user.name || user.displayName || "User");
    
    if (!email) {
      setBadges([]);
      setUserEmail("");
      setLoading(false);
      return;
    }
    
    setUserEmail(email);

    checkBudgetCompletions(email);

    const badgeProgress = JSON.parse(localStorage.getItem(`badgeProgress_${email}`) || '{}');

    const badgesWithProgress = badgeDefinitions.map(badge => {
      const progress = calculateBadgeProgress(badge, email);
      const unlockedData = badgeProgress[badge.id];
      
      return {
        ...badge,
        progress: progress,
        unlockedAt: unlockedData?.unlockedAt || null
      };
    });

    setBadges(badgesWithProgress);
    setLoading(false);
  };

  useEffect(() => {
    loadBadges();

    const handleUserChange = () => {
      loadBadges();
    };

    window.addEventListener("userStorageChange", handleUserChange);
    
    setTimeout(() => {
      window.dispatchEvent(new Event('pageLoad'));
    }, 500);
    
    return () => {
      window.removeEventListener("userStorageChange", handleUserChange);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <Sidebar />
      <main className={`flex-1 bg-gray-50 transition-all duration-300 overflow-y-auto ml-0 lg:ml-20 ${
        isExpanded ? "lg:ml-64" : "lg:ml-20"
      }`}>
        <Header2 username={username} title="Badges" />
        
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">Total Badges</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{badges.length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-400 to-green-500 p-2.5 sm:p-3 rounded-lg">
                    <FaTrophy className="text-white text-xl sm:text-2xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">Unlocked</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-600">
                      {badges.filter(b => b.progress.unlocked).length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-400 to-green-500 p-2.5 sm:p-3 rounded-lg">
                    <FaMedal className="text-white text-xl sm:text-2xl" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
              {loading ? (
                <div className="col-span-full flex justify-center items-center h-48 sm:h-64">
                  <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-500"></div>
                </div>
              ) : !userEmail ? (
                <div className="col-span-full flex flex-col items-center justify-center h-48 sm:h-64 text-gray-400 px-4">
                  <FaTrophy className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base lg:text-lg text-center">Please log in to view your badges</p>
                </div>
              ) : badges.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center h-48 sm:h-64 text-gray-400 px-4">
                  <FaMedal className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base lg:text-lg text-center">Start your journey to earn badges!</p>
                </div>
              ) : (
                badges.map(badge => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))
              )}
            </div>
        </div>
      </main>
      
    </div>
  );
};

export default Rewards;
