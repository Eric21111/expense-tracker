import React from 'react';
import { FiInfo } from 'react-icons/fi';

const BudgetResetNotification = ({ 
  resetNotification, 
  onDismiss, 
  getCurrentMonthDisplay 
}) => {
  if (!resetNotification) return null;

  return (
    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-[20px] p-4 flex items-start gap-3">
      <FiInfo className="text-blue-600 mt-1 flex-shrink-0" size={20} />
      <div className="flex-1">
        <h4 className="font-semibold text-blue-800 mb-1">
          Budget Reset for {getCurrentMonthDisplay()}
        </h4>
        <p className="text-blue-700 text-sm mb-3">
          Your budgets have been automatically reset to ₱0 for the new month. 
          {resetNotification.resetCount} budget{resetNotification.resetCount !== 1 ? 's' : ''} 
          {resetNotification.resetCount !== 1 ? ' were' : ' was'} reset.
        </p>
        <button
          onClick={onDismiss}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
        >
          Got it, dismiss
        </button>
      </div>
    </div>
  );
};

export default BudgetResetNotification;
