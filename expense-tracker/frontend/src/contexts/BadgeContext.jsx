import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { checkNewBadges, markBadgeAsShown, checkBudgetCompletions } from '../services/badgeService';
import BadgeUnlockNotification from '../components/rewards/BadgeUnlockNotification';

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

const BadgeContext = createContext();

export const useBadge = () => {
  const context = useContext(BadgeContext);
  if (!context) {
    throw new Error('useBadge must be used within a BadgeProvider');
  }
  return context;
};

const badgeDefinitions = [
  {
    id: "starter-saver",
    name: "Starter Saver",
    description: "Made your first budget plan",
    icon: StarterSaverIcon,
    requirement: { type: "budget", count: 1 },
  },
  {
    id: "thrifty-hero",
    name: "Thrifty Hero",
    description: "Stay under budget for a whole month",
    icon: ThriftyHeroIcon,
    requirement: { type: "under-budget-month", count: 1 },
  },
  {
    id: "finance-follower",
    name: "Finance Follower",
    description: "50 income recorded",
    icon: FinanceFollowerIcon,
    requirement: { type: "income", count: 50 },
  },
  {
    id: "grocery-guru",
    name: "Grocery Guru",
    description: "Stayed under budget for grocery",
    icon: GroceryGuruIcon,
    requirement: { type: "category-budget", category: "Grocery", count: 1 },
  },
  {
    id: "income-expert",
    name: "Income Expert",
    description: "100 income recorded",
    icon: IncomeExpertIcon,
    requirement: { type: "income", count: 100 },
  },
  {
    id: "foodie-saver",
    name: "Foodie Saver",
    description: "Stayed under budget for food",
    icon: FoodieSaverIcon,
    requirement: { type: "category-budget", category: "Food", count: 1 },
  },
  {
    id: "bill-boss",
    name: "Bill Boss",
    description: "Kept the bills under budget",
    icon: BillBossIcon,
    requirement: { type: "category-budget", category: "Bills", count: 1 },
  },
  {
    id: "shopper-saver",
    name: "Shopper Saver",
    description: "Stayed under Shopping budget",
    icon: ShopperSaverIcon,
    requirement: { type: "category-budget", category: "Shopping", count: 1 },
  },
  {
    id: "travel-saver",
    name: "Travel Saver",
    description: "Stayed under budget in transportation cost",
    icon: TravelSaverIcon,
    requirement: { type: "category-budget", category: "Transportation", count: 1 },
  },
  {
    id: "getting-started",
    name: "Getting Started",
    description: "Made 10 expenses",
    icon: GettingStartedIcon,
    requirement: { type: "expense", count: 10 },
  },
  {
    id: "income-initiator",
    name: "Income Initiator",
    description: "Add your first income",
    icon: IncomeInitiatorIcon,
    requirement: { type: "income", count: 1 },
  },
  {
    id: "income-tracker",
    name: "Income Tracker",
    description: "10 income recorded",
    icon: IncomeTrackerIcon,
    requirement: { type: "income", count: 10 },
  },
  {
    id: "budget-builder",
    name: "Budget Builder",
    description: "Created your first multiple-budget plan",
    icon: BudgetBuilderIcon,
    requirement: { type: "multi-budget", count: 1 },
  },
  {
    id: "first-step",
    name: "First Step",
    description: "Made your first expense",
    icon: FirstStepIcon,
    requirement: { type: "expense", count: 1 },
  },
  {
    id: "budget-master",
    name: "Budget Master",
    description: "Made 100 budget plan",
    icon: BudgetMasterIcon,
    requirement: { type: "budget", count: 100 },
  },
  {
    id: "ledger-keeper",
    name: "Ledger Keeper",
    description: "Made 50 expenses",
    icon: LedgerKeeperIcon,
    requirement: { type: "expense", count: 50 },
  },
  {
    id: "expense-expert",
    name: "Expense Expert",
    description: "Made 100 expenses",
    icon: ExpenseExpertIcon,
    requirement: { type: "expense", count: 100 },
  },
  {
    id: "planner-starter",
    name: "Planner Starter",
    description: "Made 10 budget plan",
    icon: PlannerStarterIcon,
    requirement: { type: "budget", count: 10 },
  },
  {
    id: "planner-pro",
    name: "Planner Pro",
    description: "Made 50 budget plan",
    icon: PlannerProIcon,
    requirement: { type: "budget", count: 50 },
  }
];

