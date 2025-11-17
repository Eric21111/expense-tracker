import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

const EXCHANGE_RATES = {
  PHP_TO_USD: 0.017,
  USD_TO_PHP: 58.86
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('PHP');

  useEffect(() => {
    const loadCurrencyPreference = () => {
      try {
        const storedUser = localStorage.getItem("user");
        let userEmail = localStorage.getItem('userEmail');
        
        if (!userEmail && storedUser) {
          const user = JSON.parse(storedUser);
          userEmail = user.email;
        }
        
        if (userEmail) {
          const savedSettings = localStorage.getItem(`currencySettings_${userEmail}`);
          if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            setCurrency(settings.currency || 'PHP');
          }
        }
      } catch (error) {
        console.error('Error loading currency preference:', error);
      }
    };

    loadCurrencyPreference();
  }, []);

  const updateCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    
    try {
      const storedUser = localStorage.getItem("user");
      let userEmail = localStorage.getItem('userEmail');
      
      if (!userEmail && storedUser) {
        const user = JSON.parse(storedUser);
        userEmail = user.email;
      }
      
      if (userEmail) {
        const settings = { currency: newCurrency };
        localStorage.setItem(`currencySettings_${userEmail}`, JSON.stringify(settings));
      }
    } catch (error) {
      console.error('Error saving currency preference:', error);
    }
  };

  const convertAmount = (amount, fromCurrency, toCurrency) => {
    if (!amount || fromCurrency === toCurrency) return amount;
    
    if (fromCurrency === 'PHP' && toCurrency === 'USD') {
      return amount * EXCHANGE_RATES.PHP_TO_USD;
    } else if (fromCurrency === 'USD' && toCurrency === 'PHP') {
      return amount * EXCHANGE_RATES.USD_TO_PHP;
    }
    
    return amount;
  };

  const formatAmount = (amount, targetCurrency = currency) => {
    if (!amount && amount !== 0) return targetCurrency === 'USD' ? '$0.00' : '₱0';
    const convertedAmount = convertAmount(amount, 'PHP', targetCurrency);
    
    if (targetCurrency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(convertedAmount);
    } else {
      return `₱${convertedAmount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })}`;
    }
  };

  const getCurrencySymbol = (targetCurrency = currency) => {
    return targetCurrency === 'USD' ? '$' : '₱';
  };

  const getCurrencyCode = (targetCurrency = currency) => {
    return targetCurrency === 'USD' ? 'USD' : 'PHP';
  };

  const value = {
    currency,
    updateCurrency,
    convertAmount,
    formatAmount,
    getCurrencySymbol,
    getCurrencyCode,
    exchangeRates: EXCHANGE_RATES
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
