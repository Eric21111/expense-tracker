import React, { useState } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Header2 from '../components/shared/Header2';
import AddAccountModal from '../components/accounts/AddAccountModal';
import TransferModal from '../components/accounts/TransferModal';
import TransferHistoryModal from '../components/accounts/TransferHistoryModal';
import AccountsList from '../components/accounts/AccountsList';
import TotalBalanceCard from '../components/accounts/TotalBalanceCard';
import AccountsPieChart from '../components/accounts/AccountsPieChart';
import FloatingActionButton from '../components/accounts/FloatingActionButton';
import { useSidebar } from '../contexts/SidebarContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { getIconComponent } from '../utils/accountIconMapping';
import useAccountsData from '../hooks/useAccountsData';

const Accounts = () => {
  const { isExpanded } = useSidebar();
  const { formatAmount, getCurrencySymbol } = useCurrency();
  const { username, accounts, setAccounts, transferHistory, setTransferHistory } = useAccountsData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showTransferHistoryModal, setShowTransferHistoryModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editAccount, setEditAccount] = useState(null);

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.enabled ? acc.balance : 0), 0);

  const handleToggle = (id) => {
    setAccounts(accounts.map(acc => 
      acc.id === id ? { ...acc, enabled: !acc.enabled } : acc
    ));
  };

  const handleEdit = (id) => {
    const account = accounts.find(acc => acc.id === id);
    if (account) {
      setEditAccount(account);
      setEditMode(true);
      setShowAddModal(true);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      setAccounts(accounts.filter(acc => acc.id !== id));
    }
  };

  const handleAddAccount = () => {
    setEditMode(false);
    setEditAccount(null);
    setShowAddModal(true);
  };

  const handleAddAccountSubmit = (accountData, isEditMode) => {
    if (isEditMode) {
      setAccounts(accounts.map(acc => 
        acc.id === accountData.id ? accountData : acc
      ));
    } else {
      setAccounts([...accounts, accountData]);
    }
    setShowAddModal(false);
    setEditMode(false);
    setEditAccount(null);
  };

  const handleTransferSubmit = (transferData) => {
    const fromAccount = accounts.find(acc => acc.id === parseInt(transferData.fromAccount));
    const toAccount = accounts.find(acc => acc.id === parseInt(transferData.toAccount));
    
    if (fromAccount && toAccount) {
      if (fromAccount.balance < transferData.amount) {
        alert(`Insufficient balance in ${fromAccount.name}. Available: ${formatAmount(fromAccount.balance)}`);
        return;
      }
      const updatedAccounts = accounts.map(acc => {
        if (acc.id === parseInt(transferData.fromAccount)) {
          return { ...acc, balance: acc.balance - transferData.amount };
        } else if (acc.id === parseInt(transferData.toAccount)) {
          return { ...acc, balance: acc.balance + transferData.amount };
        }
        return acc;
      });
      
      setAccounts(updatedAccounts);
      setShowTransferModal(false);
      const historyEntry = {
        ...transferData,
        fromAccountName: fromAccount.name,
        toAccountName: toAccount.name,
        timestamp: new Date().toISOString()
      };
      setTransferHistory(prev => [historyEntry, ...prev]);
      
      console.log('Transfer completed:', transferData);
    }
  };


  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-poppins">
      <Sidebar />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ml-0 lg:ml-20 ${
        isExpanded ? "lg:ml-64" : "lg:ml-20"
      }`}>
        <Header2 username={username} title="Accounts" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <AccountsList
                accounts={accounts}
                onAddAccount={handleAddAccount}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
                getIconComponent={getIconComponent}
                formatAmount={formatAmount}
              />

              <div className="space-y-4 sm:space-y-6">
                <TotalBalanceCard
                  totalBalance={totalBalance}
                  onTransferClick={() => setShowTransferModal(true)}
                  onHistoryClick={() => setShowTransferHistoryModal(true)}
                  formatAmount={formatAmount}
                />
                
                <AccountsPieChart
                  accounts={accounts}
                  totalBalance={totalBalance}
                  formatAmount={formatAmount}
                  getCurrencySymbol={getCurrencySymbol}
                />
              </div>
            </div>
          </div>

          <FloatingActionButton onClick={handleAddAccount} />
        </main>
      </div>
      
      <AddAccountModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditMode(false);
          setEditAccount(null);
        }}
        onSubmit={handleAddAccountSubmit}
        existingAccounts={accounts}
        editMode={editMode}
        editAccount={editAccount}
      />
      
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onSubmit={handleTransferSubmit}
        accounts={accounts}
      />
      
      <TransferHistoryModal
        isOpen={showTransferHistoryModal}
        onClose={() => setShowTransferHistoryModal(false)}
        transfers={transferHistory}
        accounts={accounts}
      />
    </div>
  );
};

export default Accounts;