export const BadgeProvider = ({ children }) => {
  const [currentBadge, setCurrentBadge] = useState(null);
  const [badgeQueue, setBadgeQueue] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [isAuthPage, setIsAuthPage] = useState(false);

  useEffect(() => {
    const checkAuthPage = () => {
      const path = window.location.pathname;
      const authPages = ['/', '/login', '/register', '/about'];
      return authPages.includes(path);
    };

    setIsAuthPage(checkAuthPage());

    const handleRouteChange = (event) => {
      const newPath = event.detail?.pathname || window.location.pathname;
      const authPages = ['/', '/login', '/register', '/about'];
      setIsAuthPage(authPages.includes(newPath));
    };

    window.addEventListener('routeChange', handleRouteChange);
    return () => window.removeEventListener('routeChange', handleRouteChange);
  }, []);

  useEffect(() => {
    const getUserEmail = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.email || '';
    };

    setUserEmail(getUserEmail());

    const handleUserChange = () => {
      setUserEmail(getUserEmail());
      const path = window.location.pathname;
      const authPages = ['/', '/login', '/register', '/about'];
      setIsAuthPage(authPages.includes(path));
    };

    window.addEventListener('userStorageChange', handleUserChange);
    return () => window.removeEventListener('userStorageChange', handleUserChange);
  }, []);

  const checkForNewBadges = useCallback(async () => {
    if (!userEmail || isAuthPage) return;

    await checkBudgetCompletions(userEmail);

    const newBadges = await checkNewBadges(userEmail, badgeDefinitions);
    
    if (newBadges.length > 0) {
      setBadgeQueue(prev => [...prev, ...newBadges]);
    }
  }, [userEmail, isAuthPage]);

  useEffect(() => {
    if (!currentBadge && badgeQueue.length > 0) {
      const nextBadge = badgeQueue[0];
      setCurrentBadge(nextBadge);
      setBadgeQueue(prev => prev.slice(1));
      
      if (userEmail && nextBadge.id) {
        markBadgeAsShown(userEmail, nextBadge.id).catch(err => 
          console.error('Error marking badge as shown:', err)
        );
        window.dispatchEvent(new Event('badgeUnlocked'));
      }
    }
  }, [currentBadge, badgeQueue, userEmail]);

  const handleBadgeClose = () => {
    setCurrentBadge(null);
  };

  useEffect(() => {
    if (isAuthPage) {
      setCurrentBadge(null);
      setBadgeQueue([]);
    }
  }, [isAuthPage]);

  useEffect(() => {
    const checkBadgesHandler = () => {
      setTimeout(() => {
        checkForNewBadges();
      }, 1000);
    };
    window.addEventListener('transactionAdded', checkBadgesHandler);
    window.addEventListener('budgetCreated', checkBadgesHandler);
    window.addEventListener('budgetUpdated', checkBadgesHandler);
    window.addEventListener('pageLoad', checkBadgesHandler);

    checkForNewBadges();

    return () => {
      window.removeEventListener('transactionAdded', checkBadgesHandler);
      window.removeEventListener('budgetCreated', checkBadgesHandler);
      window.removeEventListener('budgetUpdated', checkBadgesHandler);
      window.removeEventListener('pageLoad', checkBadgesHandler);
    };
  }, [checkForNewBadges]);

  return (
    <BadgeContext.Provider value={{ checkForNewBadges }}>
      {children}
      {currentBadge && !isAuthPage && (
        <BadgeUnlockNotification
          badge={currentBadge}
          onClose={handleBadgeClose}
        />
      )}
    </BadgeContext.Provider>
  );
};
