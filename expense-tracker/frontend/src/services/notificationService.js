import toast from 'react-hot-toast';
import { getTransactionSummary, getTransactions } from './transactionService';
import { loadBudgetsWithReset } from './budgetService';

const getNotificationStorageKey = (userEmail) => `budget_notifications_${userEmail}`;
const NOTIFICATION_SETTINGS_KEY = 'notification_settings';

const DEFAULT_SETTINGS = {
  enabled: true,
  thresholds: {
    warning: 80,
    danger: 100
  }
};

export const getNotificationSettings = () => {
  try {
    const settings = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    return settings ? JSON.parse(settings) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveNotificationSettings = (settings) => {
  localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
};

export const getStoredNotifications = (userEmail = null) => {
  try {
    if (!userEmail) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        userEmail = user.email;
      } else {
        userEmail = localStorage.getItem('userEmail');
      }
    }
    
    if (!userEmail) {
      return [];
    }
    
    const storageKey = getNotificationStorageKey(userEmail);
    const notifications = localStorage.getItem(storageKey);
    return notifications ? JSON.parse(notifications) : [];
  } catch {
    return [];
  }
};

const saveNotifications = (notifications, userEmail = null) => {
  try {
    if (!userEmail) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        userEmail = user.email;
      } else {
        userEmail = localStorage.getItem('userEmail');
      }
    }
    
    if (!userEmail) {
      console.error('Cannot save notifications: no user email found');
      return;
    }
    
    const storageKey = getNotificationStorageKey(userEmail);
    localStorage.setItem(storageKey, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications:', error);
  }
};

export const addNotification = (notification, userEmail = null) => {
  const notifications = getStoredNotifications(userEmail);
  const newNotification = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    read: false,
    ...notification
  };
  
  notifications.unshift(newNotification);
  
  if (notifications.length > 50) {
    notifications.splice(50);
  }
  
  saveNotifications(notifications, userEmail);
  return newNotification;
};

export const markNotificationAsRead = (notificationId, userEmail = null) => {
  const notifications = getStoredNotifications(userEmail);
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    saveNotifications(notifications, userEmail);
  }
};

export const markAllNotificationsAsRead = (userEmail = null) => {
  const notifications = getStoredNotifications(userEmail);
  notifications.forEach(n => n.read = true);
  saveNotifications(notifications, userEmail);
};

export const getUnreadNotificationCount = (userEmail = null) => {
  const notifications = getStoredNotifications(userEmail);
  return notifications.filter(n => !n.read).length;
};

export const clearAllNotifications = (userEmail = null) => {
  try {
    if (!userEmail) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        userEmail = user.email;
      } else {
        userEmail = localStorage.getItem('userEmail');
      }
    }
    
    if (userEmail) {
      const storageKey = getNotificationStorageKey(userEmail);
      localStorage.removeItem(storageKey);
    }
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
};

const checkCategoryBudgetAlert = (category, spent, budget, settings, isMultiBudget = false) => {
  if (!budget || budget <= 0) return null;

  const percentage = (spent / budget) * 100;
  const { warning, danger } = settings.thresholds;
  
  const budgetType = isMultiBudget ? 'shared budget' : 'budget';
  const budgetName = isMultiBudget ? `${category} (multiple categories)` : category;

  if (percentage >= danger) {
    const isExactly100 = Math.round(percentage) === 100;
    
    return {
      type: 'danger',
      category,
      spent,
      budget,
      percentage: Math.round(percentage),
      isMultiBudget,
      message: isExactly100 
        ? `🎯 You reached your ${budgetType} limit! You've spent PHP ${spent.toLocaleString()} out of PHP ${budget.toLocaleString()} (100%) for ${budgetName}.`
        : `🚨 You've exceeded your ${budgetType}! You've spent PHP ${spent.toLocaleString()} out of PHP ${budget.toLocaleString()} (${Math.round(percentage)}%) for ${budgetName}.`
    };
  } else if (percentage >= warning) {
    return {
      type: 'warning', 
      category,
      spent,
      budget,
      percentage: Math.round(percentage),
      isMultiBudget,
      message: `⚠️ ${isMultiBudget ? 'Shared Budget' : 'Budget'} Warning! You've spent PHP ${spent.toLocaleString()} out of PHP ${budget.toLocaleString()} (${Math.round(percentage)}%) for ${budgetName}. Approaching your limit!`
    };
  }

  return null;
};

