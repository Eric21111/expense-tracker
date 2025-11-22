import React from "react";
import { FaTimes } from "react-icons/fa";

const SuccessModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none backdrop-blur-sm"
      style={{ zIndex: 10000 }}
    >
      <div
        className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full max-w-sm transform transition-all duration-300 scale-100 relative pointer-events-auto"
        style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}
      >
  
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={20} />
        </button>

        <div className="px-8 py-10 flex flex-col items-center text-center">
         
          <div className="mb-6">
            <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http:
              >
                <path
                  d="M25 40L35 50L55 30"
                  stroke="#22C55E"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Success!
          </h2>

          <p className="text-gray-600 mb-8">
            Your password has been updated.
          </p>

          <button
            onClick={onConfirm}
            className="w-full py-3 px-6 rounded-xl text-white font-semibold bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
