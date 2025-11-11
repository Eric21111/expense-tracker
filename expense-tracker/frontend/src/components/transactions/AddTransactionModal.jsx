import React, { useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";
import { createTransaction } from "../../services/transactionService";

import SalaryIcon from "../../assets/categories/salary.svg";
import GiftIcon from "../../assets/categories/gift.svg";
import BillsIcon from "../../assets/categories/bills.svg";
import TransportationIcon from "../../assets/categories/transportation.svg";
import ShoppingIcon from "../../assets/categories/shopping.svg";

const AddTransactionModal = ({ isOpen, onClose, onTransactionAdded }) => {
  const [type, setType] = useState("Expenses"); 
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    account: "Wallet",
    date: new Date().toISOString().split("T")[0],
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const categoryIcons = {
    
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const categoryData = categoryIcons[formData.category] || { 
        icon: ShoppingIcon, 
        gradient: "linear-gradient(to bottom right, #9E9E9E, #757575)" 
      };

      const transactionData = {
        type: type === "Expenses" ? "expense" : "income",
        category: formData.category,
        amount: parseFloat(formData.amount),
        account: formData.account,
        date: formData.date,
        description: formData.description,
        icon: categoryData.icon,
        bgGradient: categoryData.gradient
      };

      const response = await createTransaction(transactionData);
      
      if (response.success) {
      
        setFormData({
          category: "",
          amount: "",
          account: "Wallet",
          date: new Date().toISOString().split("T")[0],
          description: ""
        });
        
    
        if (onTransactionAdded) {
          onTransactionAdded();
        }
        
        onClose();
      }
    } catch (err) {
      console.error("Error creating transaction:", err);
      setError(err.message || "Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e) => {
    if (e.target.id === "backdrop") {
      onClose();
    }
  };

  return (
    <div
      id="backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 font-poppins p-4"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition z-10"
        >
          <FaTimes size={20} />
        </button>


        <div className="p-6 bg-gradient-to-r from-[rgba(52,168,83,1)] to-[rgba(204,239,204,1)] text-white rounded-t-2xl">
          <h2 className="text-2xl font-semibold">Add Transaction</h2>
        </div>

        <div className="p-6">
 
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-200 rounded-full p-1">
              <button
                onClick={() => setType("Expenses")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  type === "Expenses"
                    ? "bg-white text-black shadow"
                    : "text-gray-600"
                }`}
              >
                Expenses
              </button>
              <button
                onClick={() => setType("Income")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  type === "Income"
                    ? "bg-white text-black shadow"
                    : "text-gray-600"
                }`}
              >
                Income
              </button>
            </div>
          </div>

          <form className="space-y-4" id="transaction-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Category <span className="text-red-500">*</span>
                </label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select category</option>
                  {type === "Income" ? (
                    <>
                      <option value="Salary">Salary</option>
                      <option value="Gift">Gift</option>
                    </>
                  ) : (
                    <>
                      <option value="Food">Food</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Bills">Bills</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Grocery">Grocery</option>
                      <option value="Others">Others</option>
                    </>
                  )}
                </select>
              </div>

        
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="150"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 pr-12"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    PHP
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
      
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account <span className="text-red-500">*</span>
                </label>
                <select 
                  name="account"
                  value={formData.account}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="Wallet">Wallet</option>
                  <option value="Bank Account">Bank Account</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>

    
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Write a note..."
              ></textarea>
            </div>

       
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <button
                    key={i}
                    type="button"
                    className="aspect-square bg-green-100 text-green-500 rounded-lg flex items-center justify-center border-2 border-dashed border-green-300 hover:bg-green-200 transition"
                  >
                    <FaPlus size={24} />
                  </button>
                ))}
              </div>
            </div>
          </form> 
  

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

     
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose} 
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="transaction-form" 
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-400 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-500 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;