const areExpenseLimitNotificationsEnabled = (userEmail) => {
  try {
    if (!userEmail) return false;
    
    const settings = localStorage.getItem(`notificationSettings_${userEmail}`);
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      return parsedSettings.expenseLimit !== false;
    }
    return true;
  } catch (error) {
    console.error('Error checking notification settings:', error);
    return true;
  }
};

const initializeNotificationSettings = (userEmail) => {
  const settingsKey = `notificationSettings_${userEmail}`;
  const existingSettings = localStorage.getItem(settingsKey);
  
  if (!existingSettings) {
    const defaultSettings = {
      emailNotifications: true,
      pushNotifications: true,
      budgetAlerts: true
    };
    localStorage.setItem(settingsKey, JSON.stringify(defaultSettings));
    console.log('✅ Initialized default notification settings for user:', userEmail);
    toast.success('📧 Email notifications enabled! You\'ll receive budget alerts via email.', {
      duration: 4000,
      icon: '📧'
    });
    return defaultSettings;
  }
  
  return JSON.parse(existingSettings);
};

const areEmailNotificationsEnabled = (userEmail) => {
  try {
    if (!userEmail) {
      return false;
    }
    const settings = initializeNotificationSettings(userEmail);
    return settings.emailNotifications === true;
  } catch (error) {
    console.error('Error checking email notification settings:', error);
    return false;
  }
};

