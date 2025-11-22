import React from 'react';
import { FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi';

const BudgetCard = ({
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
  onEdit,
  onDelete,
  onClick
}) => {
  return (
    <div
      className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: budget.iconColor || '#34A853' }}
        >
          {budget.icon && typeof budget.icon === 'string' && budget.icon.startsWith('data:') ? (
            <img
              src={budget.icon}
              alt="Budget Icon"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          ) : (
            <img src={budget.icon} alt="Budget" className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </div>

        <div className="flex-1 w-full">
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <div className="flex-1 pr-2">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{displayTitle}</h3>
              {(categoryNames || budget.category) && (
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {categoryNames || budget.category}
                </p>
              )}
              {budget.description && (
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{budget.description}</p>
              )}
              {budget.dueDate && (
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-center gap-1">
                    <FiCalendar className="text-gray-400 flex-shrink-0" size={10} />
                    <p className="text-xs text-gray-400 truncate">
                      Due: {new Date(budget.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  {budget.lastExpenseReset && new Date(budget.dueDate) < new Date() && (
                    <p className="text-xs text-green-500 ml-3 truncate">
                      ✓ Expenses reset on {new Date(budget.lastExpenseReset).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium ${status.color} whitespace-nowrap`}>
                {status.label}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(budget);
                }}
                className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                aria-label="Edit"
              >
                <FiEdit2 size={14} className="sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(budget, isMultiBudget);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                aria-label="Delete"
              >
                <FiTrash2 size={12} className="sm:w-3 sm:h-3" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-2 sm:mb-3">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500">Budget Limit</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{formatAmount(totalBudget)}</p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500">Spent</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{formatAmount(totalSpent)}</p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500">Remaining</p>
              <p className={`text-xs sm:text-sm font-semibold truncate ${totalRemaining === 0 ? 'text-gray-500' : 'text-green-500'
                }`}>
                {formatAmount(Math.max(0, totalRemaining))}
              </p>
            </div>
          </div>

          <div className="mt-2 sm:mt-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${percentage >= 100 ? 'bg-red-500' :
                    percentage >= 80 ? 'bg-orange-500' :
                      'bg-green-500'
                    }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              <span className="text-[10px] sm:text-xs text-gray-500 min-w-[35px] sm:min-w-[40px] text-right font-medium">
                {percentage.toFixed(0)}%
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
