import React, { useState, useMemo } from "react";
import { FaChevronLeft, FaChevronRight, FaSlidersH } from "react-icons/fa";
// Import SVGs for transaction categories (these paths are assumed to exist)
import SalaryIcon from "../../assets/categories/salary.svg";
import GiftIcon from "../../assets/categories/gift.svg";
import BillsIcon from "../../assets/categories/bills.svg";
import TransportationIcon from "../../assets/categories/transportation.svg";
import ShoppingIcon from "../../assets/categories/shopping.svg";

const TransactionListCard = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activePeriod, setActivePeriod] = useState("Month"); // Day, Week, Month, Year, Period

  // Placeholder data for transactions
  const transactions = [
    {
      id: 1,
      category: "Salary",
      description: "",
      amount: 30000,
      date: "11/02/25",
      type: "income",
      icon: SalaryIcon,
      bgGradient: "linear-gradient(to bottom right, #FFA726, #FF8A00)", // Orange gradient
    },
    {
      id: 2,
      category: "Gift",
      description: "",
      amount: 5000,
      date: "11/02/25",
      type: "income",
      icon: GiftIcon,
      bgGradient: "linear-gradient(to bottom right, #FF7043, #FF5722)", // Red-Orange gradient
    },
    {
      id: 3,
      category: "Bills",
      description: "",
      amount: -5000,
      date: "11/02/25",
      type: "expense",
      icon: BillsIcon,
      bgGradient: "linear-gradient(to bottom right, #AB47BC, #9C27B0)", // Purple gradient
    },
    {
      id: 4,
      category: "Transportation",
      description: "Maxim",
      amount: -4000,
      date: "11/02/25",
      type: "expense",
      icon: TransportationIcon,
      bgGradient: "linear-gradient(to bottom right, #42A5F5, #2196F3)", // Blue gradient
    },
    {
      id: 5,
      category: "Shopping",
      description: "",
      amount: -3000,
      date: "11/02/25",
      type: "expense",
      icon: ShoppingIcon,
      bgGradient: "linear-gradient(to bottom right, #EC407A, #E91E63)", 
    },
  ];

  
  const filteredTransactions = useMemo(() => {
    if (activeTab === "All") {
      return transactions;
    }
    if (activeTab === "Expenses") {
      return transactions.filter((t) => t.type === "expense");
    }
    if (activeTab === "Income") {
      return transactions.filter((t) => t.type === "income");
    }

    return [];
  }, [activeTab, transactions]);

  
  const periodTotal = useMemo(() => {
  
    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]); 

  const renderCategoryIcon = (iconPath, bgGradient) => {
    return (
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: bgGradient }}
      >
        <img
          src={iconPath}
          alt="Category Icon"
          className="w-5 h-5 filter brightness-0 invert"
        />
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg" style={{ borderRadius: "20px" }}>
    
      <div className="flex justify-between items-center mb-6">
        <div className="w-10"></div>
        <div className="flex justify-center space-x-4">
          {["All", "Expenses", "Income"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1 text-lg font-medium border-b-2 transition-colors duration-200 ${
                activeTab === tab
                  ? "text-black font-semibold border-green-500"
                  : "text-gray-500 hover:text-gray-700 border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition">
          <FaSlidersH />
        </button>
      </div>

      <div
        className="mb-6 border-2 border-dashed border-green-300 rounded-2xl p-4 bg-[#F5FBF7]"
        style={{ borderRadius: "20px" }}
      >
      
        <div className="flex justify-around mb-4">
          {["Day", "Week", "Month", "Year", "Period"].map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`px-3 py-1 text-sm font-medium transition-colors duration-200 ${
                activePeriod === period
                  ? "text-black border-b-2 border-green-500"
                  : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
              }`}
            >
              {period}
            </button>
          ))}
        </div>

   
        <div className="flex items-center justify-center gap-6 mb-4">
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
            <FaChevronLeft />
          </button>
          <span className="text-lg font-semibold text-gray-800">
            November, 2025
          </span>
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
            <FaChevronRight />
          </button>
        </div>


        {activeTab !== "All" && (
          <div className="flex w-full h-2 rounded-full overflow-hidden my-4 px-2">
   
            <div className="bg-yellow-400" style={{ width: "25%" }}></div>
            <div className="bg-purple-500" style={{ width: "40%" }}></div>
            <div className="bg-orange-500" style={{ width: "20%" }}></div>
            <div className="bg-blue-400" style={{ width: "15%" }}></div>
          </div>
        )}


        <p
          className={`text-3xl font-bold text-center mt-4 ${
           
            periodTotal >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
        
          {activeTab === "Income" && periodTotal > 0 ? "+" : ""}
          PHP {periodTotal.toLocaleString()}
        </p>
      </div>

    
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              {renderCategoryIcon(transaction.icon, transaction.bgGradient)}
              <div>
                <p className="font-semibold text-gray-800">{transaction.category}</p>
                {transaction.description && (
                  <p className="text-sm text-gray-500">{transaction.description}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-semibold ${
                  transaction.type === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                {transaction.amount > 0 ? "+" : ""}PHP {Math.abs(transaction.amount).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">{transaction.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionListCard;