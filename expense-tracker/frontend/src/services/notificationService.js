import toast from 'react-hot-toast';
import { getTransactionSummary, getTransactions } from './transactionService';
import { loadBudgetsWithReset } from './budgetApiService';

const API_BASE_URL = "http:
const NOTIFICATION_SETTINGS_KEY = 'notification_settings';

const DEFAULT_SETTINGS = {
    enabled: true,
    thresholds: {
        warning: 80,
        danger: 100
    }
};

const getHeaders = () => {
    try {
        const storedUser = localStorage.getItem("user");
        let userEmail = '';

        if (storedUser) {
            const user = JSON.parse(storedUser);
            userEmail = user.email;
        }

        return {
            "Content-Type": "application/json",
            "x-user-email": userEmail || ""
        };
    } catch (error) {
        console.error('Error getting headers:', error);
        return {
            "Content-Type": "application/json"
        };
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

export const getStoredNotifications = async (userEmail = null) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notifications`, {
            method: "GET",
            headers: getHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch notifications");
        }

        return data.notifications || [];
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};

export const addNotification = async (notification, userEmail = null) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notifications`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(notification)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to create notification");
        }

        return data.notification;
    } catch (error) {
        console.error('Error adding notification:', error);
        return null;
    }
};

export const markNotificationAsRead = async (notificationId, userEmail = null) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
            method: "PUT",
            headers: getHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to mark notification as read");
        }

        return data.notification;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return null;
    }
};

export const markAllNotificationsAsRead = async (userEmail = null) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
            method: "PUT",
            headers: getHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to mark all as read");
        }

        return data;
    } catch (error) {
        console.error('Error marking all as read:', error);
        return null;
    }
};

export const getUnreadNotificationCount = async (userEmail = null) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
            method: "GET",
            headers: getHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to get unread count");
        }

        return data.count || 0;
    } catch (error) {
        console.error('Error getting unread count:', error);
        return 0;
    }
};

