import React, { useState } from 'react';
import BudgetCard from './BudgetCard';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import BudgetSuccessModal from './BudgetSuccessModal';
import BudgetDetailsModal from './BudgetDetailsModal';
import { deleteBudget, archiveBudgetGroup } from '../../services/budgetApiService';

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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedBudgetGroup, setSelectedBudgetGroup] = useState(null);
  const [selectedBudgetStats, setSelectedBudgetStats] = useState(null);
  const [isMultiBudget, setIsMultiBudget] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleCardClick = (budget, stats, group = null) => {
    setSelectedBudget(budget);
    setSelectedBudgetStats(stats);
    setSelectedBudgetGroup(group);
    setIsMultiBudget(!!group);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (budget, isMulti) => {
    setSelectedBudget(budget);
    setIsMultiBudget(isMulti);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedBudget) return;

    setIsDeleting(true);

    try {
      if (isMultiBudget) {
        await archiveBudgetGroup(selectedBudget.groupId);
      } else {
        const budgetId = selectedBudget._id || selectedBudget.id;
        await deleteBudget(budgetId, false);
      }

      setSuccessMessage(`Budget "${selectedBudget.name || selectedBudget.label || selectedBudget.category}" has been moved to archive.`);
      setIsDeleting(false);
      setShowDeleteModal(false);
      setShowSuccessModal(true);

      window.dispatchEvent(new Event('budgetUpdated'));
    } catch (error) {
      console.error('Error archiving budget:', error);
      alert('Failed to archive budget. Please try again.');
      setIsDeleting(false);
    }
  };

  const groupedBudgets = {};
  const singleBudgets = [];
  const labelGroups = {};

  budgets.forEach((budget) => {
    if (budget.groupId) {
      if (!groupedBudgets[budget.groupId]) {
        groupedBudgets[budget.groupId] = [];
      }
      groupedBudgets[budget.groupId].push(budget);
    } else if (budget.label && budget.label.trim() !== '') {
      
      const normalizedLabel = budget.label.trim().toLowerCase();
      if (!labelGroups[normalizedLabel]) {
        labelGroups[normalizedLabel] = [];
      }
      labelGroups[normalizedLabel].push(budget);
    } else {
      singleBudgets.push(budget);
    }
  });

  Object.entries(labelGroups).forEach(([normalizedLabel, budgetItems]) => {
    if (budgetItems.length > 1) {
      
      const virtualGroupId = `label_${normalizedLabel}`;
      groupedBudgets[virtualGroupId] = budgetItems;
    } else {
      singleBudgets.push(budgetItems[0]);
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
            const displayTitle = firstBudget.label || firstBudget.name || categoryNames;
            const showCategoryNames = firstBudget.label || firstBudget.name;

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
                categoryNames={showCategoryNames ? categoryNames : null}
                formatAmount={formatAmount}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onClick={() => handleCardClick(
                  firstBudget,
                  { totalBudget, totalSpent, totalRemaining, percentage },
                  group
                )}
              />
            );
          } else {
            const budget = item.data;
            const budgetId = budget.id;
            const spent = calculateBudgetSpent(budgetId, budget.category, false);
            const remaining = Math.max(0, budget.amount - spent);
            const percentage = Math.min((spent / budget.amount) * 100, 100);
            const status = getBudgetStatus(spent, budget.amount);
            const displayTitle = budget.label || budget.name || budget.category;

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
                categoryNames={budget.label ? budget.category : null}
                formatAmount={formatAmount}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onClick={() => handleCardClick(
                  budget,
                  { totalBudget: budget.amount, totalSpent: spent, totalRemaining: remaining, percentage }
                )}
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

      <BudgetDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        budget={selectedBudget}
        formatAmount={formatAmount}
        totalSpent={selectedBudgetStats?.totalSpent || 0}
        totalBudget={selectedBudgetStats?.totalBudget || 0}
        percentage={selectedBudgetStats?.percentage || 0}
        isMultiBudget={isMultiBudget}
        budgetGroup={selectedBudgetGroup}
      />
    </div>
  );
};

export default BudgetOverview;
