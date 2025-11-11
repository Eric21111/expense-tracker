import React, { useState, useMemo, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaSlidersH } from "react-icons/fa";
import { getTransactions } from "../../services/transactionService";
import SalaryIcon from "../../assets/categories/salary.svg";
import GiftIcon from "../../assets/categories/gift.svg";
import BillsIcon from "../../assets/categories/bills.svg";
import TransportationIcon from "../../assets/categories/transportation.svg";
import ShoppingIcon from "../../assets/categories/shopping.svg";

const TransactionListCard = ({ refreshTrigger, onDateFilterChange }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [activePeriod, setActivePeriod] = useState("Month");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const categoryConfig = {
    "Salary": { icon: SalaryIcon, gradient: "linear-gradient(to bottom right, #FFA726, #FF8A00)" },
    "Gift": { icon: GiftIcon, gradient: "linear-gradient(to bottom right, #FF7043, #FF5722)" },
    "Food": { icon: ShoppingIcon, gradient: "linear-gradient(to bottom right, #FB923C, #EA580C)" },
    "Transportation": { icon: TransportationIcon, gradient: "linear-gradient(to bottom right, #60A5FA, #2563EB)" },
    "Bills": { icon: BillsIcon, gradient: "linear-gradient(to bottom right, #C084FC, #9333EA)" },
    "Entertainment": { icon: ShoppingIcon, gradient: "linear-gradient(to bottom right, #FBBF24, #F59E0B)" },
    "Shopping": { icon: ShoppingIcon, gradient: "linear-gradient(to bottom right, #EC407A, #E91E63)" },
    "Grocery": { icon: ShoppingIcon, gradient: "linear-gradient(to bottom right, #66BB6A, #4CAF50)" },
    "Others": { icon: ShoppingIcon, gradient: "linear-gradient(to bottom right, #4ade80, #22c55e)" },
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        const filters = {
          startDate: startOfMonth.toISOString(),
          endDate: endOfMonth.toISOString()
        };
        
        const response = await getTransactions(filters);
        if (response.success) {
          setTransactions(response.transactions || []);
        }
        
        if (onDateFilterChange) {
          onDateFilterChange(filters);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [refreshTrigger]);

  
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

  const renderCategoryIcon = (transaction) => {
    const config = categoryConfig[transaction.category] || 
                   { icon: ShoppingIcon, gradient: "linear-gradient(to bottom right, #4ade80, #22c55e)" };
    
    return (
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: config.gradient }}
      >
        <img
          src={config.icon}
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

    
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading ? (
          <p className="text-center text-gray-500 py-4">Loading transactions...</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No transactions found</p>
        ) : (
          filteredTransactions.map((transaction) => (
            <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                {renderCategoryIcon(transaction)}
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
              <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionListCard;