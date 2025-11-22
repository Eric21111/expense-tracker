export const clearAllUserData = (userEmail) => {
  if (!userEmail) return;

  console.log('Clearing all data for user:', userEmail);

  const userDataKeys = [
    `budgets_${userEmail}`,
    `budget_reset_${userEmail}`,
    `notificationSettings_${userEmail}`,
    `budget_notifications_${userEmail}`,
    `transactions_${userEmail}`,
    `summary_${userEmail}`,
    `dismissedAlerts_${userEmail}`,
    `dismissed_budget_alerts`,
    `currencySettings_${userEmail}`,
    `accounts_${userEmail}`,
    `transferHistory_${userEmail}`,
    `badgeProgress_${userEmail}`,
    `shownBadges_${userEmail}`,
    `budgetCompletions_${userEmail}`,
    `archivedBudgets_${userEmail}`,
    `budgetAlerts_${userEmail}`,
    `accounts_migrated_${userEmail}`,
  ];

  userDataKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log('Removed:', key);
  });

  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user.email === userEmail) {
        localStorage.removeItem('user');
        localStorage.removeItem('userEmail');
        console.log('Removed general user data');
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }

  console.log('All user data cleared for:', userEmail);
};

export const getUserDataKeys = (userEmail) => {
  if (!userEmail) return [];

  const allKeys = Object.keys(localStorage);
  return allKeys.filter(key => key.includes(userEmail));
};

export const exportUserData = (userEmail) => {
  if (!userEmail) return {};

  const userData = {};
  const userKeys = getUserDataKeys(userEmail);

  userKeys.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      userData[key] = value ? JSON.parse(value) : null;
    } catch (e) {
      userData[key] = localStorage.getItem(key);
    }
  });

  return userData;
};

export const importUserData = (userEmail, userData) => {
  if (!userEmail || !userData) return;

  clearAllUserData(userEmail);

  Object.entries(userData).forEach(([key, value]) => {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch (e) {
      console.error('Error importing data for key:', key, e);
    }
  });

  console.log('User data imported successfully');
};
