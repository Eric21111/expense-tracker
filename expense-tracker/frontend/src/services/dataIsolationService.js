let currentUserCache = {
  email: null,
  data: {}
};
export const getCurrentUserEmail = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.email || null;
    }
    return localStorage.getItem('userEmail') || null;
  } catch (error) {
    console.error('Error getting current user email:', error);
    return null;
  }
};

const validateUserAccess = (requestedUserEmail) => {
  const currentUser = getCurrentUserEmail();
  if (!currentUser || !requestedUserEmail) return false;
  return currentUser === requestedUserEmail;
};

export const getUserStorageKey = (keyType, userEmail = null) => {
  const email = userEmail || getCurrentUserEmail();
  if (!email) {
    throw new Error('No user email available for data access');
  }
  return `${keyType}_${email}`;
};

export const getUserData = (keyType, userEmail = null) => {
  try {
    const email = userEmail || getCurrentUserEmail();
    if (!email) return null;
    
    if (userEmail && !validateUserAccess(userEmail)) {
      console.error('Unauthorized access attempt to user data:', userEmail);
      return null;
    }
    
    const key = getUserStorageKey(keyType, email);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error getting user data for ${keyType}:`, error);
    return null;
  }
};

export const setUserData = (keyType, data, userEmail = null) => {
  try {
    const email = userEmail || getCurrentUserEmail();
    if (!email) {
      console.error('Cannot save data: no user email available');
      return false;
    }
    
    if (userEmail && !validateUserAccess(userEmail)) {
      console.error('Unauthorized save attempt for user:', userEmail);
      return false;
    }
    
    const key = getUserStorageKey(keyType, email);
    localStorage.setItem(key, JSON.stringify(data));
    
    if (email === currentUserCache.email) {
      currentUserCache.data[keyType] = data;
    }
    
    return true;
  } catch (error) {
    console.error(`Error saving user data for ${keyType}:`, error);
    return false;
  }
};

export const removeUserData = (keyType, userEmail = null) => {
  try {
    const email = userEmail || getCurrentUserEmail();
    if (!email) return false;
    
    if (userEmail && !validateUserAccess(userEmail)) {
      console.error('Unauthorized delete attempt for user:', userEmail);
      return false;
    }
    
    const key = getUserStorageKey(keyType, email);
    localStorage.removeItem(key);
    
    if (email === currentUserCache.email && currentUserCache.data[keyType]) {
      delete currentUserCache.data[keyType];
    }
    
    return true;
  } catch (error) {
    console.error(`Error removing user data for ${keyType}:`, error);
    return false;
  }
};

export const clearUserSession = (userEmail) => {
  if (!userEmail) return;
  
  const dataTypes = [
    'budgets',
    'archivedBudgets',
    'accounts',
    'transactions',
    'transferHistory',
    'currencySettings',
    'notificationSettings',
    'customCategories',
    'budget_reset',
    'budget_notifications',
    'budgetAlerts',
    'lastBudgetReminder',
    'budget_reset_notification'
  ];
  
  dataTypes.forEach(type => {
    const key = `${type}_${userEmail}`;
    localStorage.removeItem(key);
  });
  
  if (currentUserCache.email === userEmail) {
    currentUserCache = { email: null, data: {} };
  }
};

export const switchUser = (newUserEmail) => {
  currentUserCache = {
    email: newUserEmail,
    data: {}
  };
  
  console.log('Switched to user:', newUserEmail);
};

export const getAllUserData = (userEmail) => {
  if (!validateUserAccess(userEmail)) {
    console.error('Unauthorized access to all user data');
    return null;
  }
  
  const userData = {};
  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (key.includes(`_${userEmail}`)) {
      try {
        const value = localStorage.getItem(key);
        const keyType = key.replace(`_${userEmail}`, '');
        userData[keyType] = JSON.parse(value);
      } catch (e) {
        userData[key] = localStorage.getItem(key);
      }
    }
  });
  
  return userData;
};

export const userHasData = (userEmail) => {
  const keys = Object.keys(localStorage);
  return keys.some(key => key.includes(`_${userEmail}`));
};

export const migrateDataToUserSpecific = (oldKey, keyType, userEmail) => {
  try {
    const oldData = localStorage.getItem(oldKey);
    if (oldData) {
      setUserData(keyType, JSON.parse(oldData), userEmail);
      localStorage.removeItem(oldKey);
      console.log(`Migrated ${oldKey} to user-specific key for ${userEmail}`);
    }
  } catch (error) {
    console.error(`Error migrating ${oldKey}:`, error);
  }
};

export const validateDataIsolation = () => {
  const report = {
    valid: true,
    issues: [],
    userSpecificKeys: [],
    globalKeys: []
  };
  
  const keys = Object.keys(localStorage);
  const userEmail = getCurrentUserEmail();
  
  keys.forEach(key => {
    if (key.includes('@')) {
      report.userSpecificKeys.push(key);
      
      if (!key.includes(userEmail) && userEmail) {
        report.issues.push(`Found data for another user in key: ${key}`);
        report.valid = false;
      }
    } else if (!['user', 'theme', 'sidebarExpanded'].includes(key)) {
      report.globalKeys.push(key);
      report.issues.push(`Found non-user-specific key: ${key}`);
    }
  });
  
  return report;
};

export const DATA_TYPES = {
  BUDGETS: 'budgets',
  ARCHIVED_BUDGETS: 'archivedBudgets',
  ACCOUNTS: 'accounts',
  TRANSACTIONS: 'transactions',
  TRANSFER_HISTORY: 'transferHistory',
  CURRENCY_SETTINGS: 'currencySettings',
  NOTIFICATION_SETTINGS: 'notificationSettings',
  CUSTOM_CATEGORIES: 'customCategories',
  BUDGET_RESET: 'budget_reset',
  BUDGET_NOTIFICATIONS: 'budget_notifications',
  BUDGET_ALERTS: 'budgetAlerts',
  LAST_REMINDER: 'lastBudgetReminder'
};

export class SecureUserData {
  constructor(userEmail) {
    this.userEmail = userEmail;
    this.authorized = validateUserAccess(userEmail);
  }
  
  get(dataType) {
    if (!this.authorized) {
      throw new Error('Unauthorized data access');
    }
    return getUserData(dataType, this.userEmail);
  }
  
  set(dataType, data) {
    if (!this.authorized) {
      throw new Error('Unauthorized data modification');
    }
    return setUserData(dataType, data, this.userEmail);
  }
  
  remove(dataType) {
    if (!this.authorized) {
      throw new Error('Unauthorized data deletion');
    }
    return removeUserData(dataType, this.userEmail);
  }
}
