import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionBudgetCard from './TransactionBudgetCard';
import QuickExpenseModal from './QuickExpenseModal';
import { loadBudgetsWithReset } from '../../services/budgetApiService';
import { getAccounts } from '../../services/accountApiService';
import { getTransactions } from '../../services/transactionService';
import { useCurrency } from '../../contexts/CurrencyContext';
import { processAndShowAlerts } from '../../services/notificationService';
import { FaWallet, FaMobileAlt, FaPiggyBank, FaCreditCard, FaMoneyBill, FaUniversity, FaPaypal } from 'react-icons/fa';
import { SiGooglepay } from 'react-icons/si';
import { MdAccountBalance, MdSavings, MdTrendingUp } from 'react-icons/md';
import { BiCoin, BiMoney } from 'react-icons/bi';
import { BsCurrencyExchange, BsCurrencyDollar } from 'react-icons/bs';
import { FiCreditCard, FiDollarSign } from 'react-icons/fi';

const BudgetCardsSection = ({ refreshTrigger, onExpenseAdded, transactionType = 'expense' }) => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingModalData, setPendingModalData] = useState(null);

  React.useEffect(() => {
    if (pendingModalData) {
      setSelectedBudget(pendingModalData.budget);
      setSelectedCategories(pendingModalData.categories);
      setShowModal(true);
      setPendingModalData(null);
    }
  }, [pendingModalData]);
  const { formatAmount } = useCurrency();

  const getIconComponent = (iconName) => {
    const iconMap = {
      'FaWallet': FaWallet,
      'FaPiggyBank': FaPiggyBank,
      'FaMobileAlt': FaMobileAlt,
      'FaMoneyBill': FaMoneyBill,
      'BiMoney': BiMoney,
      'MdTrendingUp': MdTrendingUp,
      'FaCreditCard': FaCreditCard,
      'MdAccountBalance': MdAccountBalance,
      'MdSavings': MdSavings,
      'FaPaypal': FaPaypal,
      'SiGooglepay': SiGooglepay,
      'BsCurrencyDollar': BsCurrencyDollar,
      'FaUniversity': FaUniversity,
      'BsCurrencyExchange': BsCurrencyExchange,
      'BiCoin': BiCoin
    };

    return iconMap[iconName] || FaWallet;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserEmail(user.email || '');
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      if (transactionType === 'income') {
        loadAccounts();
      } else {
        loadBudgets();
        fetchTransactions();
      }
    }
  }, [userEmail, refreshTrigger, transactionType]);

  useEffect(() => {
    const handleTransactionAdded = async () => {
      if (userEmail) {
        
        loadBudgets();
        await fetchTransactions();
      }
    };

    const handleBudgetChange = () => {
      if (userEmail) {
        
        loadBudgets();
      }
    };

    window.addEventListener('transactionAdded', handleTransactionAdded);
    window.addEventListener('budgetCreated', handleBudgetChange);
    window.addEventListener('budgetUpdated', handleBudgetChange);

    return () => {
      window.removeEventListener('transactionAdded', handleTransactionAdded);
      window.removeEventListener('budgetCreated', handleBudgetChange);
      window.removeEventListener('budgetUpdated', handleBudgetChange);
    };
  }, [userEmail]);

  useEffect(() => {
    if (budgets.length > 0 && transactions.length > 0 && userEmail) {
      
      processAndShowAlerts(userEmail);
    }
  }, [transactions, budgets, userEmail]);

  const loadBudgets = async () => {
    if (!userEmail) return;

    try {
      const budgetsWithReset = await loadBudgetsWithReset(userEmail);
      
      const formattedBudgets = budgetsWithReset.map(b => ({
        ...b,
        id: b._id || b.id
      }));

      console.log('🔵 BUDGETS LOADED:', formattedBudgets.map(b => ({
        id: b.id,
        _id: b._id,
        category: b.category,
        amount: b.amount
      })));

      setBudgets(formattedBudgets);
    } catch (error) {
      console.error('Error loading budgets:', error);
    }
  };

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const result = await getAccounts();
      console.log('💰 Accounts response:', result);

      let accountsList = [];
      if (result.success && result.accounts) {
        accountsList = result.accounts;
      } else if (Array.isArray(result)) {
        accountsList = result;
      }

      const enabledAccounts = accountsList.filter(acc => acc.enabled);
      console.log('💰 Enabled accounts loaded:', enabledAccounts.length);
      setAccounts(enabledAccounts);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const transactionsRes = await getTransactions({
        type: 'expense',
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString()
      });

      if (transactionsRes.success) {
        console.log('🟢 TRANSACTIONS FETCHED:', transactionsRes.transactions.length, 'transactions');
        console.log('🟢 ALL TRANSACTIONS:', transactionsRes.transactions.map(t => ({
          category: t.category,
          amount: t.amount,
          budgetId: t.budgetId,
          date: t.date
        })));
        setTransactions(transactionsRes.transactions);
        
        if (userEmail) {
          processAndShowAlerts(userEmail);
        }
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateBudgetSpent = (budgetId, category) => {
    
    console.log(`💵 Calculating spent for budget: ${budgetId} (${category})`);

    const budget = budgets.find(b =>
      b.id === budgetId ||
      b._id === budgetId ||
      String(b.id) === String(budgetId) ||
      String(b._id) === String(budgetId)
    );

    if (!budget) {
      console.log(`❌ Budget not found`);
      return 0;
    }

    const categoryTransactions = transactions.filter(t =>
      t.category?.toLowerCase() === category?.toLowerCase()
    );

    console.log(`📊 Found ${categoryTransactions.length} ${category} transactions`);

    const matchingTransactions = categoryTransactions.filter(t => {
      if (!t.budgetId) return false; 

      const tBudgetId = String(t.budgetId);
      const bId = String(budget.id || budget._id);

      const matches = tBudgetId === bId;

      if (matches) {
        console.log(`  ✅ MATCH: ₱${t.amount} (budgetId: ${t.budgetId})`);
      }

      return matches;
    });

    const total = matchingTransactions.reduce((sum, t) => sum + t.amount, 0);

    console.log(`💰 TOTAL SPENT: ₱${total} from ${matchingTransactions.length} transactions\n`);

    return total;
  };

  const getBudgetStatus = (percentage) => {
    if (percentage >= 100) return { label: 'Over Budget', color: 'bg-red-100 text-red-600' };
    if (percentage >= 80) return { label: 'Warning', color: 'bg-orange-100 text-orange-600' };
    if (percentage >= 50) return { label: 'On Track', color: 'bg-green-100 text-green-600' };
    return { label: 'On Track', color: 'bg-green-100 text-green-600' };
  };

  const handleCardClick = (budget, isMultiBudget, categories, budgetGroup = null) => {
    setSelectedBudget(budget);
    setSelectedCategories(categories);
    
    if (budgetGroup) {
      setSelectedBudget({ ...budget, budgetGroup });
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedBudget(null);
    setSelectedCategories([]);
  };

  const handleExpenseAdded = async () => {
    console.log('🔴 handleExpenseAdded called - REFRESHING DATA');
    
    await loadBudgets();
    await fetchTransactions();

    setLoading(true);
    setTimeout(() => setLoading(false), 100);

    if (onExpenseAdded) {
      onExpenseAdded();
    }

    if (userEmail) {
      await processAndShowAlerts(userEmail, true);
      window.dispatchEvent(new Event('notificationsUpdated'));
    }
    console.log('🔴 Refresh complete');
  };

  const getDisplayTitle = (budget, isMultiBudget) => {
    if (isMultiBudget) {
      return budget.label || budget.name;
    }
    return budget.label || budget.name || budget.category;
  };

  const getCategoryNames = (budgetGroup) => {
    if (!budgetGroup || !Array.isArray(budgetGroup)) return [];
    return budgetGroup.map(b => b.category);
  };

  const groupedBudgets = {};
  const singleBudgets = [];
  const labelGroups = {};

  budgets.forEach(budget => {
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

  const renderContent = () => {
    if (transactionType === 'income') {
      if (loading) {
        return (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        );
      }

      if (accounts.length === 0) {
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCreditCard className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">No Accounts Found</h3>
            <p className="text-gray-500 text-sm">Add an account to track income</p>
          </div>
        );
      }

      return (
        <div className="space-y-3">
          {accounts.map(account => (
            <div
              key={account._id || account.id}
              data-account-card="true"
              onClick={() => {
                console.log('Account card clicked:', account.name);
                setPendingModalData({
                  budget: { ...account, isAccount: true },
                  categories: ['Income']
                });
                console.log('Pending modal data set');
              }}
              className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: account.color || '#34A853' }}
                >
                  {(() => {
                    const IconComponent = getIconComponent(account.icon);
                    return <IconComponent className="text-white text-2xl" />;
                  })()}
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 capitalize">{account.name}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (budgets.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiDollarSign className="text-gray-400 text-2xl" />
          </div>
          <h3 className="text-gray-900 font-medium mb-1">No Budgets Found</h3>
          <p className="text-gray-500 text-sm">Create a budget to start tracking expenses</p>
        </div>
      );
    }

    return (
      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
        
        {singleBudgets.map(budget => {
          const spent = calculateBudgetSpent(budget.id, budget.category);
          const remaining = budget.amount - spent;
          const percentage = (spent / budget.amount) * 100;
          const status = getBudgetStatus(percentage);

          return (
            <TransactionBudgetCard
              key={`${budget.id}-${transactions.length}-${spent}`}
              budget={budget}
              isMultiBudget={false}
              totalBudget={budget.amount}
              totalSpent={spent}
              totalRemaining={remaining}
              percentage={percentage}
              status={status}
              displayTitle={getDisplayTitle(budget, false)}
              categoryNames={budget.label ? budget.category : null}
              formatAmount={formatAmount}
              onClick={() => handleCardClick(budget, false, [budget.category], null)}
            />
          );
        })}

        {Object.entries(groupedBudgets).map(([groupId, budgetGroup]) => {
          const totalBudget = budgetGroup.reduce((sum, b) => sum + b.amount, 0);
          const totalSpent = budgetGroup.reduce((sum, b) =>
            sum + calculateBudgetSpent(b.id, b.category), 0
          );
          const totalRemaining = totalBudget - totalSpent;
          const percentage = (totalSpent / totalBudget) * 100;
          const status = getBudgetStatus(percentage);
          const displayTitle = getDisplayTitle(budgetGroup[0], true);
          const categoryNamesArray = getCategoryNames(budgetGroup);
          const categoryNames = categoryNamesArray.join(', ');
          const showCategoryNames = budgetGroup[0].label || budgetGroup[0].name;

          return (
            <TransactionBudgetCard
              key={groupId}
              budget={budgetGroup[0]}
              isMultiBudget={true}
              totalBudget={totalBudget}
              totalSpent={totalSpent}
              totalRemaining={totalRemaining}
              percentage={percentage}
              status={status}
              displayTitle={displayTitle}
              categoryNames={showCategoryNames ? categoryNames : null}
              formatAmount={formatAmount}
              onClick={() => handleCardClick(budgetGroup[0], true, categoryNamesArray, budgetGroup)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {renderContent()}

      <QuickExpenseModal
        isOpen={showModal}
        onClose={handleModalClose}
        budget={selectedBudget}
        isMultiBudget={!!selectedBudget?.groupId}
        categories={selectedCategories}
        formatAmount={formatAmount}
        onExpenseAdded={handleExpenseAdded}
        transactions={transactions}
        transactionType={transactionType}
      />
    </div>
  );
};

export default BudgetCardsSection;