export const clearAllNotifications = async (userEmail = null) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notifications/clear-all`, {
            method: "DELETE",
            headers: getHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to clear notifications");
        }

        return data;
    } catch (error) {
        console.error('Error clearing notifications:', error);
        return null;
    }
};

const checkCategoryBudgetAlert = (budgetName, spent, budget, settings, isMultiBudget = false, categories = []) => {
    if (!budget || budget <= 0) return null;

    const percentage = (spent / budget) * 100;
    const { warning, danger } = settings.thresholds;

    const budgetType = isMultiBudget ? 'shared budget' : 'budget';

    const categoriesStr = categories.length > 0 ? categories.join(', ') : budgetName;
    const displayName = budgetName !== categoriesStr ? `${budgetName} (${categoriesStr})` : budgetName;

    console.log(`🧐 Checking alert for ${displayName}: Spent ${spent} / ${budget} (${percentage.toFixed(2)}%)`);

    if (percentage >= danger) {
        const isExactly100 = Math.round(percentage) === 100;

        return {
            type: 'danger',
            category: budgetName,
            categories: categories,
            spent,
            budget,
            percentage: Math.round(percentage),
            isMultiBudget,
            message: isExactly100
                ? `🎯 You reached your ${budgetType} limit! You've spent PHP ${spent.toLocaleString()} out of PHP ${budget.toLocaleString()} (100%) for ${displayName}.`
                : `🚨 You've exceeded your ${budgetType}! You've spent PHP ${spent.toLocaleString()} out of PHP ${budget.toLocaleString()} (${Math.round(percentage)}%) for ${displayName}.`
        };
    } else if (percentage >= warning) {
        return {
            type: 'warning',
            category: budgetName,
            categories: categories,
            spent,
            budget,
            percentage: Math.round(percentage),
            isMultiBudget,
            message: `⚠️ ${isMultiBudget ? 'Shared Budget' : 'Budget'} Warning! You've spent PHP ${spent.toLocaleString()} out of PHP ${budget.toLocaleString()} (${Math.round(percentage)}%) for ${displayName}. Approaching your limit!`
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

        const response = await fetch('http:
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
    console.log('🔍 checkBudgetAlerts START for:', userEmail);
    if (!userEmail) return [];

    try {
        const budgets = await loadBudgetsWithReset(userEmail);
        console.log('🔍 Loaded budgets:', budgets ? budgets.length : 0);

        if (!budgets || budgets.length === 0) {
            console.log('⚠️ No budgets found, skipping alerts.');
            return [];
        }

        const settings = getNotificationSettings(userEmail);
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        console.log('🔍 Fetching transactions from', startDate.toISOString(), 'to', endDate.toISOString());

        const response = await getTransactions({
            type: 'expense',
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        });

        const transactions = response.transactions || [];
        console.log('🔍 Loaded transactions:', transactions.length);
        const alerts = [];
        const processedGroups = new Set();

        budgets.forEach(budget => {
            if (budget.groupId && processedGroups.has(budget.groupId)) {
                return;
            }

            const getRelevantTransactions = (budget) => {
                if (budget.lastExpenseReset) {
                    const resetDate = new Date(budget.lastExpenseReset);
                    
                    resetDate.setHours(0, 0, 0, 0);

                    return transactions.filter(t => {
                        const transactionDate = new Date(t.date || t.createdAt);
                        return transactionDate >= resetDate;
                    });
                }
                return transactions;
            };

            if (budget.groupId) {
                const groupBudgets = budgets.filter(b => b.groupId === budget.groupId);
                const totalBudget = budget.totalBudget || groupBudgets.reduce((sum, b) => sum + b.amount, 0);

                let totalSpent = 0;
                groupBudgets.forEach(b => {
                    const relevantTransactions = getRelevantTransactions(b);
                    const individualBudgetId = b.id || b._id;

                    const matchingTransactions = relevantTransactions
                        .filter(t => {
                            if (!t.budgetId) return false;
                            const categoryMatch = t.category.toLowerCase() === b.category.toLowerCase();
                            
                            const budgetMatch = t.budgetId === individualBudgetId?.toString() || 
                                                t.budgetId === individualBudgetId ||
                                                t.budgetId === budget.groupId;
                            
                            if (budgetMatch && categoryMatch) {
                                console.log(`    ✅ Matched transaction: ₱${t.amount} (budgetId: ${t.budgetId}, category: ${t.category})`);
                            }
                            return budgetMatch && categoryMatch;
                        });
                    
                    const budgetSpecific = matchingTransactions.reduce((sum, t) => sum + t.amount, 0);

                    const unassigned = relevantTransactions
                        .filter(t => !t.budgetId && t.category.toLowerCase() === b.category.toLowerCase())
                        .reduce((sum, t) => sum + t.amount, 0);

                    const categorySpent = budgetSpecific + unassigned;
                    console.log(`  📊 ${b.category}: budgetSpecific=₱${budgetSpecific}, unassigned=₱${unassigned}, total=₱${categorySpent}`);
                    totalSpent += categorySpent;

                    if (b.amount && b.amount > 0) {
                        const categoryPercentage = (categorySpent / b.amount) * 100;
                        const categoryDisplayName = `${b.category} (in ${budget.name || budget.label})`;
                        console.log(`  🔍 Individual category check: ${categoryDisplayName}, Spent: ₱${categorySpent}, Budget: ₱${b.amount}, Percentage: ${categoryPercentage.toFixed(1)}%`);
                        
                        const categoryAlert = checkCategoryBudgetAlert(categoryDisplayName, categorySpent, b.amount, settings, false, [b.category]);
                        if (categoryAlert) {
                            console.log('  ✅ Individual category alert generated:', categoryAlert);
                            alerts.push(categoryAlert);
                        }
                    }
                });

                const budgetName = budget.name || budget.label || 'Multiple Categories';
                const categories = groupBudgets.map(b => b.category);
                console.log(`🔍 Checking multi-budget: ${budgetName}, Spent: ₱${totalSpent}, Budget: ₱${totalBudget}, Percentage: ${((totalSpent / totalBudget) * 100).toFixed(1)}%`);

                const alert = checkCategoryBudgetAlert(budgetName, totalSpent, totalBudget, settings, true, categories);
                if (alert) {
                    console.log('✅ Overall multi-budget alert generated:', alert);
                    alerts.push(alert);
                }

                processedGroups.add(budget.groupId);
            } else {
                const relevantTransactions = getRelevantTransactions(budget);

                const budgetId = budget.id || budget._id;
                const budgetSpecific = relevantTransactions
                    .filter(t => t.budgetId && (t.budgetId === budgetId?.toString() || t.budgetId === budgetId))
                    .reduce((sum, t) => sum + t.amount, 0);

                const unassigned = relevantTransactions
                    .filter(t => !t.budgetId && t.category.toLowerCase() === budget.category.toLowerCase())
                    .reduce((sum, t) => sum + t.amount, 0);

                const spent = budgetSpecific + unassigned;

                const displayName = budget.label || budget.name || budget.category;
                console.log(`🔍 Checking budget: ${displayName}, Spent: ₱${spent}, Budget: ₱${budget.amount}, Percentage: ${((spent / budget.amount) * 100).toFixed(1)}%`);

                const alert = checkCategoryBudgetAlert(displayName, spent, budget.amount, settings, false, [budget.category]);
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
        console.log('🔄 Cache is now empty, will process all alerts');
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
        const existingNotifications = await getStoredNotifications(userEmail);
        console.log('🚨 Existing notifications:', existingNotifications.length);
        const dismissedAlerts = getDismissedAlerts();

        cleanupDismissedAlerts();

        console.log('📊 Cache size before processing:', processedAlertsCache.size);
        console.log('📊 Current Cache:', Array.from(processedAlertsCache));

        for (const alert of alerts) {
            const alertKey = createAlertKey(alert);
            console.log('🔑 Generated Alert Key:', alertKey);

            if (!forceRefresh && processedAlertsCache.has(alertKey)) {
                console.log('⏭️ Alert already processed (in cache), skipping:', alertKey);
                continue;
            }

            console.log('🚨 Processing alert:', alert.category, alert.percentage + '%');

            if (dismissedAlerts[alertKey] && dismissedAlerts[alertKey].date === today) {
                console.log('🚨 Alert was dismissed today, skipping');
                processedAlertsCache.add(alertKey);
                continue;
            }

            const existingAlert = existingNotifications.find(n =>
                n.category === alert.category &&
                n.type === alert.type &&
                n.percentage === alert.percentage &&
                new Date(n.createdAt || n.timestamp).toDateString() === today
            );

            if (existingAlert) {
                console.log('⏭️ Alert already exists in notifications, skipping');
                processedAlertsCache.add(alertKey);
                continue;
            }

            console.log('🔔 Adding new notification for:', alert.category);
            const notification = await addNotification(alert, userEmail);
            
            if (notification) {
                console.log('✅ Notification saved to database:', notification._id);
            } else {
                console.error('❌ Failed to save notification to database');
            }

            processedAlertsCache.add(alertKey);
            console.log('🚨 Alert Type:', alert.type, 'Category:', alert.category, 'Percentage:', alert.percentage + '%');
            
            if (alert.type === 'danger') {
                const overAmount = alert.spent - alert.budget;
                const categoryInfo = alert.categories && alert.categories.length > 0
                    ? alert.categories.join(', ')
                    : alert.category;

                const categoryDisplay = categoryInfo !== alert.category
                    ? `${alert.category} (${categoryInfo})`
                    : alert.category;

                console.log('🔴 Showing DANGER toast for:', categoryDisplay, 'Over by:', overAmount);
                toast.error(
                    `Budget Exceeded: ${categoryDisplay}\nOver by ₱${overAmount.toLocaleString()}`,
                    {
                        id: alertKey,
                        duration: 8000,
                        icon: '🚨',
                        position: 'top-right',
                        style: {
                            border: '1px solid #ef4444',
                            padding: '12px 16px',
                            color: '#b91c1c',
                            backgroundColor: '#fef2f2',
                            fontWeight: '500',
                            fontSize: '14px',
                            minWidth: '300px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px'
                        }
                    }
                );
                console.log('✅ DANGER toast triggered');
            } else if (alert.type === 'warning') {
                const categoryInfo = alert.categories && alert.categories.length > 0
                    ? alert.categories.join(', ')
                    : alert.category;

                const categoryDisplay = categoryInfo !== alert.category
                    ? `${alert.category} (${categoryInfo})`
                    : alert.category;

                console.log('⚠️ Showing WARNING toast for:', categoryDisplay, 'Percentage:', alert.percentage + '%');
                toast(
                    `Budget Warning: ${categoryDisplay}\n${alert.percentage}% of budget used`,
                    {
                        id: alertKey,
                        duration: 6000,
                        icon: '⚠️',
                        position: 'top-right',
                        style: {
                            border: '1px solid #f59e0b',
                            padding: '12px 16px',
                            color: '#b45309',
                            backgroundColor: '#fffbeb',
                            fontWeight: '500',
                            fontSize: '14px',
                            minWidth: '300px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px'
                        }
                    }
                );
                console.log('✅ WARNING toast triggered');
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
        }

        console.log('📊 Cache size after processing:', processedAlertsCache.size);
        console.log('📊 Total alerts processed:', alerts.length);
        console.log('📊 Returning alerts array:', alerts);

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
