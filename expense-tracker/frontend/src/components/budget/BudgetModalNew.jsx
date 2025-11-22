import React, { useState, useEffect } from 'react';
import { FiX, FiChevronDown, FiChevronUp, FiDollarSign, FiExternalLink, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import IconCatalogModal from './IconCatalogModal';
import InsufficientBalanceModal from './InsufficientBalanceModal';
import SuccessModal from '../transactions/SuccessModal';
import { getAccounts } from '../../services/accountApiService';
import { getBudgets } from '../../services/budgetApiService';

const BudgetModalNew = ({ onClose, onSubmit, editingBudget }) => {
  const navigate = useNavigate();
  const [totalBudgetAmount, setTotalBudgetAmount] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState({});
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [budgetName, setBudgetName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedIconColor, setSelectedIconColor] = useState('#34A853');
  const [showIconCatalog, setShowIconCatalog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [showInsufficientBalanceModal, setShowInsufficientBalanceModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [existingBudgets, setExistingBudgets] = useState([]);
  const [allocatedAmounts, setAllocatedAmounts] = useState({});
  const [customCategories, setCustomCategories] = useState([]);
  const categories = [
    'Food',
    'Transportation',
    'Bills',
    'Entertainment',
    'Shopping',
    'Grocery',
    'Others'
  ];

  const subCategories = {
    Bills: ['Electricity', 'Water', 'Internet', 'Phone', 'Rent', 'Insurance']
  };

  useEffect(() => {
    const loadAccountsAndBudgets = async () => {
      try {
        
        const result = await getAccounts();
        if (result.success) {
          const enabledAccounts = result.accounts.filter(acc => acc.enabled);
          setAccounts(enabledAccounts);
          if (enabledAccounts.length > 0) {
            setSelectedAccount(enabledAccounts[0]._id);
          }
        }

        const budgetsResult = await getBudgets();
        if (budgetsResult) {
          setExistingBudgets(budgetsResult);

          const allocated = {};
          budgetsResult.forEach(budget => {
            const accountId = budget.accountId;
            if (accountId) {
              allocated[accountId] = (allocated[accountId] || 0) + (budget.amount || 0);
            }
          });
          setAllocatedAmounts(allocated);
        }
      } catch (error) {
        console.error('Error loading accounts and budgets:', error);
      } finally {
        setLoadingAccounts(false);
      }
    };

    loadAccountsAndBudgets();
  }, []);

  const handleIconSelect = (iconData) => {
    setSelectedIcon(iconData.src);
    setSelectedIconColor(iconData.color || '#34A853');
    setShowIconCatalog(false);
  };

  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
      const newBudgets = { ...categoryBudgets };
      delete newBudgets[category];
      setCategoryBudgets(newBudgets);

      if (selectedSubCategories[category]) {
        const newSubCats = { ...selectedSubCategories };
        delete newSubCats[category];
        setSelectedSubCategories(newSubCats);
      }

      if (category === 'Others') {
        
        const newBudgets = { ...categoryBudgets };
        customCategories.forEach(customCat => {
          delete newBudgets[`Others-${customCat}`];
        });
        setCategoryBudgets(newBudgets);
        setCustomCategories([]);
      }
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleAddCustomCategory = () => {
    setCustomCategories([...customCategories, '']);
  };

  const handleRemoveCustomCategory = (index) => {
    const category = customCategories[index];
    const newCustomCategories = customCategories.filter((_, i) => i !== index);
    setCustomCategories(newCustomCategories);

    if (category) {
      const newBudgets = { ...categoryBudgets };
      delete newBudgets[`Others-${category}`];
      setCategoryBudgets(newBudgets);
    }
  };

  const handleCustomCategoryChange = (index, value) => {
    const newCustomCategories = [...customCategories];
    const oldValue = newCustomCategories[index];
    newCustomCategories[index] = value;
    setCustomCategories(newCustomCategories);

    if (oldValue && categoryBudgets[`Others-${oldValue}`]) {
      const newBudgets = { ...categoryBudgets };
      newBudgets[`Others-${value}`] = newBudgets[`Others-${oldValue}`];
      delete newBudgets[`Others-${oldValue}`];
      setCategoryBudgets(newBudgets);
    }
  };

  const handleSubCategoryToggle = (mainCategory, subCat) => {
    setSelectedSubCategories(prev => {
      const current = prev[mainCategory] || [];
      const updated = current.includes(subCat)
        ? current.filter(s => s !== subCat)
        : [...current, subCat];

      if (updated.length === 0) {
        const newSub = { ...prev };
        delete newSub[mainCategory];
        return newSub;
      }

      return { ...prev, [mainCategory]: updated };
    });

    const budgetKey = `${mainCategory} - ${subCat}`;
    if (selectedSubCategories[mainCategory]?.includes(subCat)) {
      const newBudgets = { ...categoryBudgets };
      delete newBudgets[budgetKey];
      setCategoryBudgets(newBudgets);
    }
  };

  const handleCategoryBudgetChange = (key, value) => {
    setCategoryBudgets(prev => ({ ...prev, [key]: value }));
  };

  const processBudgetCreation = () => {
    const budgetItems = [];

    if (selectedCategories.includes('Others')) {
      if (customCategories.length === 0) {
        alert('Please add at least one custom category for "Others".');
        return;
      }

      for (let i = 0; i < customCategories.length; i++) {
        if (!customCategories[i].trim()) {
          alert(`Please enter a name for custom category #${i + 1}.`);
          return;
        }
      }
    }

    for (const category of selectedCategories) {
      
      if (category === 'Others') {
        
        for (const customCat of customCategories) {
          const budgetKey = `Others-${customCat}`;
          if (!categoryBudgets[budgetKey] || parseFloat(categoryBudgets[budgetKey]) <= 0) {
            alert(`Please enter a valid budget amount for ${customCat}.`);
            return;
          }
          budgetItems.push({
            category: customCat.trim(),
            amount: parseFloat(categoryBudgets[budgetKey]),
            label: budgetName,
            name: budgetName,
            description,
            dueDate,
            icon: selectedIcon,
            iconColor: selectedIconColor,
            totalBudget: parseFloat(totalBudgetAmount),
            categoryCount: selectedCategories.length - 1 + customCategories.length,
            accountId: selectedAccount
          });
        }
        continue;
      }

      const hasSubCategories = selectedSubCategories[category]?.length > 0;

      if (hasSubCategories) {
        for (const subCat of selectedSubCategories[category]) {
          const budgetKey = `${category} - ${subCat}`;
          if (!categoryBudgets[budgetKey] || parseFloat(categoryBudgets[budgetKey]) <= 0) {
            alert(`Please enter a valid budget amount for ${budgetKey}.`);
            return;
          }
          budgetItems.push({
            category: budgetKey,
            amount: parseFloat(categoryBudgets[budgetKey]),
            label: budgetName,
            name: budgetName,
            description,
            dueDate,
            icon: selectedIcon,
            iconColor: selectedIconColor,
            totalBudget: parseFloat(totalBudgetAmount),
            categoryCount: selectedCategories.length - 1 + customCategories.length,
            accountId: selectedAccount
          });
        }
      } else {
        if (!categoryBudgets[category] || parseFloat(categoryBudgets[category]) <= 0) {
          alert(`Please enter a valid budget amount for ${category}.`);
          return;
        }
        budgetItems.push({
          category,
          amount: parseFloat(categoryBudgets[category]),
          label: budgetName,
          name: budgetName,
          description,
          dueDate,
          icon: selectedIcon,
          iconColor: selectedIconColor,
          totalBudget: parseFloat(totalBudgetAmount),
          categoryCount: selectedCategories.length - 1 + customCategories.length,
          accountId: selectedAccount
        });
      }
    }

    if (budgetItems.length > 1) {
      onSubmit(pendingSubmit || new Event('submit'), budgetItems);
    } else if (budgetItems.length === 1) {
      onSubmit(pendingSubmit || new Event('submit'), budgetItems[0]);
    }

    setShowSuccessModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!totalBudgetAmount || parseFloat(totalBudgetAmount) <= 0) {
      alert('Please enter a valid total budget amount.');
      return;
    }

    if (selectedCategories.length === 0) {
      alert('Please select at least one category.');
      return;
    }

    const account = accounts.find(acc => acc._id === selectedAccount);
    const budgetAmount = parseFloat(totalBudgetAmount);
    if (account && budgetAmount > account.balance) {
      setPendingSubmit(e);
      setShowInsufficientBalanceModal(true);
      return;
    }

    processBudgetCreation();
  };

  const handleInsufficientBalanceConfirm = () => {
    setShowInsufficientBalanceModal(false);
    processBudgetCreation();
  };

  const handleInsufficientBalanceCancel = () => {
    setShowInsufficientBalanceModal(false);
    setPendingSubmit(null);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target.id === "backdrop") {
      onClose();
    }
  };

  return (
    <>
      <div
        id="backdrop"
        onClick={handleBackdropClick}
        className={`fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 font-poppins p-4 ${showSuccessModal ? 'hidden' : ''}`}
      >
        <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <h2 className="text-xl font-bold text-gray-900">Create New Budget</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Budget Amount<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="budget-total-amount-input"
                  type="number"
                  value={totalBudgetAmount}
                  onChange={(e) => setTotalBudgetAmount(e.target.value)}
                  onWheel={(e) => e.target.blur()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-16 text-gray-900 no-spinner"
                  placeholder="000000"
                  min="0"
                  step="0.01"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  PHP
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Name<span className="text-red-500">*</span>
              </label>
              <input
                id="budget-name-input"
                type="text"
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                placeholder="e.g., Monthly Household Budget"
                maxLength={50}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Account<span className="text-red-500">*</span>
              </label>
              {loadingAccounts ? (
                <div className="text-sm text-gray-500">Loading accounts...</div>
              ) : accounts.length === 0 ? (
                <div className="border border-orange-300 bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-orange-800 mb-2">
                    You don't have any accounts yet. Create an account first to track your budget expenses.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/accounts');
                    }}
                    className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Go to Accounts Page
                    <FiExternalLink size={14} />
                  </button>
                </div>
              ) : (
                <select
                  id="budget-account-select"
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  required
                >
                  {accounts.map(account => (
                    <option key={account._id} value={account._id}>
                      {account.name} - ₱{account.balance.toLocaleString()}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Expenses from this budget will be deducted from the selected account
              </p>

              {selectedAccount && (() => {
                const account = accounts.find(acc => acc._id === selectedAccount);
                if (!account) return null;

                const allocatedToAccount = allocatedAmounts[selectedAccount] || 0;
                const availableBalance = account.balance - allocatedToAccount;
                const budgetAmount = parseFloat(totalBudgetAmount) || 0;

                return (
                  <>
                    
                    {allocatedToAccount > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <FiInfo className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                          <div className="flex-1">
                            <p className="text-sm text-blue-800 font-medium">Budget Allocation Status</p>
                            <div className="text-xs text-blue-700 mt-1.5 space-y-1">
                              <p>• Already budgeted: ₱{allocatedToAccount.toLocaleString()}</p>
                              <p className="font-semibold">• Available for new budget: ₱{Math.max(0, availableBalance).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {allocatedToAccount >= account.balance && budgetAmount > 0 && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <FiAlertTriangle className="text-red-600 mt-0.5 flex-shrink-0" size={16} />
                          <div className="flex-1">
                            <p className="text-sm text-red-800 font-medium">Account Fully Allocated</p>
                            <p className="text-xs text-red-700 mt-1">
                              This account's funds are already fully allocated to existing budgets.
                              You may still create this budget, but be aware that expenses will exceed your available funds.
                            </p>
                            <p className="text-xs text-red-700 mt-2">
                              Please use a different account or{' '}
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  navigate('/accounts');
                                }}
                                className="text-red-800 font-semibold underline hover:text-red-900"
                              >
                                add a new one here
                              </button>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {allocatedToAccount < account.balance && budgetAmount > availableBalance && budgetAmount > 0 && (
                      <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <FiAlertTriangle className="text-orange-600 mt-0.5 flex-shrink-0" size={16} />
                          <div className="flex-1">
                            <p className="text-sm text-orange-800 font-medium">Budget Exceeds Available Balance</p>
                            <p className="text-xs text-orange-700 mt-1">
                              You have ₱{availableBalance.toLocaleString()} available, but this budget is ₱{budgetAmount.toLocaleString()}.
                              You're over by ₱{(budgetAmount - availableBalance).toLocaleString()}.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {allocatedToAccount > 0 && budgetAmount > 0 && budgetAmount <= availableBalance && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <div className="flex-1">
                            <p className="text-xs text-green-700">
                              This budget fits within your available balance of ₱{availableBalance.toLocaleString()}.
                              Remaining after this budget: ₱{(availableBalance - budgetAmount).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}

              {selectedAccount && totalBudgetAmount && (() => {
                const account = accounts.find(acc => acc._id === selectedAccount);
                const budgetAmount = parseFloat(totalBudgetAmount);
                if (account && budgetAmount > account.balance) {
                  return (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-red-600 text-sm font-semibold">⚠️</span>
                        <div className="flex-1">
                          <p className="text-sm text-red-800 font-medium">Insufficient Balance</p>
                          <p className="text-xs text-red-700 mt-1">
                            Account balance: ₱{account.balance.toLocaleString()} •
                            Budget amount: ₱{budgetAmount.toLocaleString()} •
                            Short by: ₱{(budgetAmount - account.balance).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Categories<span className="text-red-500">*</span>
              </label>
              <div id="budget-categories-section" className="border border-gray-300 rounded-lg p-4 min-h-[100px]">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryToggle(category)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors ${selectedCategories.includes(category)
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {category}
                      {selectedCategories.includes(category) && (
                        <FiX size={14} className="ml-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Click on categories to select or deselect them
              </p>

              {selectedCategories.includes('Others') && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Custom Categories<span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddCustomCategory}
                      className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                    >
                      <span>+ Add Category</span>
                    </button>
                  </div>

                  {customCategories.length === 0 ? (
                    <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500">No custom categories added yet</p>
                      <button
                        type="button"
                        onClick={handleAddCustomCategory}
                        className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        + Add your first custom category
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {customCategories.map((customCat, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={customCat}
                            onChange={(e) => handleCustomCategoryChange(index, e.target.value)}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                            placeholder={`e.g., ${index === 0 ? 'Hobbies' : index === 1 ? 'Gifts' : 'Pet Care'}`}
                            maxLength={30}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomCategory(index)}
                            className="p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove category"
                          >
                            <FiX size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Add as many custom categories as you need
                  </p>
                </div>
              )}
            </div>

            {selectedCategories.some(cat => subCategories[cat]) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub-categories for Bills
                </label>
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories
                      .filter(cat => subCategories[cat])
                      .map(category =>
                        subCategories[category].map(subCat => (
                          <button
                            key={`${category}-${subCat}`}
                            type="button"
                            onClick={() => handleSubCategoryToggle(category, subCat)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors ${selectedSubCategories[category]?.includes(subCat)
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            {subCat}
                            {selectedSubCategories[category]?.includes(subCat) && (
                              <FiX size={14} className="ml-0.5" />
                            )}
                          </button>
                        ))
                      )}
                  </div>
                </div>
              </div>
            )}

            {selectedCategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Set Budget for each categories<span className="text-red-500">*</span>
                </label>
                <div id="budget-category-amounts-section" className="space-y-3 border border-gray-300 rounded-lg p-4">
                  {selectedCategories.map((category) => {
                    
                    if (category === 'Others') {
                      return null;
                    }

                    const hasSubCategories = selectedSubCategories[category]?.length > 0;

                    if (hasSubCategories) {
                      return selectedSubCategories[category].map((subCat) => {
                        const budgetKey = `${category} - ${subCat}`;
                        return (
                          <div key={budgetKey} className="flex items-center justify-between gap-4">
                            <span className="text-sm text-gray-700 font-medium">{budgetKey}</span>
                            <div className="relative w-32">
                              <input
                                type="number"
                                value={categoryBudgets[budgetKey] || ''}
                                onChange={(e) => handleCategoryBudgetChange(budgetKey, e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-right pr-12 no-spinner"
                                placeholder="0000"
                                min="0"
                                step="0.01"
                                required
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                                PHP
                              </span>
                            </div>
                          </div>
                        );
                      });
                    }

                    return (
                      <div key={category} className="flex items-center justify-between gap-4">
                        <span className="text-sm text-gray-700 font-medium">{category}</span>
                        <div className="relative w-32">
                          <input
                            type="number"
                            value={categoryBudgets[category] || ''}
                            onChange={(e) => handleCategoryBudgetChange(category, e.target.value)}
                            onWheel={(e) => e.target.blur()}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-right pr-12 no-spinner"
                            placeholder="0000"
                            min="0"
                            step="0.01"
                            required
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                            PHP
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {selectedCategories.includes('Others') && customCategories.map((customCat, index) => {
                    const budgetKey = `Others-${customCat}`;
                    return (
                      <div key={budgetKey} className="flex items-center justify-between gap-4">
                        <span className="text-sm text-gray-700 font-medium">
                          {customCat || `Custom Category #${index + 1}`}
                        </span>
                        <div className="relative w-32">
                          <input
                            type="number"
                            value={categoryBudgets[budgetKey] || ''}
                            onChange={(e) => handleCategoryBudgetChange(budgetKey, e.target.value)}
                            onWheel={(e) => e.target.blur()}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-right pr-12 no-spinner"
                            placeholder="0000"
                            min="0"
                            step="0.01"
                            required
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                            PHP
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <div
                  onClick={() => setShowIconCatalog(true)}
                  className="w-16 h-16 rounded-xl flex items-center justify-center cursor-pointer border-2 border-gray-300 hover:border-green-400 transition-colors"
                  style={{ backgroundColor: selectedIconColor }}
                >
                  {selectedIcon ? (
                    <img
                      src={selectedIcon}
                      alt="Icon"
                      className="w-8 h-8 object-contain"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  ) : (
                    <span className="text-white text-2xl">+</span>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="add notes"
                rows="3"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                id="budget-save-button"
                type="submit"
                disabled={accounts.length === 0}
                className={`flex-1 px-6 py-3 rounded-lg transition-colors font-medium ${accounts.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
              >
                {accounts.length === 0 ? 'Create Account First' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <IconCatalogModal
        isOpen={showIconCatalog}
        onClose={() => setShowIconCatalog(false)}
        onSelectIcon={handleIconSelect}
      />

      <InsufficientBalanceModal
        isOpen={showInsufficientBalanceModal}
        onClose={handleInsufficientBalanceCancel}
        onConfirm={handleInsufficientBalanceConfirm}
        accountName={accounts.find(acc => acc._id === selectedAccount)?.name || ''}
        accountBalance={accounts.find(acc => acc._id === selectedAccount)?.balance || 0}
        budgetAmount={parseFloat(totalBudgetAmount) || 0}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        message={`Your budget "${budgetName}" has been created successfully!`}
      />
    </>
  );
};

export default BudgetModalNew;
