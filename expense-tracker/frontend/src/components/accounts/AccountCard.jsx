import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AccountCard = ({ 
  account, 
  getIconComponent, 
  onToggle, 
  onEdit, 
  onDelete,
  formatAmount 
}) => {
  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0"
            style={{ backgroundColor: account.color }}
          >
            {React.createElement(getIconComponent(account.icon))}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 truncate">{account.name}</h3>
            <label className="relative inline-flex items-center cursor-pointer mt-0.5 sm:mt-1">
              <input
                type="checkbox"
                checked={account.enabled}
                onChange={() => onToggle(account.id)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 sm:gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onEdit(account.id)}
              className="p-1.5 sm:p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Edit"
            >
              <FaEdit size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button
              onClick={() => onDelete(account.id)}
              className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Delete"
            >
              <FaTrash size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
          <span className={`text-base sm:text-lg lg:text-xl font-bold truncate ${account.balance === 0 ? 'text-red-500' : 'text-green-600'}`}>
            {formatAmount(account.balance)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
