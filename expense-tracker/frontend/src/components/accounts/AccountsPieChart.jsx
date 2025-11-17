import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AccountsPieChart = ({ 
  accounts, 
  totalBalance,
  formatAmount,
  getCurrencySymbol 
}) => {
  const enabledAccounts = accounts.filter(acc => acc.enabled && acc.balance > 0);
  
  const chartData = {
    labels: enabledAccounts.map(acc => acc.name),
    datasets: [
      {
        data: enabledAccounts.map(acc => acc.balance),
        backgroundColor: enabledAccounts.map(acc => acc.color),
        borderWidth: 0,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${formatAmount(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="max-w-xs mx-auto">
        {enabledAccounts.length > 0 ? (
          <>
            <Pie data={chartData} options={chartOptions} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-6">
              {enabledAccounts.map((account) => {
                const percentage = ((account.balance / totalBalance) * 100).toFixed(1);
                return (
                  <div key={account.id} className="flex items-center gap-1.5 sm:gap-2">
                    <div
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: account.color }}
                    ></div>
                    <span className="text-xs sm:text-sm text-gray-600 truncate flex-1">
                      {account.name}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-800 flex-shrink-0">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-400 text-sm sm:text-base">No active accounts with balance</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsPieChart;
