import React from 'react';
import AccountCard from './AccountCard';
import EmptyAccountsState from './EmptyAccountsState';

const AccountsList = ({ 
  accounts, 
  onAddAccount, 
  onToggle, 
  onEdit, 
  onDelete,
  getIconComponent,
  formatAmount 
}) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      {accounts.length === 0 ? (
        <EmptyAccountsState onAddAccount={onAddAccount} />
      ) : (
        accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            getIconComponent={getIconComponent}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            formatAmount={formatAmount}
          />
        ))
      )}
    </div>
  );
};

export default AccountsList;
