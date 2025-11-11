import React from "react";
import {
  FaHamburger,
  FaCar,
  FaBolt,
  FaShoppingBag,
} from "react-icons/fa";

// This data includes the new gradient colors you added
const expenses = [
  {
    name: "Food",
    time: "Yesterday",
    amount: 850,
    icon: FaHamburger,
    color: "bg-gradient-to-r from-[#FB923C] to-[#EA580C]",
  },
  {
    name: "Transport",
    time: "2 days ago",
    amount: 500,
    icon: FaCar,
    color: "bg-gradient-to-r from-[#60A5FA] to-[#2563EB]",
  },
  {
    name: "Bills",
    time: "3 days ago",
    amount: 1500,
    icon: FaBolt,
    color: "bg-gradient-to-r from-[#C084FC] to-[#9333EA]",
  },
  {
    name: "Entertainment",
    time: "4 days ago",
    amount: 1200,
    icon: FaShoppingBag,
    color: "bg-gradient-to-r from-[#FBBF24] to-[#F59E0B]",
  },
  {
    name: "Entertainment", 
    time: "4 days ago",
    amount: 1200,
    icon: FaShoppingBag,
    color: "bg-green-400",
  },
];

const RecentExpenses = () => {
  return (
    <div
      className="lg:col-span-2 bg-white p-6 shadow-md"
      style={{ borderRadius: "30px" }}
    >
      <h2 className="text-xl font-bold text-green-600 mb-6">Recent Expenses</h2>
      <div className="space-y-3">
        {expenses.map((expense, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${expense.color}`}
              >
                <expense.icon className="text-white text-xl" />
              </div>
              <div>
                <p className={`font-semibold text-gray-800`}>{expense.name}</p>
                <p className="text-sm text-gray-500">{expense.time}</p>
              </div>
            </div>
            <p className="text-lg font-bold text-red-600">
              -PHP {expense.amount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentExpenses;