import React from 'react';
import { FaPlus } from 'react-icons/fa';

const FloatingActionButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 flex items-center justify-center z-40"
      aria-label="Add Account"
    >
      <FaPlus size={20} className="sm:w-6 sm:h-6" />
    </button>
  );
};

export default FloatingActionButton;
