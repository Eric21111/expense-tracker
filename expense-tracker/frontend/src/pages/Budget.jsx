import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { useSidebar } from '../contexts/SidebarContext';
import aiIcon from '../assets/budget/ai.svg';
import alertIcon from '../assets/budget/alert.svg';
import coinsIcon from '../assets/budget/coins.svg';
import moneyIcon from '../assets/budget/money.svg';
import progressIcon from '../assets/budget/progress.svg';
import shoppingIcon from '../assets/budget/pig.svg';
import groceryIcon from '../assets/budget/grocery.svg';
import transportationIcon from '../assets/budget/transportation.svg';
import Sidebar from '../components/shared/Sidebar';
import Header2 from '../components/shared/Header2';
import { getTransactions, getTransactionSummary } from '../services/transactionService';
import BillsIcon from '../assets/categories/bills.svg';
import TransportationCategoryIcon from '../assets/categories/transportation.svg';
import ShoppingCategoryIcon from '../assets/categories/shopping.svg';

const Budget = () => {
  const { isExpanded } = useSidebar();
  const [username, setUsername] = useState('User');
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalExpense: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    icon: 'shoppingIcon',
    gradient: 'from-pink-500 to-pink-600',
    budgetType: 'multi',
    startDate: '',
    endDate: ''
  });

  const categoryConfig = {
    "Food": { 
      icon: ShoppingCategoryIcon, 
      gradient: "from-orange-400 to-orange-600" 
    },
    "Transportation": { 
      icon: TransportationCategoryIcon, 
      gradient: "from-blue-400 to-blue-600" 
    },
    "Bills": { 
      icon: BillsIcon, 
      gradient: "from-purple-400 to-purple-600" 
    },
    "Entertainment": { 
      icon: ShoppingCategoryIcon, 
      gradient: "from-yellow-400 to-amber-500" 
    },
    "Shopping": { 
      icon: ShoppingCategoryIcon, 
      gradient: "from-pink-500 to-pink-600" 
    },
    "Grocery": { 
      icon: ShoppingCategoryIcon, 
      gradient: "from-green-500 to-green-600" 
    },
    "Others": { 
      icon: ShoppingCategoryIcon, 
      gradient: "from-green-400 to-green-500" 
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUsername(user.name || user.displayName || 'User');
      } catch (e) {}
    }
    loadBudgets();
    fetchTransactions();
  }, []);

  const loadBudgets = () => {
    const savedBudgets = localStorage.getItem('budgets');
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.id === "backdrop") {
      closeModal();
    }
  };
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const [transactionsRes, summaryRes] = await Promise.all([
        getTransactions({
          type: 'expense',
          startDate: startOfMonth.toISOString(),
          endDate: endOfMonth.toISOString()
        }),
        getTransactionSummary({
          startDate: startOfMonth.toISOString(),
          endDate: endOfMonth.toISOString()
        })
      ]);

      if (transactionsRes.success) {
        setTransactions(transactionsRes.transactions);
      }
      if (summaryRes.success) {
        setSummary(summaryRes.summary);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCategorySpent = (category) => {
    return transactions
      .filter(t => t.category.toLowerCase() === category.toLowerCase())
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const saveBudgets = (newBudgets) => {
    setBudgets(newBudgets);
    localStorage.setItem('budgets', JSON.stringify(newBudgets));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const config = categoryConfig[formData.category] || categoryConfig["Others"];
    
    if (editingBudget) {
      const updatedBudgets = budgets.map((budget) =>
        budget.id === editingBudget.id
          ? { 
              ...formData, 
              id: editingBudget.id, 
              amount: parseFloat(formData.amount),
              icon: config.icon,
              gradient: config.gradient
            }
          : budget
      );
      saveBudgets(updatedBudgets);
    } else {
      const newBudget = {
        ...formData,
        id: Date.now(),
        amount: parseFloat(formData.amount),
        createdAt: new Date().toISOString(),
        icon: config.icon,
        gradient: config.gradient
      };
      saveBudgets([...budgets, newBudget]);
    }
    closeModal();
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      icon: budget.icon,
      gradient: budget.gradient
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      saveBudgets(budgets.filter((budget) => budget.id !== id));
    }
  };

  const openModal = () => {
    setEditingBudget(null);
    setFormData({
      category: '',
      amount: '',
      icon: 'shoppingIcon',
      gradient: 'from-pink-500 to-pink-600',
      budgetType: 'multi',
      startDate: '',
      endDate: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBudget(null);
  };

  const getBudgetStatus = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return { label: 'Over Budget', color: 'bg-red-100 text-red-600' };
    if (percentage >= 80) return { label: 'Near Limit', color: 'bg-amber-100 text-amber-600' };
    return { label: 'On Track', color: 'bg-green-100 text-green-600' };
  };

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalRemaining = totalBudgeted - summary.totalExpense;

  const generateInsights = () => {
    const insights = [];
    budgets.forEach(budget => {
      const spent = calculateCategorySpent(budget.category);
      const percentage = (spent / budget.amount) * 100;
      if (percentage >= 80 && percentage < 100) {
        insights.push({
          type: 'warning',
          title: 'Budget Alert',
          message: `You're about to exceed your ${budget.category} budget. ${((budget.amount - spent)).toFixed(0)} PHP remaining.`
        });
      } else if (percentage >= 100) {
        insights.push({
          type: 'danger',
          title: 'Over Budget!',
          message: `You've exceeded your ${budget.category} budget by PHP ${(spent - budget.amount).toFixed(0)}.`
        });
      }
    });
    if (insights.length === 0) {
      insights.push({
        type: 'success',
        title: 'Great Progress!',
        message: 'You\'re staying within your budgets. Keep up the good work!'
      });
    }
    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="flex min-h-screen bg-[#F5F5F5] font-poppins">
      <Sidebar />
      <main
        className={`flex-1 bg-gray-50 transition-all duration-300 ease-in-out ${
          isExpanded ? "ml-64" : "ml-20"
        }`}
      >
        <Header2 username={username} title="Budget" />
       
        <div className="w-full max-w-[1400px] px-12 py-8 mx-auto">
   
   
      <div className="flex flex-col lg:flex-row items-start gap-6 mb-9">
         
       
        <div className="flex flex-col lg:flex-row flex-1 gap-6 w-full">
         
       
          <div className="flex-1 bg-white p-6 px-7 rounded-[20px] shadow-md relative overflow-hidden flex flex-col justify-center h-[180px] text-left">
            <h2 className="text-[30px] font-bold text-gray-900 mb-2 tracking-tight">
              {loading ? 'Loading...' : `PHP ${totalBudgeted.toLocaleString()}`}
            </h2>
            <p className="text-sm font-semibold mb-1 leading-tight">
              Total Budgeted
            </p>
            <div className="absolute top-6 right-5 w-14 h-14 opacity-90">
              <img src={shoppingIcon} alt="Wallet" className="w-full h-full object-contain" />
            </div>
          </div>


         
          <div className="flex-1 bg-white p-6 px-7 rounded-[20px] shadow-md relative overflow-hidden flex flex-col justify-center h-[180px] text-left">
            <h2 className="text-[30px] font-bold text-gray-900 mb-2 tracking-tight">
              {loading ? 'Loading...' : `PHP ${summary.totalExpense.toLocaleString()}`}
            </h2>
            <p className="text-sm font-semibold mb-1 leading-tight text-amber-500">
              Total Expenses
            </p>
            <span className="text-xs text-gray-400 block">
              Spent so far this month
            </span>
            <div className="absolute top-6 right-5 w-14 h-14 opacity-90">
              <img src={moneyIcon} alt="Expenses" className="w-full h-full object-contain" />
            </div>
          </div>


       
          <div className="flex-1 bg-white p-6 px-7 rounded-[20px] shadow-md relative overflow-hidden flex flex-col justify-center h-[180px] text-left">
            <h2 className="text-[30px] font-bold text-gray-900 mb-2 tracking-tight">
              {loading ? 'Loading...' : `PHP ${totalRemaining.toLocaleString()}`}
            </h2>
            <p className="text-sm font-semibold mb-1 leading-tight text-blue-500">
              Remaining
            </p>
            <span className="text-xs text-gray-400 block">
              Remaining funds for budget
            </span>
            <div className="absolute top-6 right-5 w-14 h-14 opacity-90">
              <img src={coinsIcon} alt="Coins" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>


   
        <div className="w-full lg:w-[420px] flex-shrink-0 bg-gradient-to-br from-[#144221] via-[#34A853] to-[#CCEFCC] p-7 rounded-[20px] shadow-md h-fit">
          <div className="flex items-center gap-2.5 mb-2">
            <img src={aiIcon} alt="Robot" className="w-6 h-6" />
            <h3 className="text-lg font-bold text-white">
              AI Insights
            </h3>
          </div>
          <p className="text-xs text-white mb-6 leading-relaxed">
            Personalized recommendations based on your spending patterns
          </p>


         
          {insights.slice(0, 2).map((insight, index) => (
            <div key={index} className="bg-white p-4 px-[18px] rounded-[14px] mb-3 flex gap-3.5 items-start shadow-sm">
              <div className="flex-shrink-0">
                <img 
                  src={insight.type === 'success' ? progressIcon : alertIcon} 
                  alt="Insight" 
                  className="w-10 h-10 rounded-full object-cover" 
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-900 mb-1">
                  {insight.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {insight.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>


   
      <div className="mt-8 w-215 translate-y-30">
        <div className="mb-6 translate-y-[-220px]">
          <h2 className="text-[20px] font-bold" style={{ color: '#34A853' }}>
            Budget Overview
          </h2>
        </div>

        {budgets.length === 0 ? (
          <div className="bg-white rounded-[20px] shadow-md p-12 text-center translate-y-[-240px]">
            <p className="text-gray-500 text-lg mb-4">No budgets created yet</p>
            <p className="text-gray-400">Start by creating your first budget to track your spending</p>
            <p className="text-gray-400 mt-4">Click the + button below to add a budget</p>
          </div>
        ) : (
        <div className="space-y-6 translate-y-[-240px]">
          {budgets.map((budget) => {
            const spent = calculateCategorySpent(budget.category);
            const remaining = budget.amount - spent;
            const percentage = Math.min((spent / budget.amount) * 100, 100);
            const status = getBudgetStatus(spent, budget.amount);
            const icon = budget.icon || categoryConfig[budget.category]?.icon || ShoppingCategoryIcon;

            return (
              <div key={budget.id} className="bg-white p-6 rounded-[20px] shadow-md">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${budget.gradient} flex items-center justify-center flex-shrink-0`}>
                    <img src={icon} alt={budget.category} className="w-8 h-8" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 capitalize">{budget.category}</h3>
                        <p className="text-xs text-gray-500">{new Date(budget.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                          {status.label}
                        </span>
                        <button 
                          onClick={() => handleEdit(budget)}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(budget.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Budget Limit</p>
                        <p className="text-base font-bold text-gray-900">PHP {budget.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Spent</p>
                        <p className="text-base font-bold text-gray-900">PHP {spent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Remaining</p>
                        <p className={`text-base font-bold ${remaining < 0 ? 'text-red-500' : remaining < budget.amount * 0.2 ? 'text-amber-500' : 'text-green-500'}`}>
                          {remaining < 0 ? '-' : ''}PHP {Math.abs(remaining).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              percentage >= 100 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                              percentage >= 80 ? 'bg-gradient-to-r from-orange-500 to-amber-500' :
                              'bg-gradient-to-r from-green-500 to-green-600'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-gray-600">{percentage.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={openModal}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#34A853] text-white rounded-full shadow-xl hover:bg-[#2d8f47] transition-all hover:scale-110 flex items-center justify-center z-40"
        aria-label="Add Budget"
      >
        <FiPlus className="text-3xl" />
      </button>

      {/* Add/Edit Budget Modal */}
      {showModal && (
        <div
      id="backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 font-poppins p-4"
    >
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 relative shadow-2xl transform transition-all duration-300 scale-100">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-bold mb-6 text-gray-900">
              {editingBudget ? 'Edit Budget' : 'Create New Budget'}
            </h3>

            <form onSubmit={handleSubmit}>
              {/* Single/Multi Toggle */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex bg-gray-100 rounded-full p-1">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, budgetType: 'single' })}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.budgetType === 'single'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600'
                    }`}
                  >
                    Single
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, budgetType: 'multi' })}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.budgetType === 'multi'
                        ? 'bg-[#34A853] text-white shadow-sm'
                        : 'text-gray-600'
                    }`}
                  >
                    Multi
                  </button>
                </div>
              </div>

              {/* Select Category */}
              <div className="mb-5">
                <label className="block text-gray-900 text-sm font-medium mb-2">
                  Select Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34A853] focus:border-transparent appearance-none bg-white cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select category</option>
                    <option value="Food">Food</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Bills">Bills</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Others">Others</option>
                  </select>
                  {/* Dropdown Arrow */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {formData.category && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, category: '' })}
                      className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Budget Limit */}
              <div className="mb-5">
                <label className="block text-gray-900 text-sm font-medium mb-2">
                  Budget Limit <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34A853] focus:border-transparent pr-16"
                    placeholder="10000"
                    min="0"
                    step="0.01"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    PHP
                  </span>
                </div>
              </div>

              {/* Start Date and End Date */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-900 text-sm font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34A853] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 text-sm font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34A853] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#34A853] text-white rounded-lg hover:bg-[#2d8f47] transition-colors font-medium"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default Budget;