const sendBudgetAlertEmail = async (userEmail, alertData) => {
  try {
    console.log('sendBudgetAlertEmail called with:', { userEmail, alertData });
    if (!userEmail) {
      console.error('No user email provided for authentication');
      return { success: false, error: 'User email required for authentication' };
    }
    let emailSubject = 'Budget Alert';
    const budgetType = alertData.isMultiBudget ? 'shared budget' : 'budget';
    
    if (alertData.percentage >= 100) {
      const isExactly100 = Math.round(alertData.percentage) === 100;
      emailSubject = isExactly100 
        ? `🎯 You've reached your ${alertData.category} ${budgetType} limit!`
        : `🚨 You've exceeded your ${alertData.category} ${budgetType}!`;
    } else {
      emailSubject = `⚠️ ${alertData.category} ${budgetType} warning - ${alertData.percentage}% used`;
    }

    const requestBody = {
      userEmail,
      alertData: {
        ...alertData,
        emailSubject
      }
    };
    console.log('Sending email request:', requestBody);

    const response = await fetch('http://localhost:5000/email/budget-alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': userEmail
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Email API response status:', response.status);
    const result = await response.json();
    console.log('Email API response:', result);
    return result;
  } catch (error) {
    console.error('Error sending budget alert email:', error);
    return { success: false, error: error.message };
  }
};

export const checkBudgetAlerts = async (userEmail) => {
  if (!userEmail) return [];

  try {
    const budgets = await loadBudgetsWithReset(userEmail);
    if (!budgets || budgets.length === 0) return [];
    const settings = getNotificationSettings(userEmail);
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const response = await getTransactions({
      type: 'expense',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });

    const transactions = response.transactions || [];
    const alerts = [];
    const categorySpending = {};
    const budgetSpending = {};
    
    transactions.forEach(transaction => {
      const category = transaction.category;
      categorySpending[category] = (categorySpending[category] || 0) + transaction.amount;
      if (transaction.budgetId) {
        budgetSpending[transaction.budgetId] = (budgetSpending[transaction.budgetId] || 0) + transaction.amount;
      }
    });
    const processedGroups = new Set();
    
    budgets.forEach(budget => {
      if (budget.groupId && processedGroups.has(budget.groupId)) {
        return;
      }
      
      if (budget.groupId) {
        const groupBudgets = budgets.filter(b => b.groupId === budget.groupId);
        const totalBudget = budget.totalBudget || groupBudgets.reduce((sum, b) => sum + b.amount, 0);
        
        let totalSpent = 0;
        if (budgetSpending[budget.groupId]) {
          totalSpent += budgetSpending[budget.groupId];
        }
        
        groupBudgets.forEach(b => {
          const unassignedForCategory = transactions
            .filter(t => !t.budgetId && t.category.toLowerCase() === b.category.toLowerCase())
            .reduce((sum, t) => sum + t.amount, 0);
          totalSpent += unassignedForCategory;
        });
        
        const budgetName = budget.name || 'Multiple Categories';
        console.log(`🔍 Checking multi-budget: ${budgetName}, Spent: ₱${totalSpent}, Budget: ₱${totalBudget}, Percentage: ${((totalSpent/totalBudget)*100).toFixed(1)}%`);
        
        const alert = checkCategoryBudgetAlert(budgetName, totalSpent, totalBudget, settings, true);
        if (alert) {
          console.log('✅ Alert generated:', alert);
          alerts.push(alert);
        }
        
        processedGroups.add(budget.groupId);
      } else {
        let spent = 0;
        if (budgetSpending[budget.id]) {
          spent += budgetSpending[budget.id];
        }
        const unassignedForCategory = transactions
          .filter(t => !t.budgetId && t.category.toLowerCase() === budget.category.toLowerCase())
          .reduce((sum, t) => sum + t.amount, 0);
        spent += unassignedForCategory;
        
        console.log(`🔍 Checking budget: ${budget.category}, Spent: ₱${spent}, Budget: ₱${budget.amount}, Percentage: ${((spent/budget.amount)*100).toFixed(1)}%`);
        
        const alert = checkCategoryBudgetAlert(budget.category, spent, budget.amount, settings, false);
        if (alert) {
          console.log('✅ Alert generated:', alert);
          alerts.push(alert);
        }
      }
    });

    return alerts;
  } catch (error) {
    console.error('Error checking budget alerts:', error);
    return [];
  }
};

const DISMISSED_ALERTS_KEY = 'dismissed_budget_alerts';

const getDismissedAlerts = () => {
  try {
    const dismissed = localStorage.getItem(DISMISSED_ALERTS_KEY);
    return dismissed ? JSON.parse(dismissed) : {};
  } catch {
    return {};
  }
};

const saveDismissedAlerts = (dismissed) => {
  localStorage.setItem(DISMISSED_ALERTS_KEY, JSON.stringify(dismissed));
};

const createAlertKey = (alert) => {
  const date = new Date().toISOString().split('T')[0];
  return `${alert.category}_${alert.type}_${alert.percentage}_${date}`;
};

export const dismissAlert = (category, type, percentage) => {
  const dismissedAlerts = getDismissedAlerts();
  const date = new Date().toISOString().split('T')[0];
  const alertKey = `${category}_${type}_${percentage}_${date}`;
  
  dismissedAlerts[alertKey] = {
    category,
    type,
    percentage,
    dismissedAt: new Date().toISOString(),
    date
  };
  
  saveDismissedAlerts(dismissedAlerts);
};

const cleanupDismissedAlerts = () => {
  const dismissedAlerts = getDismissedAlerts();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const cleaned = {};
  Object.entries(dismissedAlerts).forEach(([key, alert]) => {
    if (new Date(alert.date) > sevenDaysAgo) {
      cleaned[key] = alert;
    }
  });
  
  saveDismissedAlerts(cleaned);
};

let isProcessingAlerts = false;

let processedAlertsCache = new Set();

let lastCacheResetDate = new Date().toDateString();

export const clearProcessedAlertsCache = () => {
  processedAlertsCache.clear();
  console.log('🛡️ Processed alerts cache cleared');
};

export const processAndShowAlerts = async (userEmail, forceRefresh = false) => {
  console.log('🚨 processAndShowAlerts called for user:', userEmail, 'forceRefresh:', forceRefresh);
  const today = new Date().toDateString();
  if (lastCacheResetDate !== today) {
    processedAlertsCache.clear();
    lastCacheResetDate = today;
    console.log('📅 New day detected, cache reset');
  }
  if (forceRefresh) {
    processedAlertsCache.clear();
    console.log('🔄 Force refresh: cache cleared');
  }
  if (isProcessingAlerts && !forceRefresh) {
    console.log('⏳ Alert processing already in progress, skipping...');
    return;
  }
  
  isProcessingAlerts = true;
  
  try {
  
  if (forceRefresh) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const alerts = await checkBudgetAlerts(userEmail);
  console.log('🚨 Budget alerts found:', alerts);
  const existingNotifications = getStoredNotifications(userEmail);
  console.log('🚨 Existing notifications:', existingNotifications.length);
  const dismissedAlerts = getDismissedAlerts();
  const today = new Date().toDateString();
  
  cleanupDismissedAlerts();

  console.log('📊 Cache size before processing:', processedAlertsCache.size);
  
  alerts.forEach(alert => {
    const alertKey = createAlertKey(alert);
    
    if (!forceRefresh && processedAlertsCache.has(alertKey)) {
      return;
    }
    
    console.log('🚨 Processing alert:', alert.category, alert.percentage + '%');
    
    if (dismissedAlerts[alertKey] && dismissedAlerts[alertKey].date === today) {
      console.log('🚨 Alert was dismissed today, skipping');
      processedAlertsCache.add(alertKey);
      return;
    }

    const existingAlert = existingNotifications.find(n => 
      n.category === alert.category && 
      n.type === alert.type &&
      n.percentage === alert.percentage &&
      new Date(n.timestamp).toDateString() === today
    );
    
    if (existingAlert) {
      processedAlertsCache.add(alertKey);
      return;
    }

    const notification = addNotification(alert, userEmail);
    
    processedAlertsCache.add(alertKey);
      if (alert.type === 'danger') {
        toast.error(alert.message, {
          id: alertKey,
          duration: 8000,
          icon: '🚨',
          position: 'top-right',
          style: {
            border: '2px solid #ef4444',
            padding: '16px',
            color: '#dc2626',
            backgroundColor: '#fef2f2',
            fontWeight: '500',
            fontSize: '14px',
            maxWidth: '400px',
            wordWrap: 'break-word'
          }
        });
      } else if (alert.type === 'warning') {
        toast(alert.message, {
          id: alertKey,
          duration: 6000,
          icon: '⚠️',
          position: 'top-right',
          style: {
            border: '2px solid #f59e0b',
            padding: '16px',
            color: '#d97706',
            backgroundColor: '#fffbeb',
            fontWeight: '500',
            fontSize: '14px',
            maxWidth: '400px',
            wordWrap: 'break-word'
          }
        });
      }

      console.log('Checking email notifications for user:', userEmail);
      const emailEnabled = areEmailNotificationsEnabled(userEmail);
      console.log('Email notifications enabled:', emailEnabled);
      
      if (emailEnabled) {
        console.log('Sending budget alert email...', alert);
        sendBudgetAlertEmail(userEmail, alert).then(result => {
          if (result.success) {
            console.log('Budget alert email sent successfully:', result);
          } else {
            console.error('Failed to send budget alert email:', result.error);
          }
        }).catch(error => {
          console.error('Error sending budget alert email:', error);
        });
      } else {
        console.log('Email notifications are disabled for user:', userEmail);
      }
  });
  
  console.log('📊 Cache size after processing:', processedAlertsCache.size);

    isProcessingAlerts = false;
    
    return alerts;
  } catch (error) {
    console.error('Error processing alerts:', error);
    isProcessingAlerts = false;
    return [];
  }
};

export const showSuccessNotification = (message) => {
  toast.success(message, {
    duration: 3000,
    icon: '✅',
    style: {
      border: '1px solid #10b981',
      padding: '16px',
      color: '#059669',
    }
  });
};

export const showInfoNotification = (message) => {
  toast(message, {
    duration: 4000,
    icon: 'ℹ️',
    style: {
      border: '1px solid #3b82f6',
      padding: '16px',
      color: '#2563eb',
    }
  });
};

export default {
  getNotificationSettings,
  saveNotificationSettings,
  getStoredNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  clearAllNotifications,
  checkBudgetAlerts,
  processAndShowAlerts,
  showSuccessNotification,
  showInfoNotification
};
