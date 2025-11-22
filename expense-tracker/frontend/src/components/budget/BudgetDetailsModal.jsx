import React, { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiTrendingUp, FiDollarSign, FiPieChart } from 'react-icons/fi';
import { getTransactions } from '../../services/transactionService';

const BudgetDetailsModal = ({ isOpen, onClose, budget, formatAmount, totalSpent, totalBudget, percentage, isMultiBudget, budgetGroup }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && budget) {
            fetchBudgetTransactions();
        }
    }, [isOpen, budget]);

    const fetchBudgetTransactions = async () => {
        setLoading(true);
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            const response = await getTransactions({
                type: 'expense',
                startDate: startOfMonth.toISOString(),
                endDate: endOfMonth.toISOString()
            });

            if (response.success) {
                
                let filteredTransactions = [];

                if (isMultiBudget && budgetGroup) {
                    
                    const categories = budgetGroup.map(b => b.category.toLowerCase());
                    filteredTransactions = response.transactions.filter(t =>
                        categories.includes(t.category?.toLowerCase())
                    );
                } else {
                    
                    filteredTransactions = response.transactions.filter(t =>
                        t.category?.toLowerCase() === budget.category?.toLowerCase() &&
                        (t.budgetId === budget.id || t.budgetId === budget._id ||
                            String(t.budgetId) === String(budget.id) ||
                            String(t.budgetId) === String(budget._id))
                    );
                }

                filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
                setTransactions(filteredTransactions);
            }
        } catch (error) {
            console.error('Error fetching budget transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !budget) return null;

    const displayTitle = budget.label || budget.name || budget.category;
    const categoryNames = isMultiBudget && budgetGroup
        ? budgetGroup.map(b => b.category).join(', ')
        : budget.category;

    const getCategorySpending = (category, budgetId) => {
        return transactions
            .filter(t =>
                t.category?.toLowerCase() === category?.toLowerCase() &&
                (t.budgetId === budgetId || String(t.budgetId) === String(budgetId))
            )
            .reduce((sum, t) => sum + t.amount, 0);
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 font-poppins p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto border-t-4 border-green-500">
                
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
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
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{displayTitle}</h2>
                            <p className="text-sm text-gray-500">{categoryNames}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                <div className="px-6 py-6 border-b border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FiDollarSign className="text-blue-600" size={18} />
                                <p className="text-xs text-blue-600 font-medium">Budget Limit</p>
                            </div>
                            <p className="text-lg font-bold text-blue-900">{formatAmount(totalBudget)}</p>
                        </div>

                        <div className="bg-orange-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FiTrendingUp className="text-orange-600" size={18} />
                                <p className="text-xs text-orange-600 font-medium">Spent</p>
                            </div>
                            <p className="text-lg font-bold text-orange-900">{formatAmount(totalSpent)}</p>
                        </div>

                        <div className="bg-green-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FiDollarSign className="text-green-600" size={18} />
                                <p className="text-xs text-green-600 font-medium">Remaining</p>
                            </div>
                            <p className={`text-lg font-bold ${Math.max(0, totalBudget - totalSpent) === 0 ? 'text-gray-500' : 'text-green-900'}`}>
                                {formatAmount(Math.max(0, totalBudget - totalSpent))}
                            </p>
                        </div>

                        <div className="bg-purple-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FiPieChart className="text-purple-600" size={18} />
                                <p className="text-xs text-purple-600 font-medium">Progress</p>
                            </div>
                            <p className="text-lg font-bold text-purple-900">{percentage.toFixed(1)}%</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Budget Progress</span>
                            <span className={`text-sm font-semibold ${percentage >= 100 ? 'text-red-600' :
                                    percentage >= 80 ? 'text-orange-600' :
                                        'text-green-600'
                                }`}>
                                {percentage >= 100 ? 'Over Budget' :
                                    percentage >= 80 ? 'Near Limit' :
                                        'On Track'}
                            </span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${percentage >= 100 ? 'bg-red-500' :
                                        percentage >= 80 ? 'bg-orange-500' :
                                            'bg-green-500'
                                    }`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {budget.description && (
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Description</p>
                                <p className="text-sm text-gray-700">{budget.description}</p>
                            </div>
                        )}
                        {budget.dueDate && (
                            <div>
                                <div className="flex items-center gap-2">
                                    <FiCalendar className="text-gray-400" size={14} />
                                    <p className="text-xs text-gray-500">Due Date</p>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">
                                    {new Date(budget.dueDate).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {isMultiBudget && budgetGroup && budgetGroup.length > 1 && (
                    <div className="px-6 py-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Budgeted Categories ({budgetGroup.length})
                        </h3>
                        <div className="space-y-3">
                            {budgetGroup.map((categoryBudget, index) => {
                                const categorySpent = getCategorySpending(categoryBudget.category, categoryBudget.id);
                                const categoryPercentage = (categorySpent / categoryBudget.amount) * 100;

                                return (
                                    <div key={index} className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{categoryBudget.category}</h4>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {formatAmount(categorySpent)} of {formatAmount(categoryBudget.amount)}
                                                </p>
                                            </div>
                                            <span className={`text-sm font-semibold ${categoryPercentage >= 100 ? 'text-red-600' :
                                                    categoryPercentage >= 80 ? 'text-orange-600' :
                                                        'text-green-600'
                                                }`}>
                                                {categoryPercentage.toFixed(0)}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${categoryPercentage >= 100 ? 'bg-red-500' :
                                                        categoryPercentage >= 80 ? 'bg-orange-500' :
                                                            'bg-green-500'
                                                    }`}
                                                style={{ width: `${Math.min(categoryPercentage, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="px-6 py-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Recent Transactions ({transactions.length})
                    </h3>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            <p className="text-gray-500 mt-2">Loading transactions...</p>
                        </div>
                    ) : transactions.length > 0 ? (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {transactions.map((transaction, index) => (
                                <div
                                    key={transaction._id || transaction.id || index}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{transaction.description || transaction.category}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-gray-500">
                                                {new Date(transaction.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full">
                                                {transaction.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-red-600">-{formatAmount(transaction.amount)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                            <p className="text-gray-500">No transactions yet</p>
                            <p className="text-sm text-gray-400 mt-1">Transactions will appear here when you add expenses to this budget</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BudgetDetailsModal;
