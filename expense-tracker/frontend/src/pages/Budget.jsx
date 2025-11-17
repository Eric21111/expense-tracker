import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiInfo, FiArchive } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../contexts/SidebarContext';
import { useCurrency } from '../contexts/CurrencyContext';
import aiIcon from '../assets/budget/ai.svg';
import alertIcon from '../assets/budget/alert.svg';
import coinsIcon from '../assets/budget/coins.svg';
import moneyIcon from '../assets/budget/money.svg';
import progressIcon from '../assets/budget/progress.svg';
import shoppingIcon from '../assets/budget/pig.svg';
import Sidebar from '../components/shared/Sidebar';
import Header2 from '../components/shared/Header2';
import BudgetModal from '../components/budget/BudgetModal';
import BudgetResetNotification from '../components/budget/BudgetResetNotification';
import BudgetStatCards from '../components/budget/BudgetStatCards';
import BudgetAiInsights from '../components/budget/BudgetAiInsights';
import BudgetOverview from '../components/budget/BudgetOverview';
import { getTransactions, getTransactionSummary } from '../services/transactionService';
import { 
  loadBudgetsWithReset, 
  saveBudgetsWithTracking, 
  getResetNotification, 
  clearResetNotification, 
  getCurrentMonthDisplay 
} from '../services/budgetService';
import { getAIInsights } from '../services/aiInsightsService';
import { initializeBudgetReminders, stopBudgetReminders } from '../services/budgetReminderService';
import { getUserData, setUserData, DATA_TYPES } from '../services/dataIsolationService';
import { checkBudgetCompletions } from '../services/badgeService';
import BillsIcon from '../assets/categories/bills.svg';
import TransportationCategoryIcon from '../assets/categories/transportation.svg';
import ShoppingCategoryIcon from '../assets/categories/shopping.svg';

