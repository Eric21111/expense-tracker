import { loadBudgetsWithReset } from './budgetService';
import { addNotification } from './notificationService';
import { sendBudgetReminderEmail, emailTemplates } from './emailService';

const isDueDateApproaching = (budget, daysBeforeWarning = 3) => {
  if (!budget.dueDate) return false;
  
  const now = new Date();
  const dueDate = new Date(budget.dueDate);
  
  if (dueDate < now) return false;
  
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysUntilDue = Math.ceil((dueDate - now) / msPerDay);
  
  return daysUntilDue <= daysBeforeWarning && daysUntilDue >= 0;
};

const sendEmailReminder = async (user, budgets) => {
  const formattedBudgets = budgets.map(budget => {
    const daysLeft = Math.ceil((new Date(budget.dueDate) - new Date()) / (24 * 60 * 60 * 1000));
    
    return {
      category: budget.category,
      description: budget.description || 'No description',
      dueDate: new Date(budget.dueDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      amount: budget.amount,
      daysLeft: daysLeft
    };
  });
  let emailSubject = 'Budget Due Date Reminders';
  if (budgets.length === 1) {
    const budget = budgets[0];
    const template = emailTemplates.singleBudget(formattedBudgets[0]);
    emailSubject = template.subject;
  } else {
    const template = emailTemplates.multipleBudgets(budgets.length);
    emailSubject = template.subject;
  }
  
  const emailData = {
    to: user.email,
    subject: emailSubject,
    budgets: formattedBudgets
  };
  const emailResult = await sendBudgetReminderEmail(emailData);
  
  if (emailResult.success) {
    console.log('✅ Budget reminder email sent successfully:', emailResult);
    budgets.forEach(budget => {
      const message = formatReminderMessage(budget);
      addNotification({
        type: 'reminder',
        title: 'Budget Due Date Reminder',
        message: message,
        budgetId: budget.id,
        category: budget.category,
        dueDate: budget.dueDate,
        emailSent: true
      }, user.email);
    });
    const reminderKey = `lastBudgetReminder_${user.email}`;
    localStorage.setItem(reminderKey, JSON.stringify({
      date: new Date().toISOString(),
      budgetIds: budgets.map(b => b.id),
      emailSent: true,
      emailResult: emailResult
    }));
  } else {
    console.error('❌ Failed to send budget reminder email:', emailResult.error);
    budgets.forEach(budget => {
      const message = formatReminderMessage(budget);
      addNotification({
        type: 'reminder',
        title: 'Budget Due Date Reminder',
        message: message,
        budgetId: budget.id,
        category: budget.category,
        dueDate: budget.dueDate,
        emailSent: false,
        emailError: emailResult.error
      }, user.email);
    });
  }
  
  return { emailData, emailResult };
};

const wasReminderSentToday = (userEmail, budgetId) => {
  const reminderKey = `lastBudgetReminder_${userEmail}`;
  const lastReminder = localStorage.getItem(reminderKey);
  
  if (!lastReminder) return false;
  
  try {
    const reminder = JSON.parse(lastReminder);
    const reminderDate = new Date(reminder.date);
    const today = new Date();
    const sameDay = reminderDate.toDateString() === today.toDateString();
    const sameBudget = reminder.budgetIds?.includes(budgetId);
    
    return sameDay && sameBudget;
  } catch {
    return false;
  }
};

export const checkBudgetReminders = async (userEmail, daysBeforeWarning = 3) => {
  try {
    const notificationSettingsKey = `notificationSettings_${userEmail}`;
    const storedSettings = localStorage.getItem(notificationSettingsKey);
    
    if (!storedSettings) {
      return { checked: false, reason: 'No notification settings found' };
    }
    
    const settings = JSON.parse(storedSettings);
    if (!settings.billReminders || !settings.emailNotifications) {
      return { 
        checked: true, 
        remindersEnabled: false,
        reason: 'Bill reminders or email notifications disabled' 
      };
    }
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      return { checked: false, reason: 'No user data found' };
    }
    
    const user = JSON.parse(storedUser);
    const budgets = loadBudgetsWithReset(userEmail);
    
    const approachingBudgets = budgets.filter(budget => {
      if (wasReminderSentToday(userEmail, budget.id)) {
        return false;
      }
      
      return isDueDateApproaching(budget, daysBeforeWarning);
    });
    
    if (approachingBudgets.length === 0) {
      return { 
        checked: true, 
        remindersEnabled: true,
        budgetsChecked: budgets.length,
        remindersNeeded: 0,
        reason: 'No budgets with approaching due dates' 
      };
    }
    const emailResult = await sendEmailReminder(user, approachingBudgets);
    
    return {
      checked: true,
      remindersEnabled: true,
      budgetsChecked: budgets.length,
      remindersNeeded: approachingBudgets.length,
      remindersSent: approachingBudgets.length,
      emailData: emailResult
    };
    
  } catch (error) {
    console.error('Error checking budget reminders:', error);
    return { 
      checked: false, 
      error: error.message 
    };
  }
};

export const initializeBudgetReminders = (userEmail) => {
  checkBudgetReminders(userEmail);
  
  const intervalId = setInterval(() => {
    checkBudgetReminders(userEmail);
  }, 6 * 60 * 60 * 1000);
  window.budgetReminderInterval = intervalId;
  
  return intervalId;
};

export const stopBudgetReminders = () => {
  if (window.budgetReminderInterval) {
    clearInterval(window.budgetReminderInterval);
    window.budgetReminderInterval = null;
  }
};

export const formatReminderMessage = (budget) => {
  const daysLeft = Math.ceil((new Date(budget.dueDate) - new Date()) / (24 * 60 * 60 * 1000));
  const description = budget.description ? ` (${budget.description})` : '';
  
  if (daysLeft === 0) {
    return `Your ${budget.category} budget${description} is due today!`;
  } else if (daysLeft === 1) {
    return `Your ${budget.category} budget${description} is due tomorrow!`;
  } else {
    return `Your ${budget.category} budget${description} is due in ${daysLeft} days`;
  }
};
