import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaFilter, FaChevronDown } from 'react-icons/fa';
import { useCurrency } from '../../contexts/CurrencyContext';

const TransferHistoryModal = ({ isOpen, onClose, transfers = [], accounts = [] }) => {
  const { formatAmount } = useCurrency();
  const [selectedPeriod, setSelectedPeriod] = useState('Month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const periods = ['Day', 'Week', 'Month', 'Year', 'Period'];

  const formatDate = (date) => {
    switch (selectedPeriod) {
      case 'Day':
        return date.toLocaleDateString('en-US', { 
          weekday: 'long',
          month: 'long', 
          day: 'numeric',
          year: 'numeric' 
        });
      case 'Week':
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'Month':
        return date.toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        });
      case 'Year':
        return date.getFullYear().toString();
      case 'Period':
        return 'Custom Period';
      default:
        return date.toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        });
    }
  };

  const handlePreviousPeriod = () => {
    const newDate = new Date(currentDate);
    switch (selectedPeriod) {
      case 'Day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'Week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'Month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'Year':
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
      default:
        newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNextPeriod = () => {
    const newDate = new Date(currentDate);
    switch (selectedPeriod) {
      case 'Day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'Week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'Month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'Year':
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
      default:
        newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAccountDropdown && !event.target.closest('.account-dropdown-container')) {
        setShowAccountDropdown(false);
      }
    };
    
    if (showAccountDropdown) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showAccountDropdown]);

  if (!isOpen) return null;

  const getDateRange = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);
    
    switch (selectedPeriod) {
      case 'Day':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'Week':
        const dayOfWeek = start.getDay();
        start.setDate(start.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case 'Month':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(end.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'Year':
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(11, 31);
        end.setHours(23, 59, 59, 999);
        break;
      case 'Period':
        return { start: null, end: null };
      default:
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(end.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
    }
    
    return { start, end };
  };

  const getFilteredTransfers = () => {
    if (!transfers || transfers.length === 0) return [];
    
    let filtered = transfers.map(transfer => {
      const fromAccount = accounts.find(acc => acc.id === parseInt(transfer.fromAccount));
      const toAccount = accounts.find(acc => acc.id === parseInt(transfer.toAccount));
      
      return {
        ...transfer,
        displayDate: new Date(transfer.date).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: '2-digit'
        }),
        fromAccountIcon: fromAccount?.icon || 'FaWallet',
        toAccountIcon: toAccount?.icon || 'FaWallet',
        fromAccountColor: fromAccount?.color || '#9B59B6',
        toAccountColor: toAccount?.color || '#3498DB'
      };
    });
    const dateRange = getDateRange();
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(transfer => {
        const transferDate = new Date(transfer.date);
        return transferDate >= dateRange.start && transferDate <= dateRange.end;
      });
    }
    if (selectedAccount !== 'all') {
      filtered = filtered.filter(transfer => 
        transfer.fromAccount === selectedAccount || 
        transfer.toAccount === selectedAccount ||
        transfer.fromAccount === parseInt(selectedAccount) ||
        transfer.toAccount === parseInt(selectedAccount)
      );
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };
  
  const filteredTransfers = getFilteredTransfers();

  return (
    <div
      id="backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 font-poppins p-4"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full mx-4 relative shadow-2xl transform transition-all duration-300 scale-100">
        <div className="bg-green-100 rounded-t-3xl p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h3 className="text-2xl font-bold text-gray-800">Transfer History</h3>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="border-2 border-green-400 border-dashed rounded-2xl p-4 flex-1">
              <div className="flex justify-center gap-4 mb-4">
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setCurrentDate(new Date());
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedPeriod === period
                        ? 'bg-green-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center gap-8">
                <button
                  onClick={handlePreviousPeriod}
                  className="p-2 text-green-500 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <FaChevronLeft size={16} />
                </button>
                
                <span className="text-lg font-semibold text-gray-800 min-w-0 text-center">
                  {formatDate(currentDate)}
                </span>
                
                <button
                  onClick={handleNextPeriod}
                  className="p-2 text-green-500 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <FaChevronRight size={16} />
                </button>
              </div>
            </div>
            
            <div className="account-dropdown-container relative">
              <button 
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className={`p-2 rounded-lg transition-colors ${
                  selectedAccount !== 'all' 
                    ? 'text-green-500 bg-green-100' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                title={selectedAccount !== 'all' ? `Filtering by: ${accounts.find(acc => acc.id.toString() === selectedAccount)?.name}` : 'Sort by Account'}
              >
                <FaFilter size={16} />
              </button>
              
              {showAccountDropdown && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
                  <div className="p-2">
                    <div className="text-sm font-medium text-gray-700 px-3 py-2">Sort by Account:</div>
                    <button
                      onClick={() => {
                        setSelectedAccount('all');
                        setShowAccountDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedAccount === 'all'
                          ? 'bg-green-100 text-green-700'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      All Accounts
                    </button>
                    {accounts.map((account) => (
                      <button
                        key={account.id}
                        onClick={() => {
                          setSelectedAccount(account.id.toString());
                          setShowAccountDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                          selectedAccount === account.id.toString()
                            ? 'bg-green-100 text-green-700'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center text-white text-xs"
                          style={{ backgroundColor: account.color }}
                        >
                          •
                        </div>
                        <span>{account.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTransfers.length > 0 ? (
              filteredTransfers.map((transfer) => {
                const fromAccount = accounts.find(acc => acc.id === parseInt(transfer.fromAccount));
                const toAccount = accounts.find(acc => acc.id === parseInt(transfer.toAccount));
                const getIcon = (iconName) => {
                  const iconMap = {
                    'FaWallet': '💳',
                    'FaMobileAlt': '📱', 
                    'FaPiggyBank': '🐷',
                    'FaCreditCard': '💳',
                    'FaMoneyBill': '💵'
                  };
                  return iconMap[iconName] || '💳';
                };
                const isOutgoing = selectedAccount !== 'all' && 
                  (transfer.fromAccount === selectedAccount || transfer.fromAccount === parseInt(selectedAccount));
                const isIncoming = selectedAccount !== 'all' && 
                  (transfer.toAccount === selectedAccount || transfer.toAccount === parseInt(selectedAccount));
                
                return (
                  <div
                    key={transfer.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg"
                          style={{ backgroundColor: fromAccount?.color || '#9B59B6' }}
                        >
                          {getIcon(fromAccount?.icon)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800">
                              {transfer.fromAccountName}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="font-semibold text-gray-800">
                              {transfer.toAccountName}
                            </span>
                            {selectedAccount !== 'all' && (
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                isOutgoing ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                              }`}>
                                {isOutgoing ? 'Sent' : 'Received'}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transfer.displayDate}
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${
                        selectedAccount === 'all' ? 'text-gray-800' :
                        isOutgoing ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {selectedAccount === 'all' ? '' : isOutgoing ? '-' : '+'}{formatAmount(transfer.amount)}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Transfer History</h3>
                <p className="text-gray-500">
                  {transfers.length === 0 
                    ? 'No transfers have been made yet. Create your first transfer!' 
                    : selectedAccount !== 'all' 
                      ? `No transfers found for ${accounts.find(acc => acc.id.toString() === selectedAccount)?.name || 'this account'}`
                      : 'No transfers found for the selected period'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferHistoryModal;