const Budget = () => {
  const { isExpanded } = useSidebar();
  const { formatAmount, getCurrencySymbol, getCurrencyCode } = useCurrency();
  const navigate = useNavigate();
  const [username, setUsername] = useState('User');
  const [userEmail, setUserEmail] = useState('');
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalExpense: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [resetNotification, setResetNotification] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [totalAccountBalance, setTotalAccountBalance] = useState(0);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    dueDate: '',
    description: '',
    icon: 'shoppingIcon',
    gradient: 'from-pink-500 to-pink-600',
    budgetType: 'multi'
  });

  const categoryConfig = {
    "Food": { 
      icon: ShoppingCategoryIcon, 
      gradient: "from-orange-400 to-orange-600",
      color: "#FB923C" 
    },
    "Transportation": { 
      icon: TransportationCategoryIcon, 
      gradient: "from-blue-400 to-blue-600",
      color: "#60A5FA" 
    },
    "Bills": { 
      icon: BillsIcon, 
      gradient: "from-purple-400 to-purple-600",
      color: "#A78BFA" 
    },
    "Entertainment": { 
      icon: ShoppingCategoryIcon, 
      gradient: "from-yellow-400 to-amber-500",
      color: "#FACC15" 
    },
    "Shopping": { 
      icon: ShoppingCategoryIcon, 
      gradient: "from-pink-500 to-pink-600",
      color: "#EC4899" 
    },
    "Grocery": { 
      icon: ShoppingCategoryIcon, 
      gradient: "from-green-500 to-green-600",
      color: "#10B981" 
    },
    "Others": { 
      icon: ShoppingCategoryIcon, 
      gradient: "from-green-400 to-green-500",
      color: "#34D399" 
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUsername(user.name || user.displayName || 'User');
        setUserEmail(user.email || ''); 
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      loadBudgets();
      fetchTransactions();
      loadAccounts();
      
      initializeBudgetReminders(userEmail);
    }
    
    return () => {
      stopBudgetReminders();
    };
  }, [userEmail]);

  
  useEffect(() => {
    if (userEmail && transactions.length >= 0 && !loading) {
      loadAccounts();
    }
  }, [transactions.length]);

  useEffect(() => {
    const fetchAIInsights = async () => {
      if (!userEmail || budgets.length === 0) {
        setAiInsights([{
          type: 'info',
          title: 'Get Started',
          message: 'Create your first budget to receive personalized AI insights about your spending patterns.'
        }]);
        return;
      }

      setAiInsightsLoading(true);
      try {
        const currency = getCurrencyCode();
        const result = await getAIInsights(budgets, currency);
        
        if (result && (result.success || result.insights)) {
          const formattedInsights = [];
          
          let parsedInsights = [];
          
          if (Array.isArray(result.insights)) {
            parsedInsights = result.insights;
          } else if (typeof result.insights === 'string') {
            try {
              const parsed = JSON.parse(result.insights);
              if (Array.isArray(parsed)) {
                parsedInsights = parsed;
              } else if (typeof parsed === 'object' && parsed !== null) {
                parsedInsights = [parsed];
              } else {
                parsedInsights = null;
              }
            } catch (e) {
              parsedInsights = null;
            }
          } else if (result.insights && typeof result.insights === 'object') {
            parsedInsights = [result.insights];
          }
          
          if (parsedInsights && Array.isArray(parsedInsights) && parsedInsights.length > 0) {
            parsedInsights.forEach((insight, index) => {
              if (formattedInsights.length < 3 && insight && typeof insight === 'object') {
                if (insight.type && insight.title && insight.message) {
                  formattedInsights.push({
                    type: insight.type,
                    title: insight.title,
                    message: insight.message
                  });
                } else if (insight.message || insight.text) {
                  const message = insight.message || insight.text || '';
                  const lowerMessage = message.toLowerCase();
                  
                  let type = 'info';
                  let title = 'AI Recommendation';
                  
                  if (lowerMessage.includes('exceed') || lowerMessage.includes('over')) {
                    type = 'danger';
                    title = 'Budget Alert';
                  } else if (lowerMessage.includes('warning') || lowerMessage.includes('approach')) {
                    type = 'warning';
                    title = 'Spending Warning';
                  } else if (lowerMessage.includes('good') || lowerMessage.includes('great')) {
                    type = 'success';
                    title = 'Great Progress';
                  }
                  
                  formattedInsights.push({ type, title, message });
                }
              }
            });
          } else {
            let insightText = '';
            if (typeof result.insights === 'string') {
              insightText = result.insights;
            } else if (typeof result === 'string') {
              insightText = result;
            }
            
            if (typeof insightText === 'string' && insightText.trim()) {
              const sentences = insightText.split(/[.!?]+/).filter(s => s.trim());
              
              sentences.forEach((sentence, index) => {
                if (sentence.trim() && formattedInsights.length < 3) {
                  const lowerSentence = sentence.toLowerCase();
                  
                  let type = 'info';
                  let title = 'AI Recommendation';
                  
                  if (lowerSentence.includes('exceed') || lowerSentence.includes('over')) {
                    type = 'danger';
                    title = 'Budget Alert';
                  } else if (lowerSentence.includes('warning') || lowerSentence.includes('approach')) {
                    type = 'warning';
                    title = 'Spending Warning';
                  } else if (lowerSentence.includes('good') || lowerSentence.includes('great')) {
                    type = 'success';
                    title = 'Great Progress';
                  } else if (lowerSentence.includes('save')) {
                    type = 'info';
                    title = 'Savings Tip';
                  } else if (lowerSentence.includes('consider') || lowerSentence.includes('recommend')) {
                    type = 'info';
                    title = 'Recommendation';
                  }
                  
                  formattedInsights.push({
                    type,
                    title,
                    message: sentence.trim()
                  });
                }
              });
            }
          }
          
          if (formattedInsights.length === 0) {
            formattedInsights.push({
              type: 'info',
              title: 'AI Analysis',
              message: typeof insightText === 'string' ? insightText : 'Keep tracking your expenses to get better insights.'
            });
          }
          
          setAiInsights(formattedInsights);
        } else {
          setAiInsights(generateBasicInsights());
        }
      } catch (error) {
        console.error('Error fetching AI insights:', error);
        setAiInsights(generateBasicInsights());
      } finally {
        setAiInsightsLoading(false);
      }
    };

    fetchAIInsights();
  }, [budgets, transactions, userEmail]);

  const loadBudgets = () => {
    if (!userEmail) return;
    
    const budgetsWithReset = loadBudgetsWithReset(userEmail);
    setBudgets(budgetsWithReset);
    
    checkBudgetCompletions(userEmail);
    
    const notification = getResetNotification(userEmail);
    if (notification) {
      setResetNotification(notification);
    }
  };
  const loadAccounts = () => {
    if (!userEmail) return;
    
    try {
      const parsedAccounts = getUserData(DATA_TYPES.ACCOUNTS, userEmail);
      if (parsedAccounts && Array.isArray(parsedAccounts)) {
        setAccounts(parsedAccounts);
        const total = parsedAccounts.reduce((sum, account) => sum + (account.balance || 0), 0);
        setTotalAccountBalance(total);
      } else {
        setAccounts([]);
        setTotalAccountBalance(0);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
      setAccounts([]);
      setTotalAccountBalance(0);
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

  const calculateBudgetSpent = (budgetId, category, isMultiBudget = false, groupId = null) => {
    let budget = null;
    if (isMultiBudget && groupId) {
      budget = budgets.find(b => b.groupId === groupId && b.category === category);
    } else {
      budget = budgets.find(b => b.id === budgetId || b.id === parseInt(budgetId));
    }
    const expenseResetDate = budget?.lastExpenseReset ? new Date(budget.lastExpenseReset) : null;
    let relevantTransactions = transactions;
    if (expenseResetDate) {
      relevantTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date || t.createdAt);
        return transactionDate >= expenseResetDate;
      });
    }
    if (isMultiBudget && groupId) {
      const groupSpecificExpenses = relevantTransactions.filter(t => 
        t.budgetId && t.budgetId === groupId && t.category.toLowerCase() === category?.toLowerCase()
      );
      const unassignedExpenses = relevantTransactions.filter(t => 
        !t.budgetId && t.category.toLowerCase() === category?.toLowerCase()
      );
      return groupSpecificExpenses.reduce((sum, t) => sum + t.amount, 0) +
             unassignedExpenses.reduce((sum, t) => sum + t.amount, 0);
    }
    const budgetSpecificExpenses = relevantTransactions.filter(t => 
      t.budgetId && (t.budgetId === budgetId?.toString() || t.budgetId === budgetId)
    );
    const unassignedExpenses = relevantTransactions.filter(t => 
      !t.budgetId && t.category.toLowerCase() === category?.toLowerCase()
    );
    return budgetSpecificExpenses.reduce((sum, t) => sum + t.amount, 0) +
           unassignedExpenses.reduce((sum, t) => sum + t.amount, 0);
  };

  const saveBudgets = (newBudgets) => {
    if (!userEmail) return;
    const success = setUserData(DATA_TYPES.BUDGETS, newBudgets, userEmail);
    if (success) {
      setBudgets(newBudgets);
      loadAccounts();
      const eventType = newBudgets.length > budgets.length ? 'budgetCreated' : 'budgetUpdated';
      window.dispatchEvent(new Event(eventType));
    } else {
      console.error('Failed to save budgets - unauthorized access');
    }
  };

  const handleDismissNotification = () => {
    clearResetNotification(userEmail);
    setResetNotification(null);
  };

  const handleSubmit = (e, updatedFormData = null) => {
    e.preventDefault();
    if (Array.isArray(updatedFormData)) {
      const timestamp = Date.now();
      const groupId = `multi-${timestamp}`;
      const newBudgets = updatedFormData.map((item, index) => {
        const config = categoryConfig[item.category] || categoryConfig["Others"];
        return {
          ...item,
          id: timestamp + index,
          groupId: groupId,
          budgetType: 'Multi',
          amount: parseFloat(item.amount),
          totalBudget: item.totalBudget, 
          categoryCount: item.categoryCount, 
          dueDate: item.dueDate || null, 
          createdAt: new Date().toISOString(),
          icon: item.icon || config.icon,
          iconColor: item.iconColor || config.color || '#34A853',
          gradient: config.gradient
        };
      });
      saveBudgets([...budgets, ...newBudgets]);
    } else if (editingBudget) {
      const dataToUse = updatedFormData || formData;
      const config = categoryConfig[dataToUse.category] || categoryConfig["Others"];
      const updatedBudgets = budgets.map((budget) =>
        budget.id === editingBudget.id
          ? { 
              ...dataToUse, 
              id: editingBudget.id, 
              amount: parseFloat(dataToUse.amount),
              dueDate: dataToUse.dueDate || null, 
              icon: config.icon,
              iconColor: config.color || '#34A853',
              gradient: config.gradient
            }
          : budget
      );
      saveBudgets(updatedBudgets);
    } else {
      const dataToUse = updatedFormData || formData;
      const config = categoryConfig[dataToUse.category] || categoryConfig["Others"];
      const newBudget = {
        ...dataToUse,
        id: Date.now(),
        amount: parseFloat(dataToUse.amount),
        dueDate: dataToUse.dueDate || null, 
        createdAt: new Date().toISOString(),
        icon: config.icon,
        iconColor: config.color || '#34A853',
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
      description: budget.description || '',
      dueDate: budget.dueDate || '',
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
      gradient: 'from-pink-500 to-pink-600'
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

  const totalBudgeted = (() => {
    const grouped = {};
    let singleTotal = 0;
    budgets.forEach(b => {
      if (b.groupId && !grouped[b.groupId]) {
        grouped[b.groupId] = b.totalBudget || budgets
          .filter(gb => gb.groupId === b.groupId)
          .reduce((sum, gb) => sum + gb.amount, 0);
      } else if (!b.groupId) {
        singleTotal += b.amount;
      }
    });
    return Object.values(grouped).reduce((sum, val) => sum + val, singleTotal);
  })();
  const totalRemaining = Math.max(0, totalBudgeted - summary.totalExpense);

  const generateBasicInsights = () => {
    const insights = [];
    const processedGroups = new Set();
    budgets.forEach(budget => {
      if (budget.groupId && processedGroups.has(budget.groupId)) {
        return;
      }
      const budgetId = budget.id || budget.groupId;
      const isMultiBudget = !!budget.groupId;
      let spent, budgetAmount, budgetName;
      if (isMultiBudget) {
        const groupBudgets = budgets.filter(b => b.groupId === budget.groupId);
        spent = groupBudgets.reduce((sum, b) => {
          return sum + calculateBudgetSpent(b.id || b.groupId, b.category, true, b.groupId);
        }, 0);
        budgetAmount = budget.totalBudget || groupBudgets.reduce((sum, b) => sum + b.amount, 0);
        budgetName = budget.name || 'Multiple Categories';
        processedGroups.add(budget.groupId);
      } else {
        spent = calculateBudgetSpent(budgetId, budget.category, false);
        budgetAmount = budget.amount;
        budgetName = budget.name || budget.category;
      }
      const percentage = (spent / budgetAmount) * 100;
      if (percentage >= 80 && percentage < 100) {
        insights.push({
          type: 'warning',
          title: 'Budget Alert',
          message: `You're about to exceed your ${budgetName} budget. ${formatAmount(budgetAmount - spent)} remaining.`
        });
      } else if (percentage >= 100) {
        insights.push({
          type: 'danger',
          title: 'Over Budget!',
          message: `You've exceeded your ${budgetName} budget by ${formatAmount(spent - budgetAmount)}.`
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

  return (
    <div className="flex min-h-screen bg-[#F5F5F5] font-poppins">
      <Sidebar />
      <main
        className={`flex-1 bg-gray-50 transition-all duration-300 ease-in-out ml-0 lg:ml-20 ${
          isExpanded ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <Header2 username={username} title="Budget" />
        <div className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-4 sm:py-6 mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Budget Management</h1>
            </div>
            <button
              onClick={() => navigate('/archive')}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
            >
              <FiArchive size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">View Archive</span>
              <span className="sm:hidden">Archive</span>
            </button>
          </div>
          <BudgetResetNotification 
            resetNotification={resetNotification}
            onDismiss={handleDismissNotification}
            getCurrentMonthDisplay={getCurrentMonthDisplay}
          />
          <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 lg:gap-8">
            <div className="w-full xl:w-[58%]">
              <div className="mb-4 sm:mb-6">
                <BudgetStatCards 
                  loading={loading}
                  totalBudgeted={totalBudgeted}
                  totalExpense={summary.totalExpense}
                  totalRemaining={totalAccountBalance}
                  formatAmount={formatAmount}
                  shoppingIcon={shoppingIcon}
                  moneyIcon={moneyIcon}
                  coinsIcon={coinsIcon}
                />
              </div>
              <BudgetOverview 
                budgets={budgets}
                formatAmount={formatAmount}
                calculateBudgetSpent={calculateBudgetSpent}
                getBudgetStatus={getBudgetStatus}
                handleEdit={handleEdit}
                saveBudgets={saveBudgets}
              />
            </div>
            <div className="w-full xl:w-[42%] xl:sticky xl:top-4 xl:self-start">
              <BudgetAiInsights 
                aiInsights={aiInsights}
                aiInsightsLoading={aiInsightsLoading}
                aiIcon={aiIcon}
                alertIcon={alertIcon}
                progressIcon={progressIcon}
                coinsIcon={coinsIcon}
              />
            </div>
          </div>
        </div>
      </main>

      <button
        onClick={openModal}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-[#4CAF50] text-white rounded-full shadow-lg hover:bg-[#45a049] transition-all hover:scale-105 flex items-center justify-center z-40"
        aria-label="Add Budget"
      >
        <FiPlus className="text-xl sm:text-2xl" />
      </button>
      {showModal && (
        <BudgetModal
          onClose={closeModal}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          editingBudget={editingBudget}
        />
      )}
    </div>
  );
};


export default Budget;