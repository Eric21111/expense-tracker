import React from 'react';
import { FiX, FiAlertTriangle } from 'react-icons/fi';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, budget, isLoading }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiAlertTriangle className="text-yellow-500" size={24} />
            Confirm Archive
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4 text-center">
              Are you sure you want to move this budget to archive?
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mt-4 flex flex-col items-center">
              {budget && (
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: budget.iconColor || '#34A853' }}
                  >
                    {budget.icon && typeof budget.icon === 'string' && budget.icon.startsWith('data:') ? (
                      <img 
                        src={budget.icon} 
                        alt="Budget Icon" 
                        className="w-6 h-6 object-contain"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                    ) : (
                      <img src={budget.icon} alt="Budget" className="w-6 h-6" />
                    )}
                  </div>
                  <p className="font-semibold text-gray-900 text-xl">
                    {budget?.name || budget?.category || ''}
                  </p>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              This budget will be moved to the archive where you can restore it later if needed.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Archiving...
                </>
              ) : (
                'Move to Archive'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
