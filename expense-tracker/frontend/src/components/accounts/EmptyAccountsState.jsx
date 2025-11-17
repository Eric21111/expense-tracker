import React from 'react';
import { FaWallet } from 'react-icons/fa';

const EmptyAccountsState = ({ onAddAccount }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-12 shadow-sm text-center">
      <div className="mb-3 sm:mb-4">
        <FaWallet className="mx-auto text-4xl sm:text-5xl lg:text-6xl text-gray-300 mb-3 sm:mb-4" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Accounts Yet</h3>
      <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
        Start by adding your first account to track your finances
      </p>
      <button
        onClick={onAddAccount}
        className="px-5 py-2.5 sm:px-6 sm:py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
      >
        Add Your First Account
      </button>
    </div>
  );
};

export default EmptyAccountsState;
