import React from 'react';

const BudgetStatCards = ({ 
  loading, 
  totalBudgeted, 
  totalExpense, 
  totalRemaining,
  formatAmount,
  shoppingIcon,
  moneyIcon,
  coinsIcon 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm relative overflow-hidden flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">
            {loading ? 'Loading...' : formatAmount(totalBudgeted)}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Total Budgeted
          </p>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 opacity-80 flex-shrink-0">
          <img src={shoppingIcon} alt="Wallet" className="w-full h-full object-contain" />
        </div>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm relative overflow-hidden flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">
            {loading ? 'Loading...' : formatAmount(totalExpense)}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Total Expenses
          </p>
          <span className="text-xs text-gray-400 hidden sm:block">
            Spent so far this month
          </span>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 opacity-80 flex-shrink-0">
          <img src={moneyIcon} alt="Expenses" className="w-full h-full object-contain" />
        </div>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm relative overflow-hidden flex items-center justify-between sm:col-span-2 lg:col-span-1">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">
            {loading ? 'Loading...' : formatAmount(Math.max(0, totalRemaining))}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Total Balance
          </p>
          <span className="text-xs text-gray-400 hidden sm:block">
            From all accounts
          </span>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 opacity-80 flex-shrink-0">
          <img src={coinsIcon} alt="Coins" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
};

export default BudgetStatCards;
