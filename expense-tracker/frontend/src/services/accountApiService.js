const API_BASE_URL = 'http:

const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return {
    'Content-Type': 'application/json',
    'x-user-email': user.email || ''
  };
};

export const getAccounts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch accounts');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
};

export const createAccount = async (accountData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(accountData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create account');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};

export const updateAccount = async (id, accountData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(accountData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update account');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating account:', error);
    throw error;
  }
};

export const deleteAccount = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete account');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};

export const bulkCreateAccounts = async (accounts) => {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/bulk`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ accounts })
    });
    
    if (!response.ok) {
      throw new Error('Failed to bulk create accounts');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error bulk creating accounts:', error);
    throw error;
  }
};

export const migrateAccountsToDatabase = async (userEmail) => {
  try {
    const localStorageKey = `accounts_${userEmail}`;
    const migrationKey = `accounts_migrated_${userEmail}`;
    
    if (localStorage.getItem(migrationKey)) {
      console.log('Accounts already migrated for', userEmail);
      return { success: true, message: 'Already migrated' };
    }

    const localAccounts = localStorage.getItem(localStorageKey);
    
    if (!localAccounts) {
      console.log('No local accounts to migrate');
      localStorage.setItem(migrationKey, 'true');
      return { success: true, message: 'No accounts to migrate' };
    }

    const accounts = JSON.parse(localAccounts);
    
    if (!Array.isArray(accounts) || accounts.length === 0) {
      localStorage.setItem(migrationKey, 'true');
      return { success: true, message: 'No accounts to migrate' };
    }

    console.log(`Migrating ${accounts.length} accounts to database...`);
    
    const result = await bulkCreateAccounts(accounts);
    
    if (result.success) {
      localStorage.setItem(migrationKey, 'true');
      console.log('Accounts migration successful!');
    }
    
    return result;
  } catch (error) {
    console.error('Error migrating accounts:', error);
    throw error;
  }
};
