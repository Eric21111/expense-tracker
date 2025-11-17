import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaChevronDown } from "react-icons/fa";
import { createTransaction } from "../../services/transactionService";
import { processAndShowAlerts, showSuccessNotification } from "../../services/notificationService";
import CategorySelectionModal from "./CategorySelectionModal";
import SuccessModal from "./SuccessModal";

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
    account: "",
    date: new Date().toISOString().split("T")[0],
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [availableBudgets, setAvailableBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState("");

  
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

  const getAccountIcon = (iconName) => {
    return iconName;
  };
  useEffect(() => {
    if (isOpen) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.email) {
        setUserEmail(user.email);
        const savedAccounts = localStorage.getItem(`accounts_${user.email}`);
        if (savedAccounts) {
          try {
            const parsedAccounts = JSON.parse(savedAccounts);
            const enabledAccounts = parsedAccounts.filter(acc => acc.enabled);
            setAccounts(enabledAccounts);
            if (!formData.account && enabledAccounts.length > 0) {
              setFormData(prev => ({ ...prev, account: enabledAccounts[0].id.toString() }));
            }
          } catch (e) {
            console.error('Error parsing accounts:', e);
          }
        }
      }
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategorySelect = (categoryName) => {
    setFormData(prev => ({
      ...prev,
      category: categoryName
    }));
    if (userEmail && categoryName) {
      const savedBudgets = localStorage.getItem(`budgets_${userEmail}`);
      if (savedBudgets) {
        try {
          const budgets = JSON.parse(savedBudgets);
          const categoryBudgets = budgets.filter(b => 
            b.category.toLowerCase() === categoryName.toLowerCase()
          );
          setAvailableBudgets(categoryBudgets);
          if (categoryBudgets.length === 1) {
            const budget = categoryBudgets[0];
            setSelectedBudget(budget.groupId || budget.id?.toString());
          } else {
            setSelectedBudget("");
          }
        } catch (e) {
          console.error('Error parsing budgets:', e);
          setAvailableBudgets([]);
        }
      } else {
        setAvailableBudgets([]);
      }
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setFormData(prev => ({
      ...prev,
      category: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || !formData.account) {
      setError("Please fill in all required fields");
      return;
    }
    if (type === "Expenses") {
      const selectedAccount = accounts.find(acc => acc.id.toString() === formData.account);
      if (selectedAccount && parseFloat(formData.amount) > selectedAccount.balance) {
        setError(`Insufficient balance. Available: PHP ${selectedAccount.balance.toLocaleString()}`);
        return;
      }
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
        bgGradient: categoryData.gradient,
        budgetId: selectedBudget || null
      };

      const response = await createTransaction(transactionData);
      if (response.success && formData.account) {
        const savedAccounts = localStorage.getItem(`accounts_${userEmail}`);
        if (savedAccounts) {
          try {
            const accounts = JSON.parse(savedAccounts);
            const updatedAccounts = accounts.map(acc => {
              if (acc.id.toString() === formData.account) {
                const amount = parseFloat(formData.amount);
                if (type === "Expenses") {
                  return { ...acc, balance: acc.balance - amount };
                } else {
                  return { ...acc, balance: acc.balance + amount };
                }
              }
              return acc;
            });
            localStorage.setItem(`accounts_${userEmail}`, JSON.stringify(updatedAccounts));
          } catch (e) {
            console.error('Error updating account balance:', e);
          }
        }
      }
        
      if (response.success) {
        setFormData({
          category: "",
          amount: "",
          account: accounts.length > 0 ? accounts[0].id.toString() : "",
          date: new Date().toISOString().split("T")[0],
          description: ""
        });
        setSelectedBudget("");
        setAvailableBudgets([]);
        if (type === 'Expenses') {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const user = JSON.parse(storedUser);
              const userEmail = user.email;
              if (userEmail) {
                setTimeout(() => {
                  processAndShowAlerts(userEmail, true);
                }, 500);
              }
            } catch (e) {
              console.error('Error parsing user data:', e);
            }
          }
        }
        if (onTransactionAdded) {
          onTransactionAdded();
        }
        window.dispatchEvent(new Event('transactionAdded'));
        
        setShowSuccessModal(true);
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
                onClick={() => handleTypeChange("Expenses")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  type === "Expenses"
                    ? "bg-white text-black shadow"
                    : "text-gray-600"
                }`}
              >
                Expenses
              </button>
              <button
                onClick={() => handleTypeChange("Income")}
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
                  Select<span className="hidden sm:inline"> Category</span> <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <span className={formData.category ? "text-gray-900" : "text-gray-500"}>
                    {formData.category || "Select category"}
                  </span>
                  <FaChevronDown className="text-gray-400 text-sm" />
                </button>
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

            {type === "Expenses" && availableBudgets.length > 0 && formData.category && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Budget {availableBudgets.length > 1 && <span className="text-red-500">*</span>}
                </label>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  required={availableBudgets.length > 1}
                >
                  {availableBudgets.length > 1 && <option value="">Select a budget</option>}
                  {availableBudgets.map((budget) => {
                    const displayName = budget.name || budget.category;
                    const description = budget.description ? ` (${budget.description})` : '';
                    const budgetAmount = budget.totalBudget || budget.amount;
                    const amount = budgetAmount ? ` - PHP ${budgetAmount}` : '';
                    return (
                      <option key={budget.id || budget.groupId} value={budget.groupId || budget.id?.toString()}>
                        {displayName}{description}{amount}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

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
                  <option value="">Select Account</option>
                  {accounts.map((account) => {
                    const IconComponent = getAccountIcon(account.icon);
                    return (
                      <option key={account.id} value={account.id.toString()}>
                        {account.name} (PHP {account.balance.toLocaleString()})
                      </option>
                    );
                  })}
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
        
        <CategorySelectionModal
          isOpen={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          onSelectCategory={handleCategorySelect}
          transactionType={type}
        />
        
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            onClose();
          }}
          message="Your transaction has been added."
        />
      </div>
    </div>
  );
};

export default AddTransactionModal;