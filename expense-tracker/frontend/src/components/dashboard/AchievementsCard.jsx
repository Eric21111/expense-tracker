import React, { useState, useEffect } from "react";
import { IoRibbon } from "react-icons/io5";
import { getAllBadgeProgress } from "../../services/badgeService";

import StarterSaverIcon from "../../assets/badges icon/starter saver.svg";
import ThriftyHeroIcon from "../../assets/badges icon/thrifty hero.svg";
import FinanceFollowerIcon from "../../assets/badges icon/finance-follower 2.svg";
import GroceryGuruIcon from "../../assets/badges icon/grocery-guru 2.svg";
import IncomeExpertIcon from "../../assets/badges icon/income-expert 1.svg";
import FoodieSaverIcon from "../../assets/badges icon/foodie-saver 1.svg";
import BillBossIcon from "../../assets/badges icon/bill-boss 1.svg";
import ShopperSaverIcon from "../../assets/badges icon/shopper-saver 1.svg";
import TravelSaverIcon from "../../assets/badges icon/travel-saver 1.svg";
import GettingStartedIcon from "../../assets/badges icon/getting-started 1.svg";
import IncomeInitiatorIcon from "../../assets/badges icon/income iniator 1.svg";
import IncomeTrackerIcon from "../../assets/badges icon/income tracker 1.svg";
import BudgetBuilderIcon from "../../assets/badges icon/Budget builder.svg";
import FirstStepIcon from "../../assets/badges icon/first step 1.svg";
import BudgetMasterIcon from "../../assets/badges icon/budget master.svg";
import LedgerKeeperIcon from "../../assets/badges icon/ledger keeper 1.svg";
import ExpenseExpertIcon from "../../assets/badges icon/expenseexpert 1.svg";
import PlannerStarterIcon from "../../assets/badges icon/planner starter 1.svg";
import PlannerProIcon from "../../assets/badges icon/plannerpro 1.svg";

