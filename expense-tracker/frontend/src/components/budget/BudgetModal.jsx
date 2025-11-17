import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaWallet, FaShoppingCart, FaCar, FaUtensils, FaFilm, FaGift } from 'react-icons/fa';
import IconCatalogModal from './IconCatalogModal';

const BudgetModal = ({ onClose, onSubmit, formData, setFormData, editingBudget }) => {
  const [budgetType, setBudgetType] = useState('Single');
  const [budgetName, setBudgetName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('FaWallet');
  const [selectedIconSrc, setSelectedIconSrc] = useState(null);
  const [selectedIconColor, setSelectedIconColor] = useState('#34A853');
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [showIconCatalog, setShowIconCatalog] = useState(false);
  const categories = ['Food', 'Transportation', 'Bills', 'Entertainment', 'Shopping', 'Grocery', 'Specify'];
  
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
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim() && !selectedCategories.includes(customCategory.trim())) {
      setSelectedCategories(prev => [...prev, customCategory.trim()]);
      setCustomCategory('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (budgetType === 'Single') {
      if (!selectedCategory) {
        alert('Please select a category.');
        return;
      }
    } else {
      if (selectedCategories.length === 0) {
        alert('Please select at least one category.');
        return;
      }
      if (!budgetName || budgetName.trim() === '') {
        alert('Please enter a budget name.');
        return;
      }
    }
    
    if (!budgetLimit || parseFloat(budgetLimit) <= 0) {
      alert('Please enter a valid budget amount.');
      return;
    }
    
    if (budgetType === 'Single') {
      const budgetData = {
        category: selectedCategory,
        amount: parseFloat(budgetLimit),
        description: description,
        dueDate,
        type: budgetType
      };
      onSubmit(e, budgetData);
    } else {
      const budgetItems = selectedCategories.map(category => ({
        category,
        amount: parseFloat(budgetLimit) / selectedCategories.length,
        dueDate,
        type: budgetType,
        name: budgetName,
        icon: selectedIconSrc,
        iconColor: selectedIconColor,
        totalBudget: parseFloat(budgetLimit),
        categoryCount: selectedCategories.length
      }));
      onSubmit(e, budgetItems);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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

          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Create New Budget
          </h3>

          <div className="flex bg-gray-200 rounded-full p-1 w-fit">
            <button
              type="button"
              onClick={() => setBudgetType('Single')}
              className={`px-4 py-1 text-sm font-medium rounded-full transition-colors ${
                budgetType === 'Single'
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Single
            </button>
            <button
              type="button"
              onClick={() => setBudgetType('Multi')}
              className={`px-4 py-1 text-sm font-medium rounded-full transition-colors ${
                budgetType === 'Multi'
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Multi
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {budgetType === 'Multi' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Budget Name"
                required
              />
            </div>
          )}

          {budgetType === 'Single' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Add a description (optional)"
                  rows="3"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Categories <span className="text-red-500">*</span>
              </label>
              <div className="relative">
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
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {budgetType === 'Multi' ? 'Total Budget Limit' : 'Budget Limit'} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-16"
                placeholder="10000"
                min="0"
                step="0.01"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                PHP
              </span>
            </div>
            {budgetType === 'Multi' && selectedCategories.length > 0 && budgetLimit && (
              <p className="text-xs text-gray-500 mt-1">
                All {selectedCategories.length} categories will share this PHP {parseFloat(budgetLimit).toFixed(2)} budget
              </p>
            )}
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

          {budgetType === 'Multi' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon <span className="text-red-500">*</span>
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
          )}

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
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Add
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
