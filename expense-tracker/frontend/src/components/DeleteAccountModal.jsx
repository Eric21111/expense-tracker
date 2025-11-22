import React, { useState, useEffect } from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";

const DeleteAccountModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [confirmText, setConfirmText] = useState("");
  const CONFIRM_KEYWORD = "CONFIRM";

  useEffect(() => {
    if (!isOpen) {
      setConfirmText("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (confirmText === CONFIRM_KEYWORD) {
      onConfirm();
    }
  };

  const isConfirmValid = confirmText === CONFIRM_KEYWORD;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none backdrop-blur-sm bg-black/50" 
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full max-w-lg transform transition-all duration-300 scale-100 relative pointer-events-auto"
        style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isLoading}
        >
          <FaTimes size={24} />
        </button>

        <div className="px-8 py-10 flex flex-col items-center text-center">
          <div className="mb-6 w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="text-red-600 text-4xl" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Delete Account?
          </h2>

          <p className="text-gray-600 mb-2 max-w-sm">
            Are you sure you want to delete your account? This action cannot be undone.
          </p>

          <p className="text-gray-500 mb-6 text-sm max-w-sm">
            All your data, including expenses, budgets, and settings, will be permanently deleted.
          </p>

          <div className="w-full mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Type <span className="font-bold text-red-600">CONFIRM</span> to delete your account:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="CONFIRM"
              className="w-full px-4 py-3 border-2 rounded-lg text-center text-lg font-semibold focus:outline-none transition-colors"
              style={{
                borderColor: confirmText && !isConfirmValid ? '#ef4444' : '#d1d5db',
                backgroundColor: confirmText && !isConfirmValid ? '#fef2f2' : '#fff'
              }}
              disabled={isLoading}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && isConfirmValid && !isLoading) {
                  handleConfirm();
                }
              }}
            />
            {confirmText && !isConfirmValid && (
              <p className="text-red-600 text-sm mt-2 text-left">
                Please type exactly "CONFIRM" to proceed
              </p>
            )}
          </div>

          <div className="flex gap-4 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 px-6 rounded-xl text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3.5 px-6 rounded-xl text-white font-semibold bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={!isConfirmValid || isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;

