import React, { useState, useEffect } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Header2 from '../components/shared/Header2';
import AddAccountModal from '../components/accounts/AddAccountModal';
import SuccessModal from '../components/transactions/SuccessModal';
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
import { createAccount as createAccountAPI, updateAccount as updateAccountAPI, deleteAccount as deleteAccountAPI, getAccounts } from '../services/accountApiService';
import { checkAndStartTour } from '../utils/tutorial';

const Accounts = () => {
  const { isExpanded } = useSidebar();
  const { formatAmount, getCurrencySymbol } = useCurrency();
  const { username, accounts, setAccounts, transferHistory, setTransferHistory, loading } = useAccountsData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdAccount, setCreatedAccount] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showTransferHistoryModal, setShowTransferHistoryModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editAccount, setEditAccount] = useState(null);

  const totalBalance = accounts.reduce((sum, acc) => {
    const balance = acc.enabled ? (acc.balance || 0) : 0;
    console.log('💰 Account balance calc:', {
      name: acc.name,
      enabled: acc.enabled,
      balance: acc.balance,
      addingToTotal: balance
    });
    return sum + balance;
  }, 0);

  console.log('💰 Total Balance:', totalBalance, 'from', accounts.length, 'accounts');

  useEffect(() => {

    const timer = setTimeout(() => {
      checkAndStartTour();
    }, 600);

    const handleLocationChange = () => {
      setTimeout(() => {
        checkAndStartTour();
      }, 600);
    };

    const handleTourStart = () => {
      setTimeout(() => {
        checkAndStartTour();
      }, 300);
    };
    
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('tour-navigation', handleTourStart);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('tour-navigation', handleTourStart);
    };
  }, []);

  const handleToggle = async (id) => {
    const account = accounts.find(acc => acc.id === id || acc._id === id);
    if (!account) return;

    const accountId = account._id || account.id;

    try {
      const updatedAccount = { ...account, enabled: !account.enabled };
      await updateAccountAPI(accountId, updatedAccount);
      setAccounts(accounts.map(acc =>
        (acc.id === id || acc._id === id) ? updatedAccount : acc
      ));
    } catch (error) {
      console.error('Error toggling account:', error);
      alert('Failed to update account. Please try again.');
    }
  };

  const handleEdit = (id) => {
    const account = accounts.find(acc => acc.id === id || acc._id === id);
    if (account) {
      setEditAccount(account);
      setEditMode(true);
      setShowAddModal(true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      const account = accounts.find(acc => acc.id === id || acc._id === id);
      const accountId = account?._id || id;

      try {
        await deleteAccountAPI(accountId);
        setAccounts(accounts.filter(acc => acc.id !== id && acc._id !== id));
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  const handleAddAccount = () => {
    setEditMode(false);
    setEditAccount(null);
    setShowAddModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setShowAddModal(false);
    setCreatedAccount(null);
  };

  const handleAddAccountSubmit = async (accountData, isEditMode) => {
    try {
      if (isEditMode) {
        const accountId = accountData._id || accountData.id;
        const result = await updateAccountAPI(accountId, accountData);
        if (result.success) {
          const formattedAccount = {
            ...result.account,
            id: result.account._id,
            icon: result.account.icon || accountData.icon || 'wallet',
            color: result.account.color || accountData.color || '#10B981'
          };
          setAccounts(accounts.map(acc =>
            (acc.id === accountData.id || acc._id === accountData.id) ? formattedAccount : acc
          ));
        }
        setShowAddModal(false);
        setEditMode(false);
        setEditAccount(null);
      } else {
        const result = await createAccountAPI(accountData);
        if (result.success) {
          const formattedAccount = {
            ...result.account,
            id: result.account._id,
            icon: result.account.icon || accountData.icon || 'wallet',
            color: result.account.color || accountData.color || '#10B981'
          };
          setAccounts([...accounts, formattedAccount]);
          setCreatedAccount({
            name: formattedAccount.name,
            balance: formattedAccount.balance
          });
          setShowSuccessModal(true);
        }
      }
    } catch (error) {
      console.error('Error saving account:', error);
      alert('Failed to save account. Please try again.');
    }
  };

  const handleTransferSubmit = async (transferData) => {
    const fromAccount = accounts.find(acc => acc.id === parseInt(transferData.fromAccount));
    const toAccount = accounts.find(acc => acc.id === parseInt(transferData.toAccount));

    if (fromAccount && toAccount) {
      if (fromAccount.balance < transferData.amount) {
        alert(`Insufficient balance in ${fromAccount.name}. Available: ${formatAmount(fromAccount.balance)}`);
        return;
      }

      try {
        const updatedFromAccount = { ...fromAccount, balance: fromAccount.balance - transferData.amount };
        const updatedToAccount = { ...toAccount, balance: toAccount.balance + transferData.amount };

        await Promise.all([
          updateAccountAPI(fromAccount.id, updatedFromAccount),
          updateAccountAPI(toAccount.id, updatedToAccount)
        ]);

        const updatedAccounts = accounts.map(acc => {
          if (acc.id === parseInt(transferData.fromAccount)) {
            return updatedFromAccount;
          } else if (acc.id === parseInt(transferData.toAccount)) {
            return updatedToAccount;
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
      } catch (error) {
        console.error('Error transferring funds:', error);
        alert('Failed to transfer funds. Please try again.');
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-poppins">
      <Sidebar />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ml-0 lg:ml-20 ${isExpanded ? "lg:ml-64" : "lg:ml-20"
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
        isOpen={showAddModal && !showSuccessModal}
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

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        message={`Your account "${createdAccount?.name || ''}" has been created successfully!`}
      />
    </div>
  );
};

export default Accounts;
