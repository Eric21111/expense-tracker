import React from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';

const BudgetCreatedSuccessModal = ({ isOpen, onClose, budgetName, totalAmount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 font-poppins p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6">
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FiCheckCircle className="text-green-600 text-3xl" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">Budget Created!</h3>
            <p className="text-gray-600 mb-6">
              Your budget has been successfully created.
            </p>

            <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Budget Name:</span>
                  <span className="font-semibold text-gray-900">{budgetName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Total Budget:</span>
                  <span className="font-semibold text-green-600">₱{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCreatedSuccessModal;
