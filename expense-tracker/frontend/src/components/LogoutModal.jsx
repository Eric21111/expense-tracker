import React from "react";
import { FaTimes } from "react-icons/fa";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none backdrop-blur-sm bg-black/50" 
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full max-w-md transform transition-all duration-300 scale-100 relative pointer-events-auto border border-gray-200"
        style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={20} />
        </button>

        <div className="px-8 py-10 flex flex-col items-center text-center">
         
          <div className="mb-6 w-20 h-20 bg-[#d1fae5] rounded-full flex items-center justify-center">
            <span className="text-[#16a34a] text-4xl font-bold">?</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Logout Account
          </h2>

          <p className="text-gray-500 mb-8 max-w-sm">
            Are you sure you want to logout?
          </p>

          <div className="flex gap-4 w-full">
            <button
              onClick={onConfirm}
              className="flex-1 py-3.5 px-6 rounded-xl text-white font-bold bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Confirm
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3.5 px-6 rounded-xl text-gray-700 font-bold bg-gray-200 hover:bg-gray-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;

