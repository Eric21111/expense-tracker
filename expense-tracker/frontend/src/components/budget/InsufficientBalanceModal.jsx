import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const InsufficientBalanceModal = ({ isOpen, onClose, onConfirm, accountName, accountBalance, budgetAmount }) => {
  if (!isOpen) return null;

  const shortBy = budgetAmount - accountBalance;

  return (
     <div
     
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 font-poppins p-4"
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FiAlertTriangle className="text-red-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Insufficient Balance</h3>
              <p className="text-sm text-gray-600">Your account doesn't have enough funds</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-900 mb-3">
              Warning: Your account <span className="font-semibold">"{accountName}"</span> has insufficient balance.
            </p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Account Balance:</span>
                <span className="font-semibold text-gray-900">₱{accountBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Budget Amount:</span>
                <span className="font-semibold text-gray-900">₱{budgetAmount.toLocaleString()}</span>
              </div>
              <div className="border-t border-red-300 pt-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-red-700 font-medium">Short by:</span>
                  <span className="font-bold text-red-600">₱{shortBy.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Do you still want to create this budget? You can add funds to your account later.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Create Anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsufficientBalanceModal;
