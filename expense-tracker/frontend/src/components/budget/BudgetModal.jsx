import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaWallet, FaShoppingCart, FaCar, FaUtensils, FaFilm, FaGift } from 'react-icons/fa';
import IconCatalogModal from './IconCatalogModal';

const BudgetModal = ({ onClose, onSubmit, formData, setFormData, editingBudget }) => {
  const [budgetType, setBudgetType] = useState('Single');
  const [budgetName, setBudgetName] = useState('');
  const [budgetLabel, setBudgetLabel] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [totalBudgetAmount, setTotalBudgetAmount] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('FaWallet');
  const [selectedIconSrc, setSelectedIconSrc] = useState(null);
  const [selectedIconColor, setSelectedIconColor] = useState('#34A853');
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [showIconCatalog, setShowIconCatalog] = useState(false);
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState({});

  const categories = ['Food', 'Transportation', 'Bills', 'Entertainment', 'Shopping', 'Grocery', 'Specify'];

  const subCategories = {
    Bills: ['Water', 'Electricity', 'Internet', 'Phone', 'Rent', 'Insurance']
  };

  const availableIcons = [
    { name: 'FaWallet', component: <FaWallet className="text-green-600 text-lg" /> },
    { name: 'FaShoppingCart', component: <FaShoppingCart className="text-green-600 text-lg" /> },
    { name: 'FaCar', component: <FaCar className="text-green-600 text-lg" /> },
    { name: 'FaUtensils', component: <FaUtensils className="text-green-600 text-lg" /> },
    { name: 'FaFilm', component: <FaFilm className="text-green-600 text-lg" /> },
    { name: 'FaGift', component: <FaGift className="text-green-600 text-lg" /> },
  ];

  const handleIconSelect = (iconData) => {
    setSelectedIcon(iconData.name);
    setSelectedIconSrc(iconData.src);
    setSelectedIconColor(iconData.color || '#34A853');
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      'FaWallet': <FaWallet className="text-green-600 text-xl" />,
      'FaShoppingCart': <FaShoppingCart className="text-green-600 text-xl" />,
      'FaCar': <FaCar className="text-green-600 text-xl" />,
      'FaUtensils': <FaUtensils className="text-green-600 text-xl" />,
      'FaFilm': <FaFilm className="text-green-600 text-xl" />,
      'FaGift': <FaGift className="text-green-600 text-xl" />,
    };
    return iconMap[iconName] || <FaWallet className="text-green-600 text-xl" />;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showIconSelector && !event.target.closest('.icon-selector')) {
        setShowIconSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showIconSelector]);

  useEffect(() => {
    if (editingBudget) {
      setBudgetLimit(formData.amount?.toString() || '');
      setSelectedCategory(formData.category || '');
      setBudgetLabel(formData.label || '');
      setDescription(formData.description || '');
      setSelectedIcon(formData.icon || 'FaWallet');
      setDueDate(formData.dueDate || formData.endDate || '');
    } else {
      setDueDate('');
    }
  }, [editingBudget, formData]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        const updated = prev.filter(cat => cat !== category);
        setCategoryBudgets(prevBudgets => {
          const newBudgets = { ...prevBudgets };
          delete newBudgets[category];
          if (selectedSubCategories[category]) {
            selectedSubCategories[category].forEach(sub => {
              delete newBudgets[`${category} - ${sub}`];
            });
          }
          return newBudgets;
        });
        setSelectedSubCategories(prevSub => {
          const newSub = { ...prevSub };
          delete newSub[category];
          return newSub;
        });
        return updated;
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSubCategoryToggle = (mainCategory, subCategory) => {
    setSelectedSubCategories(prev => {
      const current = prev[mainCategory] || [];
      const updated = current.includes(subCategory)
        ? current.filter(sub => sub !== subCategory)
        : [...current, subCategory];

      if (updated.length === 0) {
        const newSub = { ...prev };
        delete newSub[mainCategory];
        return newSub;
      }

      return {
        ...prev,
        [mainCategory]: updated
      };
    });
  };

  const handleCategoryBudgetChange = (category, value) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const calculateTotalCategoryBudgets = () => {
    return Object.values(categoryBudgets).reduce((sum, value) => {
      const amount = parseFloat(value) || 0;
      return sum + amount;
    }, 0);
  };

  const getRemainingBudget = () => {
    const total = parseFloat(totalBudgetAmount) || 0;
    const used = calculateTotalCategoryBudgets();
    return total - used;
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim() && !selectedCategories.includes(customCategory.trim())) {
      setSelectedCategories(prev => [...prev, customCategory.trim()]);
      setCustomCategory('');
    }
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

    if (getRemainingBudget() < 0) {
      alert('Total allocated budget exceeds the total budget amount. Please adjust your allocations.');
      return;
    }

    const budgetItems = [];
    let totalBudgetForGroup = 0;

    for (const category of selectedCategories) {
      const hasSubCategories = selectedSubCategories[category]?.length > 0;

      if (hasSubCategories) {
        for (const subCat of selectedSubCategories[category]) {
          const budgetKey = `${category} - ${subCat}`;
          if (!categoryBudgets[budgetKey] || parseFloat(categoryBudgets[budgetKey]) <= 0) {
            alert(`Please enter a valid budget amount for ${budgetKey}.`);
            return;
          }
          const amount = parseFloat(categoryBudgets[budgetKey]);
          totalBudgetForGroup += amount;
          budgetItems.push({
            category: budgetKey,
            amount: amount,
            label: budgetLabel,
            name: budgetLabel,
            description: description,
            dueDate,
            icon: selectedIconSrc,
            iconColor: selectedIconColor,
            totalBudget: parseFloat(totalBudgetAmount),
            categoryCount: selectedCategories.length
          });
        }
      } else {
        if (!categoryBudgets[category] || parseFloat(categoryBudgets[category]) <= 0) {
          alert(`Please enter a valid budget amount for ${category}.`);
          return;
        }
        const amount = parseFloat(categoryBudgets[category]);
        totalBudgetForGroup += amount;
        budgetItems.push({
          category,
          amount: amount,
          label: budgetLabel,
          name: budgetLabel,
          description: description,
          dueDate,
          icon: selectedIconSrc,
          iconColor: selectedIconColor,
          totalBudget: parseFloat(totalBudgetAmount),
          categoryCount: selectedCategories.length
        });
      }
    }

    if (budgetItems.length > 1) {
      onSubmit(e, budgetItems);
    } else if (budgetItems.length === 1) {
      onSubmit(e, budgetItems[0]);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCategoryDropdown && !event.target.closest('.category-dropdown-container')) {
        setShowCategoryDropdown(false);
      }
      if (showSubCategoryDropdown && !event.target.closest('.subcategory-dropdown-container')) {
        setShowSubCategoryDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCategoryDropdown, showSubCategoryDropdown]);

  return (
    <div
      id="backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 font-poppins p-4"
    >
      <div className="bg-white rounded-2xl p-4 max-w-md w-full mx-4 relative shadow-2xl transform transition-all duration-300 scale-100 max-h-[80vh] overflow-y-auto">
        <div className="bg-green-100 -m-4 mb-4 rounded-t-2xl p-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h3 className="text-xl font-bold text-gray-900">
            Create New Budget
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Budget Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={totalBudgetAmount}
                onChange={(e) => setTotalBudgetAmount(e.target.value)}
                onWheel={(e) => e.target.blur()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-16 no-spinner"
                placeholder="10000"
                min="0"
                step="0.01"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                PHP
              </span>
            </div>
            {totalBudgetAmount && (
              <div className={`mt-2 p-3 rounded-lg ${getRemainingBudget() < 0 ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Total Budget:</span>
                  <span className="font-semibold text-gray-900">PHP {parseFloat(totalBudgetAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Allocated:</span>
                  <span className={`font-semibold ${getRemainingBudget() < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                    PHP {calculateTotalCategoryBudgets().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Remaining:</span>
                  <span className={`font-bold ${getRemainingBudget() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    PHP {getRemainingBudget().toLocaleString()}
                  </span>
                </div>
                {getRemainingBudget() < 0 && (
                  <p className="text-xs text-red-600 mt-2 font-semibold">
                    ⚠️ Budget exceeded by PHP {Math.abs(getRemainingBudget()).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Label <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              type="text"
              value={budgetLabel}
              onChange={(e) => setBudgetLabel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Monthly Household Budget"
              maxLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">
              Give your budget a memorable name
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Categories <span className="text-red-500">*</span>
            </label>
            <div className="relative category-dropdown-container">
              <div
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer"
              >
                {selectedCategories.length > 0
                  ? selectedCategories.join(', ')
                  : 'Select categories'
                }
              </div>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>

              {showCategoryDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {categories.filter(cat => cat !== 'Specify').map((category) => (
                    <label key={category} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="mr-3 rounded border-gray-300 text-green-500 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}

                  <div className="border-t border-gray-200 p-3">
                    <label className="text-xs font-medium text-gray-600 mb-2 block">Specify Custom Category</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomCategory())}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Custom Category"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomCategory}
                        className="px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {selectedCategories.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-2 uppercase tracking-wide">Preview</p>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: selectedIconColor }}
                  >
                    {selectedIconSrc ? (
                      <img
                        src={selectedIconSrc}
                        alt="Icon"
                        className="w-5 h-5 object-contain"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                    ) : (
                      <div className="text-white text-xl">
                        {getIconComponent(selectedIcon)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    {budgetLabel ? (
                      <>
                        <h4 className="text-sm font-semibold text-gray-900">{budgetLabel}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {selectedCategories.join(', ')}
                        </p>
                      </>
                    ) : (
                      <h4 className="text-sm font-semibold text-gray-900">
                        {selectedCategories.length === 1
                          ? selectedCategories[0]
                          : `${selectedCategories.length} Categories`}
                      </h4>
                    )}
                    {selectedCategories.length > 1 && !budgetLabel && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {selectedCategories.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedCategories.some(cat => subCategories[cat]) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Sub-Categories
              </label>
              {selectedCategories.filter(cat => subCategories[cat]).map((category) => (
                <div key={category} className="mb-2 subcategory-dropdown-container">
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{category}</label>
                  <div className="relative">
                    <div
                      onClick={() => setShowSubCategoryDropdown(showSubCategoryDropdown === category ? null : category)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer text-sm"
                    >
                      {selectedSubCategories[category]?.length > 0
                        ? selectedSubCategories[category].join(', ')
                        : `Select ${category} sub-categories`
                      }
                    </div>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>

                    {showSubCategoryDropdown === category && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {subCategories[category].map((subCat) => (
                          <label key={subCat} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedSubCategories[category]?.includes(subCat) || false}
                              onChange={() => handleSubCategoryToggle(category, subCat)}
                              className="mr-3 rounded border-gray-300 text-green-500 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">{subCat}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedCategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Set Budget for Each Category <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2 border border-gray-300 rounded-lg p-3 max-h-60 overflow-y-auto">
                {selectedCategories.map((category) => {
                  const hasSubCategories = selectedSubCategories[category]?.length > 0;

                  if (hasSubCategories) {
                    return selectedSubCategories[category].map((subCat) => {
                      const budgetKey = `${category} - ${subCat}`;
                      return (
                        <div key={budgetKey} className="flex items-center gap-3">
                          <span className="text-sm text-gray-700 font-medium min-w-[120px]">{category} - {subCat}</span>
                          <div className="relative flex-1">
                            <input
                              type="number"
                              value={categoryBudgets[budgetKey] || ''}
                              onChange={(e) => handleCategoryBudgetChange(budgetKey, e.target.value)}
                              onWheel={(e) => e.target.blur()}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-14 no-spinner"
                              placeholder="0"
                              min="0"
                              step="0.01"
                              required
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                              PHP
                            </span>
                          </div>
                        </div>
                      );
                    });
                  }

                  return (
                    <div key={category} className="flex items-center gap-3">
                      <span className="text-sm text-gray-700 font-medium min-w-[100px]">{category}</span>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={categoryBudgets[category] || ''}
                          onChange={(e) => handleCategoryBudgetChange(category, e.target.value)}
                          onWheel={(e) => e.target.blur()}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-14 no-spinner"
                          placeholder="0"
                          min="0"
                          step="0.01"
                          required
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                          PHP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="Add a description (optional)"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <div className="relative icon-selector">
              <div
                onClick={() => setShowIconCatalog(true)}
                className="w-16 h-16 rounded-xl flex items-center justify-center cursor-pointer border-2 hover:border-green-400 transition-colors p-3"
                style={{ backgroundColor: selectedIconColor }}
              >
                {selectedIconSrc ? (
                  <img
                    src={selectedIconSrc}
                    alt={selectedIcon}
                    className="w-full h-full object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                ) : (
                  <div className="text-white text-2xl">
                    {getIconComponent(selectedIcon)}
                  </div>
                )}
              </div>

              {showIconSelector && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
                  <div className="grid grid-cols-4 gap-3">
                    {availableIcons.map((icon) => (
                      <div
                        key={icon.name}
                        onClick={() => {
                          setSelectedIcon(icon.name);
                          setShowIconSelector(false);
                        }}
                        className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-100 transition-colors"
                      >
                        {icon.component}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Select a due date (optional)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Set a deadline for this budget period
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={totalBudgetAmount && getRemainingBudget() < 0}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${totalBudgetAmount && getRemainingBudget() < 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              title={totalBudgetAmount && getRemainingBudget() < 0 ? 'Budget exceeded! Reduce category allocations.' : ''}
            >
              {totalBudgetAmount && getRemainingBudget() < 0 ? 'Budget Exceeded' : 'Add'}
            </button>
          </div>
        </form>
      </div>

      <IconCatalogModal
        isOpen={showIconCatalog}
        onClose={() => setShowIconCatalog(false)}
        onSelectIcon={handleIconSelect}
        currentIcon={selectedIcon}
      />
    </div>
  );
};

export default BudgetModal;
