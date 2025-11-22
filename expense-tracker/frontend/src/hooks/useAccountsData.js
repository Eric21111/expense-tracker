import { useState, useEffect } from 'react';
import { getAccounts, createAccount, updateAccount, deleteAccount, migrateAccountsToDatabase } from '../services/accountApiService';

const useAccountsData = () => {
  const [username, setUsername] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [transferHistory, setTransferHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadAccountsFromDatabase = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.name) {
        setUsername(user.name);
        
        const userEmail = user.email;
        if (userEmail) {
          try {
            await migrateAccountsToDatabase(userEmail);
            
            const result = await getAccounts();
            if (result.success) {
              const accountColors = [
                '#10B981',
                '#3B82F6',
                '#8B5CF6',
                '#F59E0B',
                '#EC4899',
                '#14B8A6',
                '#F97316',
                '#6366F1'
              ];
              
              const accountsWithDefaults = result.accounts.map((acc, index) => ({
                ...acc,
                id: acc._id,
                icon: acc.icon || 'wallet',
                color: acc.color || accountColors[index % accountColors.length]
              }));
              
              console.log('✅ Accounts loaded with defaults:', accountsWithDefaults);
              setAccounts(accountsWithDefaults);
            }
          } catch (error) {
            console.error('Error loading accounts from database:', error);
            const savedAccounts = localStorage.getItem(`accounts_${userEmail}`);
            if (savedAccounts) {
              try {
                const parsedAccounts = JSON.parse(savedAccounts);
                setAccounts(parsedAccounts);
              } catch (e) {
                console.error('Error parsing saved accounts:', e);
              }
            }
          }
          
          const savedTransferHistory = localStorage.getItem(`transferHistory_${userEmail}`);
          if (savedTransferHistory) {
            try {
              const parsedTransferHistory = JSON.parse(savedTransferHistory);
              setTransferHistory(parsedTransferHistory);
            } catch (e) {
              console.error('Error parsing saved transfer history:', e);
            }
          }
        }
      }
      setLoading(false);
    };

    loadAccountsFromDatabase();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user?.email;
    if (userEmail && transferHistory.length > 0) {
      localStorage.setItem(`transferHistory_${userEmail}`, JSON.stringify(transferHistory));
    }
  }, [transferHistory]);
  
  return {
    username,
    accounts,
    setAccounts,
    transferHistory,
    setTransferHistory,
    loading
  };
};

export default useAccountsData;
