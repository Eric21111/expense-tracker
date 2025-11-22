import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const BudgetExceededModal = ({ isOpen, onClose, onConfirm, budgetAmount, totalExpenses, exceedAmount, formatAmount }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target.id === "backdrop") {
      onClose();
    }
  };

  return (
   <div
        id="backdrop"
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 font-poppins p-4"
      >
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100">
        
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FiAlertTriangle className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Budget Warning</h3>
                <p className="text-white text-opacity-90 text-sm">You are exceeding your budget</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
         
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
            <p className="text-sm text-red-600 font-medium mb-1">Exceeding budget by</p>
            <p className="text-2xl font-bold text-red-700">{formatAmount(exceedAmount)}</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium">Budget Limit</span>
              <span className="font-semibold text-gray-900">{formatAmount(budgetAmount)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-gray-600 font-medium">Total Expenses</span>
              <span className="font-semibold text-red-600">{formatAmount(totalExpenses)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-600 font-medium">Over Budget</span>
              <span className="font-semibold text-orange-600">-{formatAmount(exceedAmount)}</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800 text-center">
              <span className="font-semibold">⚠️ Important:</span> This will put you over your budget limit. 
              Are you sure you want to continue?
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all font-medium shadow-md hover:shadow-lg"
          >
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetExceededModal;
