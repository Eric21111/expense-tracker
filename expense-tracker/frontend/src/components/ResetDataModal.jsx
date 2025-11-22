import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiExclamation, HiX } from 'react-icons/hi';

const ResetDataModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                >
                    <div className="p-6 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <HiExclamation className="h-6 w-6 text-red-600" />
                        </div>

                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Reset All Data?
                        </h3>

                        <p className="text-sm text-gray-500 mb-6">
                            Are you sure you want to reset all your data? This will permanently delete:
                            <br />
                            <ul className="list-disc list-inside mt-2 mb-2">
                                <li>All transactions</li>
                                <li>All budgets</li>
                                <li>All accounts</li>
                                <li>All notifications</li>
                                <li>All badges</li>
                            </ul>
                            Your user account will remain active.
                            <br /><br />
                            <span className="font-bold text-red-600">This action cannot be undone.</span>
                        </p>

                        <div className="flex gap-3 justify-center">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            >
                                {isLoading ? 'Resetting...' : 'Yes, Reset Everything'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ResetDataModal;
