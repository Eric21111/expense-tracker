import React from 'react';
import { MdSwapHoriz, MdHistory } from 'react-icons/md';

const TotalBalanceCard = ({ 
  totalBalance, 
  onTransferClick, 
  onHistoryClick,
  formatAmount 
}) => {
  const formattedBalance = formatAmount(totalBalance);
  console.log('🎴 TotalBalanceCard rendering:', { 
    totalBalance, 
    formattedBalance,
    formatAmountType: typeof formatAmount
  });
  
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="grid grid-cols-3 items-center gap-3 sm:gap-6 lg:gap-8">
        <div className="flex flex-col items-center">
          <button 
            onClick={onHistoryClick}
            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-green-500 text-white rounded-xl sm:rounded-2xl flex items-center justify-center hover:bg-green-600 transition-colors mb-2 sm:mb-3"
            aria-label="Transfer History"
          >
            <MdHistory size={20} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
          </button>
          <span className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-600 text-center leading-tight">Transfer History</span>
        </div>
        
        <div className="flex flex-col items-center">
          <p className="text-green-600 font-medium text-xs sm:text-sm transform -translate-y-4 sm:-translate-y-6">Total</p>
          <h2 className="text-lg sm:text-2xl lg:text-[32px] font-bold text-green-600 transform -translate-y-3 sm:-translate-y-4 whitespace-nowrap">
            {formatAmount(totalBalance)}
          </h2>
        </div>
        
        <div className="flex flex-col items-center">
          <button 
            onClick={onTransferClick}
            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-green-500 text-white rounded-xl sm:rounded-2xl flex items-center justify-center hover:bg-green-600 transition-colors mb-2 sm:mb-3"
            aria-label="Transfer Accounts"
          >
            <MdSwapHoriz size={20} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
          </button>
          <span className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-600 text-center leading-tight">Transfer Accounts</span>
        </div>
      </div>
    </div>
  );
};

export default TotalBalanceCard;
