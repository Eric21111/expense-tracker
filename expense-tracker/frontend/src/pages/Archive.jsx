import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiRefreshCw, FiTrash2, FiArchive } from 'react-icons/fi';
import { useSidebar } from '../contexts/SidebarContext';
import { useCurrency } from '../contexts/CurrencyContext';
import Sidebar from '../components/shared/Sidebar';
import Header2 from '../components/shared/Header2';
import { useNavigate } from 'react-router-dom';
import { getUserData, setUserData, DATA_TYPES } from '../services/dataIsolationService';

const Archive = () => {
  const { isExpanded } = useSidebar();
  const { formatAmount } = useCurrency();
  const navigate = useNavigate();
  const [username, setUsername] = useState('User');
  const [userEmail, setUserEmail] = useState('');
  const [archivedBudgets, setArchivedBudgets] = useState([]);
  const [selectedBudgets, setSelectedBudgets] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUsername(user.name || user.displayName || 'User');
        setUserEmail(user.email || '');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      loadArchivedBudgets();
    }
  }, [userEmail]);

  const loadArchivedBudgets = () => {
    try {
      const archived = getUserData(DATA_TYPES.ARCHIVED_BUDGETS, userEmail);
      if (archived) {
        setArchivedBudgets(archived);
      }
    } catch (error) {
      console.error('Error loading archived budgets:', error);
    }
  };

  const handleRestore = (budget) => {
    try {
      const currentBudgets = getUserData(DATA_TYPES.BUDGETS, userEmail) || [];
      const restoredBudget = { ...budget };
      delete restoredBudget.archivedAt;
      currentBudgets.push(restoredBudget);
      setUserData(DATA_TYPES.BUDGETS, currentBudgets, userEmail);
      const updatedArchived = archivedBudgets.filter(b => b.id !== budget.id);
      setArchivedBudgets(updatedArchived);
      setUserData(DATA_TYPES.ARCHIVED_BUDGETS, updatedArchived, userEmail);
      
      alert(`Budget "${budget.name || budget.category}" has been restored!`);
    } catch (error) {
      console.error('Error restoring budget:', error);
      alert('Failed to restore budget');
    }
  };

  const handleRestoreSelected = () => {
    if (selectedBudgets.length === 0) {
      alert('Please select budgets to restore');
      return;
    }

    try {
      const currentBudgets = getUserData(DATA_TYPES.BUDGETS, userEmail) || [];
      selectedBudgets.forEach(budgetId => {
        const budget = archivedBudgets.find(b => b.id === budgetId);
        if (budget) {
          const restoredBudget = { ...budget };
          delete restoredBudget.archivedAt;
          currentBudgets.push(restoredBudget);
        }
      });
      
      setUserData(DATA_TYPES.BUDGETS, currentBudgets, userEmail);
      const updatedArchived = archivedBudgets.filter(b => !selectedBudgets.includes(b.id));
      setArchivedBudgets(updatedArchived);
      setUserData(DATA_TYPES.ARCHIVED_BUDGETS, updatedArchived, userEmail);
      
      alert(`${selectedBudgets.length} budget(s) restored successfully!`);
      setSelectedBudgets([]);
    } catch (error) {
      console.error('Error restoring budgets:', error);
      alert('Failed to restore budgets');
    }
  };

  const handlePermanentDelete = (budget) => {
    if (window.confirm(`Permanently delete "${budget.name || budget.category}"? This action cannot be undone.`)) {
      const updatedArchived = archivedBudgets.filter(b => b.id !== budget.id);
      setArchivedBudgets(updatedArchived);
      setUserData(DATA_TYPES.ARCHIVED_BUDGETS, updatedArchived, userEmail);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedBudgets.length === 0) {
      alert('Please select budgets to delete');
      return;
    }

    if (window.confirm(`Permanently delete ${selectedBudgets.length} budget(s)? This action cannot be undone.`)) {
      const updatedArchived = archivedBudgets.filter(b => !selectedBudgets.includes(b.id));
      setArchivedBudgets(updatedArchived);
      setUserData(DATA_TYPES.ARCHIVED_BUDGETS, updatedArchived, userEmail);
      setSelectedBudgets([]);
    }
  };

  const toggleBudgetSelection = (budgetId) => {
    if (selectedBudgets.includes(budgetId)) {
      setSelectedBudgets(selectedBudgets.filter(id => id !== budgetId));
    } else {
      setSelectedBudgets([...selectedBudgets, budgetId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedBudgets.length === archivedBudgets.length) {
      setSelectedBudgets([]);
    } else {
      setSelectedBudgets(archivedBudgets.map(b => b.id));
    }
  };

  const groupedBudgets = {};
  const singleBudgets = [];
  
  archivedBudgets.forEach((budget) => {
    if (budget.groupId) {
      if (!groupedBudgets[budget.groupId]) {
        groupedBudgets[budget.groupId] = [];
      }
      groupedBudgets[budget.groupId].push(budget);
    } else {
      singleBudgets.push(budget);
    }
  });

  const getBudgetStatus = (spent, amount) => {
    const percentage = (spent / amount) * 100;
    if (percentage >= 100) {
      return { label: 'Over Budget', color: 'bg-red-100 text-red-700' };
    } else if (percentage >= 80) {
      return { label: 'Warning', color: 'bg-yellow-100 text-yellow-700' };
    } else {
      return { label: 'On Track', color: 'bg-green-100 text-green-700' };
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F5] font-poppins">
      <Sidebar />
      <main
        className={`flex-1 bg-gray-50 transition-all duration-300 ease-in-out ml-0 lg:ml-20 ${
          isExpanded ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <Header2 username={username} title="Archive" />
        
        <div className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-4 sm:py-6 mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate('/budget')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
              >
                <FiArrowLeft size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Back to Budget</span>
                <span className="sm:hidden">Back</span>
              </button>
            </div>
            
            {archivedBudgets.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={toggleSelectAll}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                >
                  {selectedBudgets.length === archivedBudgets.length ? 'Deselect All' : 'Select All'}
                </button>
                {selectedBudgets.length > 0 && (
                  <>
                    <button
                      onClick={handleRestoreSelected}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs sm:text-sm flex-shrink-0"
                    >
                      <FiRefreshCw size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Restore Selected ({selectedBudgets.length})</span>
                      <span className="sm:hidden">Restore ({selectedBudgets.length})</span>
                    </button>
                    <button
                      onClick={handleDeleteSelected}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs sm:text-sm flex-shrink-0"
                    >
                      <FiTrash2 size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Delete Selected ({selectedBudgets.length})</span>
                      <span className="sm:hidden">Delete ({selectedBudgets.length})</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {archivedBudgets.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 lg:p-12 text-center">
              <FiArchive className="mx-auto text-gray-300 mb-3 sm:mb-4" size={48} />
              <p className="text-gray-500 text-base sm:text-lg mb-2">No archived budgets</p>
              <p className="text-gray-400 text-sm sm:text-base">Deleted budgets will appear here</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {Object.values(groupedBudgets).map((group) => {
                const firstBudget = group[0];
                const totalBudget = group[0].totalBudget || group.reduce((sum, b) => sum + b.amount, 0);
                const categoryNames = group.map(b => b.category).join(', ');
                const displayTitle = firstBudget.name || categoryNames;
                const isSelected = selectedBudgets.includes(firstBudget.id);
                
                return (
                  <div
                    key={firstBudget.groupId}
                    className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-4 sm:p-5 ${
                      isSelected ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleBudgetSelection(firstBudget.id)}
                        className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-green-600 rounded focus:ring-green-500 flex-shrink-0"
                      />
                      
                      <div 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: firstBudget.iconColor || '#34A853' }}
                      >
                        {firstBudget.icon && typeof firstBudget.icon === 'string' && firstBudget.icon.startsWith('data:') ? (
                          <img 
                            src={firstBudget.icon} 
                            alt="Budget Icon" 
                            className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                            style={{ filter: 'brightness(0) invert(1)' }}
                          />
                        ) : (
                          <img src={firstBudget.icon} alt="Budget" className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2 sm:mb-3">
                          <div className="flex-1 pr-2">
                            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate">{displayTitle}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">Multi-Budget • {categoryNames}</p>
                            <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">
                              Archived on {new Date(firstBudget.archivedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleRestore(firstBudget)}
                              className="text-green-500 hover:text-green-600 transition-colors p-1"
                              title="Restore"
                              aria-label="Restore"
                            >
                              <FiRefreshCw size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </button>
                            <button
                              onClick={() => handlePermanentDelete(firstBudget)}
                              className="text-red-500 hover:text-red-600 transition-colors p-1"
                              title="Delete Permanently"
                              aria-label="Delete"
                            >
                              <FiTrash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-xs sm:text-sm text-gray-600">
                          <span className="font-semibold">Budget:</span> {formatAmount(totalBudget)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {singleBudgets.map((budget) => {
                const displayTitle = budget.name || budget.category;
                const status = getBudgetStatus(0, budget.amount);
                const isSelected = selectedBudgets.includes(budget.id);
                
                return (
                  <div
                    key={budget.id}
                    className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-4 sm:p-5 ${
                      isSelected ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleBudgetSelection(budget.id)}
                        className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-green-600 rounded focus:ring-green-500 flex-shrink-0"
                      />
                      
                      <div 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: budget.iconColor || '#34A853' }}
                      >
                        {budget.icon && typeof budget.icon === 'string' && budget.icon.startsWith('data:') ? (
                          <img 
                            src={budget.icon} 
                            alt="Budget Icon" 
                            className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                            style={{ filter: 'brightness(0) invert(1)' }}
                          />
                        ) : (
                          <img src={budget.icon} alt="Budget" className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2 sm:mb-3">
                          <div className="flex-1 pr-2">
                            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate">{displayTitle}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">{budget.category}</p>
                            <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">
                              Archived on {new Date(budget.archivedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleRestore(budget)}
                              className="text-green-500 hover:text-green-600 transition-colors p-1"
                              title="Restore"
                              aria-label="Restore"
                            >
                              <FiRefreshCw size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </button>
                            <button
                              onClick={() => handlePermanentDelete(budget)}
                              className="text-red-500 hover:text-red-600 transition-colors p-1"
                              title="Delete Permanently"
                              aria-label="Delete"
                            >
                              <FiTrash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-xs sm:text-sm text-gray-600">
                          <span className="font-semibold">Budget:</span> {formatAmount(budget.amount)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Archive;
