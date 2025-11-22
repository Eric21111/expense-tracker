import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import BudgetCardsSection from './BudgetCardsSection';

const BudgetCardsModal = ({ isOpen, onClose, refreshTrigger, onExpenseAdded }) => {
  const [transactionType, setTransactionType] = useState('expense');

  React.useEffect(() => {
    if (isOpen) {
      setTransactionType('expense');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target.id === 'budget-cards-backdrop') {
      onClose();
    }
  };

  const handleExpenseAdded = () => {
    if (onExpenseAdded) {
      onExpenseAdded();
    }

  };

  return (
    <div
      id="budget-cards-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 font-poppins p-4"
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-green-400 to-green-500 px-6 py-2 rounded-t-2xl z-10">
        </div>

        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900">
              {transactionType === 'income' ? 'Income' : 'Quick Expense'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="flex gap-2 justify-center mb-4">
            <button
              onClick={() => setTransactionType('expense')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${transactionType === 'expense'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setTransactionType('income')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${transactionType === 'income'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Income
            </button>
          </div>

          <h3 className="text-base font-semibold text-gray-900">
            {transactionType === 'income' ? 'Select an Account' : 'Select a Budget'}
          </h3>
        </div>

        <div className="p-6 overflow-y-auto">
          <BudgetCardsSection
            refreshTrigger={refreshTrigger}
            onExpenseAdded={handleExpenseAdded}
            transactionType={transactionType}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetCardsModal;