const AchievementsCard = () => {
  const [recentBadge, setRecentBadge] = useState(null);
  const [loading, setLoading] = useState(true);

  const badgeDefinitions = {
    "starter-saver": {
      name: "Starter Saver",
      description: "Made your first budget plan",
      icon: StarterSaverIcon
    },
    "thrifty-hero": {
      name: "Thrifty Hero",
      description: "Stayed under budget for whole month",
      icon: ThriftyHeroIcon
    },
    "finance-follower": {
      name: "Finance Follower",
      description: "50 income recorded",
      icon: FinanceFollowerIcon
    },
    "grocery-guru": {
      name: "Grocery Guru",
      description: "Stayed under grocery budget",
      icon: GroceryGuruIcon
    },
    "income-expert": {
      name: "Income Expert",
      description: "100 income recorded",
      icon: IncomeExpertIcon
    },
    "foodie-saver": {
      name: "Foodie Saver",
      description: "Stayed under food budget",
      icon: FoodieSaverIcon
    },
    "bill-boss": {
      name: "Bill Boss",
      description: "Kept bills under budget",
      icon: BillBossIcon
    },
    "shopper-saver": {
      name: "Shopper Saver",
      description: "Stayed under shopping budget",
      icon: ShopperSaverIcon
    },
    "travel-saver": {
      name: "Travel Saver",
      description: "Stayed under transportation budget",
      icon: TravelSaverIcon
    },
    "getting-started": {
      name: "Getting Started",
      description: "Made 10 expenses",
      icon: GettingStartedIcon
    },
    "income-initiator": {
      name: "Income Initiator",
      description: "Recorded first income",
      icon: IncomeInitiatorIcon
    },
    "income-tracker": {
      name: "Income Tracker",
      description: "10 income recorded",
      icon: IncomeTrackerIcon
    },
    "budget-builder": {
      name: "Budget Builder",
      description: "Created your first multiple-budget",
      icon: BudgetBuilderIcon
    },
    "first-step": {
      name: "First Step",
      description: "Made your first expense",
      icon: FirstStepIcon
    },
    "budget-master": {
      name: "Budget Master",
      description: "Made 100 budget plan",
      icon: BudgetMasterIcon
    },
    "ledger-keeper": {
      name: "Ledger Keeper",
      description: "Made 50 expenses",
      icon: LedgerKeeperIcon
    },
    "expense-expert": {
      name: "Expense Expert",
      description: "Made 100 expenses",
      icon: ExpenseExpertIcon
    },
    "planner-starter": {
      name: "Planner Starter",
      description: "Made 10 budget plan",
      icon: PlannerStarterIcon
    },
    "planner-pro": {
      name: "Planner Pro",
      description: "Made 50 budget plan",
      icon: PlannerProIcon
    }
  };

  useEffect(() => {
    const loadRecentBadge = () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const email = user.email;

      if (!email) {
        setLoading(false);
        return;
      }

      const badgeProgress = getAllBadgeProgress(email);
      
      if (!badgeProgress || Object.keys(badgeProgress).length === 0) {
        setLoading(false);
        return;
      }

      let mostRecent = null;
      let mostRecentDate = null;

      Object.entries(badgeProgress).forEach(([badgeId, data]) => {
        const unlockedDate = new Date(data.unlockedAt);
        if (!mostRecentDate || unlockedDate > mostRecentDate) {
          mostRecentDate = unlockedDate;
          mostRecent = {
            id: badgeId,
            ...badgeDefinitions[badgeId],
            unlockedAt: data.unlockedAt
          };
        }
      });

      setRecentBadge(mostRecent);
      setLoading(false);
    };

    loadRecentBadge();

    const handleStorageChange = () => {
      loadRecentBadge();
    };

    window.addEventListener("userStorageChange", handleStorageChange);
    window.addEventListener("badgeUnlocked", handleStorageChange);

    return () => {
      window.removeEventListener("userStorageChange", handleStorageChange);
      window.removeEventListener("badgeUnlocked", handleStorageChange);
    };
  }, []);

  return (
    <div
      className="py-9 px-5 flex flex-col justify-between shadow-lg"
      style={{
        borderRadius: "24px",
        background: "linear-gradient(to bottom, #FFE082, #FFCCBC)",
      }}
    >
      <div className="mb-3">
        <h2 className="text-base font-semibold text-gray-800">Achievement</h2>
      </div>

      <div className="bg-white rounded-xl p-3 flex flex-col items-center flex-1 justify-between shadow-md">
        <div className="flex flex-col items-center flex-1 w-full">
          <div className="relative mb-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-md"
              style={{
                background: "linear-gradient(to bottom, #FFA726, #FFD54F)",
              }}
            >
              {recentBadge ? (
                <img 
                  src={recentBadge.icon} 
                  alt={recentBadge.name}
                  className="w-9 h-9 object-contain brightness-0 invert"
                />
              ) : (
                <IoRibbon className="text-white text-3xl" />
              )}
            </div>
            
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-sm"></div>
          </div>

          <h3 className="text-base font-bold text-gray-800 mb-1.5 px-2.5 py-1 bg-white rounded-lg shadow-sm border border-gray-100">
            {recentBadge ? recentBadge.name : (loading ? "Loading..." : "No Badges Yet")}
          </h3>

          <p className="text-xs text-gray-700 text-center leading-tight max-w-xs mb-3 bg-white px-2.5 py-1 rounded-lg">
            {recentBadge 
              ? `Congratulations! You've ${recentBadge.description.toLowerCase()}. Keep up the great work!`
              : (loading 
                  ? "Loading your achievements..." 
                  : "Start your journey by making transactions and creating budgets!"
                )
            }
          </p>
        </div>

        <button
          className="w-full text-white font-bold py-1.5 px-3 transition-all hover:shadow-xl hover:scale-105 text-xs"
          style={{
            background: "linear-gradient(to right, #FF8A50, #FFB74D)",
            borderRadius: "999px",
            boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)",
          }}
        >
          {recentBadge ? "BADGE EARNED" : "GET STARTED"}
        </button>
      </div>
    </div>
  );
};

export default AchievementsCard;