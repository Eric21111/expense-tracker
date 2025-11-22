import React from "react";

import { FaHandHoldingUsd, FaCoins } from "react-icons/fa";

const TransactionStatsCard = () => {
  return (
    <div
      className="bg-white p-6 rounded-2xl shadow-lg grid grid-cols-2 gap-4"
      style={{ borderRadius: "20px" }}
    >
      
      <div className="flex flex-col items-center text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
          style={{ backgroundColor: "#10B98120" }}
        >
          <FaHandHoldingUsd className="text-xl" style={{ color: "#10B981" }} />
        </div>
        <p className="text-2xl font-bold text-gray-800">42</p>
        <p className="text-xs mt-1" style={{ color: "#10B981" }}>
          Number of Transactions
        </p>
        <p className="text-xs text-gray-400">Spent so far for this month</p>
      </div>

      <div className="flex flex-col items-center text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
          style={{ backgroundColor: "#10B98120" }} 
        >
          <FaCoins className="text-xl" style={{ color: "#10B981" }} />
        </div>
        <p className="text-2xl font-bold text-gray-800">PHP 418</p>
        <p className="text-xs mt-1" style={{ color: "#10B981" }}>
          Average Daily Spending
        </p>
        <p className="text-xs text-gray-400">Average amount spent per day</p>
      </div>
    </div>
  );
};

export default TransactionStatsCard;