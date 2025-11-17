import React, { useState } from 'react';
import BudgetCard from './BudgetCard';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import BudgetSuccessModal from './BudgetSuccessModal';
import { getUserData, setUserData, DATA_TYPES } from '../../services/dataIsolationService';

const BudgetOverview = ({ 
  budgets,
  formatAmount,
  calculateBudgetSpent,
  getBudgetStatus,
  handleEdit,
  saveBudgets
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isMultiBudget, setIsMultiBudget] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleDeleteClick = (budget, isMulti) => {
    setSelectedBudget(budget);
    setIsMultiBudget(isMulti);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedBudget) return;
    
    setIsDeleting(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const storedUser = localStorage.getItem('user');
    let userEmail = '';
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        userEmail = user.email || '';
      } catch (e) {}
    }
    
    let archivedBudgets = getUserData(DATA_TYPES.ARCHIVED_BUDGETS, userEmail) || [];
    
    const archivedBudget = { ...selectedBudget, archivedAt: new Date().toISOString() };
    
    if (isMultiBudget) {
      const budgetsToArchive = budgets.filter(b => b.groupId === selectedBudget.groupId);
      budgetsToArchive.forEach(b => {
        archivedBudgets.push({ ...b, archivedAt: new Date().toISOString() });
      });
      const remainingBudgets = budgets.filter(b => b.groupId !== selectedBudget.groupId);
      saveBudgets(remainingBudgets);
    } else {
      archivedBudgets.push(archivedBudget);
      const remainingBudgets = budgets.filter(b => b.id !== selectedBudget.id);
      saveBudgets(remainingBudgets);
    }
    
    setUserData(DATA_TYPES.ARCHIVED_BUDGETS, archivedBudgets, userEmail);
    
    setSuccessMessage(`Budget "${selectedBudget.name || selectedBudget.category}" has been moved to archive.`);
    setIsDeleting(false);
    setShowDeleteModal(false);
    setShowSuccessModal(true);
  };

  const groupedBudgets = {};
  const singleBudgets = [];
  
  budgets.forEach((budget) => {
    if (budget.groupId) {
      if (!groupedBudgets[budget.groupId]) {
        groupedBudgets[budget.groupId] = [];
      }
      groupedBudgets[budget.groupId].push(budget);
    } else {
      singleBudgets.push(budget);
    }
  });

  const multiBudgetGroups = Object.values(groupedBudgets)
    .sort((a, b) => {
      const dateA = new Date(a[0].createdAt || a[0].id);
      const dateB = new Date(b[0].createdAt || b[0].id);
      return dateB - dateA;
    });
  
  singleBudgets.sort((a, b) => {
    const dateA = new Date(a.createdAt || a.id);
    const dateB = new Date(b.createdAt || b.id);
    return dateB - dateA;
  });
  
  const allBudgets = [];
  
  multiBudgetGroups.forEach(group => {
    const firstBudget = group[0];
    allBudgets.push({
      id: firstBudget.groupId,
      createdAt: firstBudget.createdAt || firstBudget.id,
      type: 'multi',
      data: group
    });
  });
  
  singleBudgets.forEach(budget => {
    allBudgets.push({
      id: budget.id,
      createdAt: budget.createdAt || budget.id,
      type: 'single',
      data: budget
    });
  });
  
  allBudgets.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA;
  });

  if (budgets.length === 0) {
    return (
      <div className="w-full">
        <div className="mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Budget Overview
          </h2>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 lg:p-12 text-center">
          <p className="text-gray-500 text-base sm:text-lg mb-3 sm:mb-4">No budgets created yet</p>
          <p className="text-sm sm:text-base text-gray-400">Start by creating your first budget to track your spending</p>
          <p className="text-sm sm:text-base text-gray-400 mt-2 sm:mt-4">Click the + button below to add a budget</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          Budget Overview
        </h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {allBudgets.map((item) => {
          if (item.type === 'multi') {
            const group = item.data;
            const totalBudget = group[0].totalBudget || group.reduce((sum, b) => sum + b.amount, 0);
            const totalSpent = group.reduce((sum, b) => {
              const budgetId = b.id || b.groupId;
              return sum + calculateBudgetSpent(budgetId, b.category, true, b.groupId);
            }, 0);
            const totalRemaining = Math.max(0, totalBudget - totalSpent);
            const percentage = Math.min((totalSpent / totalBudget) * 100, 100);
            const status = getBudgetStatus(totalSpent, totalBudget);
            const firstBudget = group[0];

            const categoryNames = group.map(b => b.category).join(', ');
            const displayTitle = firstBudget.name || categoryNames;
            
            return (
              <BudgetCard
                key={firstBudget.groupId}
                budget={firstBudget}
                isMultiBudget={true}
                totalBudget={totalBudget}
                totalSpent={totalSpent}
                totalRemaining={totalRemaining}
                percentage={percentage}
                status={status}
                displayTitle={displayTitle}
                categoryNames={categoryNames}
                formatAmount={formatAmount}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            );
          } else {
            const budget = item.data;
            const budgetId = budget.id;
            const spent = calculateBudgetSpent(budgetId, budget.category, false);
            const remaining = Math.max(0, budget.amount - spent);
            const percentage = Math.min((spent / budget.amount) * 100, 100);
            const status = getBudgetStatus(spent, budget.amount);
            const displayTitle = budget.name || budget.category;
            
            return (
              <BudgetCard
                key={budget.id}
                budget={budget}
                isMultiBudget={false}
                totalBudget={budget.amount}
                totalSpent={spent}
                totalRemaining={remaining}
                percentage={percentage}
                status={status}
                displayTitle={displayTitle}
                categoryNames={null}
                formatAmount={formatAmount}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            );
          }
        })}
      </div>
      
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setIsDeleting(false);
        }}
        onConfirm={handleDelete}
        budget={selectedBudget}
        isLoading={isDeleting}
      />
      
      <BudgetSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  );
};

export default BudgetOverview;
