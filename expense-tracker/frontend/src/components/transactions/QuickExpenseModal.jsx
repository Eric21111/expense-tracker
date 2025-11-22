import React, { useState } from 'react';
import { FiX, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { createTransaction } from '../../services/transactionService';
import SuccessModal from './SuccessModal';
import BudgetExceededModal from './BudgetExceededModal';
import { addNotification, processAndShowAlerts } from '../../services/notificationService';
import toast from 'react-hot-toast';

const QuickExpenseModal = ({ isOpen, onClose, budget, isMultiBudget, categories, formatAmount, onExpenseAdded, transactions = [], transactionType: externalTransactionType }) => {
  const [internalTransactionType, setInternalTransactionType] = useState('expense');
  const transactionType = externalTransactionType || internalTransactionType;
  const [categoryExpenses, setCategoryExpenses] = useState({});
  const [globalDescription, setGlobalDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showBudgetExceededModal, setShowBudgetExceededModal] = useState(false);
  const [budgetExceededData, setBudgetExceededData] = useState(null);

  const [selectedIncomeCategory, setSelectedIncomeCategory] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDate, setIncomeDate] = useState('');

  const incomeCategories = [
    'Salary',
    'Freelance',
    'Gifts',
    'Investment',
    'Bonus',
    'Refund',
    'Business',
    'Others'
  ];

  const getCategoryBudgetAmount = (category) => {
    if (!budget) return 0;

    if (budget.budgetGroup && Array.isArray(budget.budgetGroup)) {
      const categoryBudget = budget.budgetGroup.find(b => b.category === category);
      return categoryBudget ? categoryBudget.amount : 0;
    }

    return budget.amount || 0;
  };

  const getExistingSpentAmount = (category) => {
    if (!budget) return 0;

    let categoryBudget = null;
    if (budget.budgetGroup && Array.isArray(budget.budgetGroup)) {
      categoryBudget = budget.budgetGroup.find(b => b.category === category);
    } else if (budget.category === category) {
      categoryBudget = budget;
    }

    if (!categoryBudget) return 0;

    const budgetId = String(categoryBudget.id || categoryBudget._id || budget.id || budget._id);

    return transactions
      .filter(t => {
        if (t.category?.toLowerCase() !== category.toLowerCase()) return false;
        if (!t.budgetId) return false;

        return String(t.budgetId) === budgetId;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  React.useEffect(() => {
    if (isOpen) {
      const initialData = {};
      categories.forEach(category => {
        initialData[category] = {
          amount: '',
          date: '', 
        };
      });
      setCategoryExpenses(initialData);
      setGlobalDescription('');
      if (!externalTransactionType) {
        setInternalTransactionType('expense');
      }

      setSelectedIncomeCategory('');
      setIncomeAmount('');
      setIncomeDate('');
    }
  }, [isOpen, categories, externalTransactionType]);

  const handleIncomeSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!selectedIncomeCategory) {
      toast.error('Please select a category');
      return;
    }

    if (!incomeAmount || parseFloat(incomeAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!incomeDate) {
      toast.error('Please select a date');
      return;
    }

    setLoading(true);

    try {
      const transactionData = {
        type: 'income',
        category: selectedIncomeCategory,
        amount: parseFloat(incomeAmount),
        date: incomeDate,
        description: globalDescription || `${selectedIncomeCategory} income`,
        account: budget?.name || 'Cash',
        budgetId: null 
      };

      await createTransaction(transactionData);

      if (onExpenseAdded) {
        onExpenseAdded();
      }

      window.dispatchEvent(new Event('transactionAdded'));

      setSuccessMessage(`Successfully added ${formatAmount(parseFloat(incomeAmount))} in income!`);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error adding income:', error);
      const errorMessage = error.message || error.response?.data?.message || 'Failed to add income. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (category, value) => {
    setCategoryExpenses(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        amount: value
      }
    }));
  };

  const handleDateChange = (category, value) => {
    setCategoryExpenses(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        date: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const activeCategories = categories.filter(cat => {
      const rawAmount = categoryExpenses[cat]?.amount;
      return rawAmount && parseFloat(rawAmount) > 0;
    });

    if (activeCategories.length === 0) {
      toast.error('Please enter an amount for at least one category');
      return;
    }

    const categoriesWithoutDates = activeCategories.filter(cat => {
      const date = categoryExpenses[cat]?.date;
      return !date || date.trim() === '';
    });

    if (categoriesWithoutDates.length > 0) {
      const categoryList = categoriesWithoutDates.join(', ');
      toast.error(`Please select a date for: ${categoryList}`);
      return;
    }

    const totalBudget = activeCategories
      .reduce((sum, cat) => sum + getCategoryBudgetAmount(cat), 0);

    const totalExpenses = activeCategories
      .reduce((sum, cat) => {
        const existingSpent = getExistingSpentAmount(cat);
        const rawAmount = categoryExpenses[cat]?.amount || '';
        const newAmount = rawAmount === '' ? 0 : parseFloat(rawAmount) || 0;
        return sum + existingSpent + newAmount;
      }, 0);

    const willExceedBudget = totalExpenses > totalBudget;
    const exceedAmount = totalExpenses - totalBudget;

    if (willExceedBudget) {
      setBudgetExceededData({
        totalBudget,
        totalExpenses,
        exceedAmount
      });
      setShowBudgetExceededModal(true);
      return;
    }

    await submitExpenses();
  };

  const submitExpenses = async () => {
    setLoading(true);

    try {
      const promises = [];

      Object.entries(categoryExpenses).forEach(([category, data]) => {
        if (data.amount && parseFloat(data.amount) > 0) {

          let budgetId = null;
          if (budget) {
            if (budget.budgetGroup && Array.isArray(budget.budgetGroup)) {
              const categoryBudget = budget.budgetGroup.find(b => b.category === category);
              budgetId = categoryBudget ? (categoryBudget.id || categoryBudget.groupId) : (budget.id || budget.groupId);
            } else {
              budgetId = budget.id || budget.groupId;
            }
          }

          const transactionData = {
            type: transactionType,
            category: category,
            amount: parseFloat(data.amount),
            date: data.date,
            description: globalDescription || `${category} ${transactionType}`,
            account: budget?.isAccount ? budget.name : 'Cash',
            budgetId: budget?.isAccount ? null : budgetId
          };

          promises.push(createTransaction(transactionData));
        }
      });

      if (promises.length === 0) {
        setLoading(false);
        return;
      }

      await Promise.all(promises);

      const totalAmount = promises.length > 0 ?
        categories
          .reduce((sum, cat) => {
            const rawAmount = categoryExpenses[cat]?.amount || '';
            const amount = rawAmount === '' ? 0 : parseFloat(rawAmount) || 0;
            return sum + amount;
          }, 0) : 0;

      if (onExpenseAdded) {
        onExpenseAdded();
      }

      window.dispatchEvent(new Event('transactionAdded'));

      await new Promise(resolve => setTimeout(resolve, 500));

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user.email) {
            console.log('💰 QuickExpenseModal: Checking budget alerts for user:', user.email);
            const alerts = await processAndShowAlerts(user.email, true);
            console.log('💰 QuickExpenseModal: Alerts returned:', alerts);
            window.dispatchEvent(new Event('notificationsUpdated'));
          }
        } catch (e) {
          console.error('❌ QuickExpenseModal: Error checking alerts:', e);
        }
      }

      const typeLabel = transactionType === 'expense' ? 'expenses' : 'income';
      setSuccessMessage(`Successfully added ${formatAmount(totalAmount)} in ${typeLabel}!`);

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error adding expenses:', error);
      const errorMessage = error.message || error.response?.data?.message || 'Failed to add expenses. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.id === "backdrop") {
      onClose();
    }
  };

  const handleBudgetExceededConfirm = async () => {
    setShowBudgetExceededModal(false);
    
    setTimeout(async () => {
      await submitExpenses();
    }, 100);
  };

  const handleBudgetExceededCancel = () => {
    setShowBudgetExceededModal(false);
    setBudgetExceededData(null);
  };

  if (!isOpen) return null;

  const budgetTitle = (budget?.label || budget?.name || 'Budget');

  const totalBudgetAmount = transactionType === 'income' ? 0 : categories.reduce((sum, cat) => sum + getCategoryBudgetAmount(cat), 0);
  const totalSpentAmount = transactionType === 'income' ? 0 : categories.reduce((sum, cat) => sum + getExistingSpentAmount(cat), 0);
  const totalRemaining = totalBudgetAmount - totalSpentAmount;

  return (
    <>
      <div
        id="backdrop"
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 font-poppins p-4"
      >
        <div className="bg-white rounded-[30px] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <FiX size={24} />
          </button>

          <div className="pt-8 pb-4 px-6 text-center">
            <div
              className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #86efac 0%, #22c55e 100%)',
                boxShadow: '0 10px 25px -5px rgba(34, 197, 94, 0.4)'
              }}
            >
              {budget.icon && typeof budget.icon === 'string' && budget.icon.startsWith('data:') ? (
                <img
                  src={budget.icon}
                  alt="Budget Icon"
                  className="w-10 h-10 object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              ) : (
                <FiDollarSign className="text-white" size={40} />
              )}
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-4">{budgetTitle}</h2>

            {transactionType === 'income' ? (
              
              <div className="flex justify-center items-center gap-8 text-sm">
                <div className="text-center">
                  <p className="text-gray-500 text-xs mb-1">Total Income</p>
                  <p className="font-bold text-gray-900">{formatAmount(budget.balance || 0)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-xs mb-1">
                    {new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' })}
                  </p>
                </div>
              </div>
            ) : (
              
              <div className="flex justify-center items-center gap-8 text-sm">
                <div className="text-center">
                  <p className="text-gray-500 text-xs mb-1">Total Budget</p>
                  <p className="font-bold text-gray-900">{formatAmount(totalBudgetAmount)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-xs mb-1">Total Expenses</p>
                  <p className="font-bold text-red-500">{formatAmount(totalSpentAmount)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-xs mb-1">Total Remaining</p>
                  <p className={`font-bold ${totalRemaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatAmount(totalRemaining)}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 pb-8">
            {transactionType === 'income' ? (
              
              <>
                <h3 className="font-semibold text-gray-800 mb-4">Select Categories</h3>

                <div className="mb-4">
                  <select
                    value={selectedIncomeCategory}
                    onChange={(e) => setSelectedIncomeCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors bg-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {incomeCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={incomeAmount}
                        onChange={(e) => setIncomeAmount(e.target.value)}
                        onWheel={(e) => e.target.blur()}
                        className="w-full pl-3 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors no-spinner"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">PHP</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={incomeDate}
                      onChange={(e) => setIncomeDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-green-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block font-semibold text-gray-800 mb-2">
                    Description <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={globalDescription}
                    onChange={(e) => setGlobalDescription(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors resize-none h-32 bg-gray-50"
                    placeholder="add notes"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleIncomeSubmit}
                    disabled={loading}
                    className="flex-1 py-3 bg-green-400 text-white font-bold rounded-xl hover:bg-green-500 transition-colors shadow-lg shadow-green-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Adding...' : 'Add Income'}
                  </button>
                </div>
              </>
            ) : (
              
              <>
                <h3 className="font-semibold text-gray-800 mb-4">Categories</h3>

                <div className="space-y-4 border border-gray-100 rounded-2xl p-4 mb-6">
                  {categories.map((category) => {
                    const budgetAmount = getCategoryBudgetAmount(category);
                    const existingSpent = getExistingSpentAmount(category);
                    const rawAmount = categoryExpenses[category]?.amount ?? '';
                    const enteredAmount = rawAmount === '' ? 0 : parseFloat(rawAmount) || 0;
                    const remainingBudget = budgetAmount - existingSpent - enteredAmount;

                    return (
                      <div key={category} className="grid grid-cols-1 gap-y-2">
                        
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-gray-700">{category}</div>
                          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200">
                            Budget: {formatAmount(budgetAmount)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Amount</label>
                            <div className="relative">
                              <input
                                type="number"
                                value={categoryExpenses[category]?.amount ?? ''}
                                onChange={(e) => handleAmountChange(category, e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 transition-colors no-spinner"
                                placeholder="0.00"
                                min="0"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">PHP</span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Date Paid <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <input
                                type="date"
                                value={categoryExpenses[category]?.date ?? ''}
                                onChange={(e) => handleDateChange(category, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:border-green-500 transition-colors"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mb-8">
                  <label className="block font-semibold text-gray-800 mb-2">
                    Description <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={globalDescription}
                    onChange={(e) => setGlobalDescription(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors resize-none h-32 bg-gray-50"
                    placeholder="add notes"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-3 bg-green-400 text-white font-bold rounded-xl hover:bg-green-500 transition-colors shadow-lg shadow-green-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Adding...' : 'Add Expense'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onClose(); 
        }}
        message={successMessage}
      />

      <BudgetExceededModal
        isOpen={showBudgetExceededModal}
        onClose={handleBudgetExceededCancel}
        onConfirm={handleBudgetExceededConfirm}
        budgetAmount={budgetExceededData?.totalBudget || 0}
        totalExpenses={budgetExceededData?.totalExpenses || 0}
        exceedAmount={budgetExceededData?.exceedAmount || 0}
        formatAmount={formatAmount}
      />
    </>
  );
};

export default QuickExpenseModal;
