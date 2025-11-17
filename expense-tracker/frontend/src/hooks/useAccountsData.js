import { useState, useEffect } from 'react';

const useAccountsData = () => {
  const [username, setUsername] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [transferHistory, setTransferHistory] = useState([]);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      setUsername(user.name);
      
      const userEmail = user.email;
      if (userEmail) {
        const savedAccounts = localStorage.getItem(`accounts_${userEmail}`);
        if (savedAccounts) {
          try {
            const parsedAccounts = JSON.parse(savedAccounts);
            setAccounts(parsedAccounts);
          } catch (e) {
            console.error('Error parsing saved accounts:', e);
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
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user?.email;
    if (userEmail && accounts.length > 0) {
      localStorage.setItem(`accounts_${userEmail}`, JSON.stringify(accounts));
    }
  }, [accounts]);
  
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
    setTransferHistory
  };
};

export default useAccountsData;
