import React from 'react';

const TransactionBudgetCard = ({
  budget,
  isMultiBudget,
  totalBudget,
  totalSpent,
  totalRemaining,
  percentage,
  status,
  displayTitle,
  categoryNames,
  formatAmount,
  onClick
}) => {
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear().toString().slice(-2)}`;
  };

  return (
    <div
      data-budget-card="true"
      onClick={onClick}
      className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: budget.iconColor || '#34A853' }}
        >
          {budget.icon && typeof budget.icon === 'string' && budget.icon.startsWith('data:') ? (
            <img
              src={budget.icon}
              alt="Budget Icon"
              className="w-7 h-7 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          ) : (
            <img src={budget.icon} alt="Budget" className="w-7 h-7" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900">{displayTitle}</h3>
          <p className="text-xs text-gray-500">
            {budget.dueDate ? formatDate(budget.dueDate) : formatDate(new Date())}
          </p>
        </div>

        <div className="flex gap-4 text-right">
          <div>
            <p className="text-xs text-gray-500">Budget Limit</p>
            <p className="text-sm font-bold text-gray-900">{formatAmount(totalBudget)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Spent</p>
            <p className="text-sm font-bold text-gray-900">{formatAmount(totalSpent)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Remaining</p>
            <p className={`text-sm font-bold ${totalRemaining < 0 ? 'text-red-500' : 'text-green-600'}`}>{formatAmount(totalRemaining)}</p>
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${percentage >= 100 ? 'bg-red-500' :
              percentage >= 80 ? 'bg-orange-400' :
                'bg-green-500'
            }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default TransactionBudgetCard;
