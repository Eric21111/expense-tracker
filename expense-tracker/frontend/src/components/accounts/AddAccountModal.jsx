import React, { useState } from 'react';
import { FaWallet, FaMobileAlt, FaPiggyBank, FaCreditCard, FaMoneyBill, FaUniversity, FaPaypal, FaPlus } from 'react-icons/fa';
import { SiGooglepay } from 'react-icons/si';
import { MdAccountBalance, MdSavings, MdTrendingUp } from 'react-icons/md';
import { BiCoin, BiMoney } from 'react-icons/bi';
import { BsCurrencyExchange, BsCurrencyDollar } from 'react-icons/bs';
import { useCurrency } from '../../contexts/CurrencyContext';

const AddAccountModal = ({ isOpen, onClose, onSubmit, existingAccounts = [], editMode = false, editAccount = null }) => {
  const { getCurrencyCode } = useCurrency();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    icon: 'FaWallet',
    color: '#9B59B6'
  });
  React.useEffect(() => {
    if (editMode && editAccount) {
      setFormData({
        name: editAccount.name || '',
        amount: editAccount.balance || '',
        icon: editAccount.icon || 'FaWallet',
        color: editAccount.color || '#9B59B6'
      });
    } else {
      setFormData({
        name: '',
        amount: '',
        icon: 'FaWallet',
        color: '#9B59B6'
      });
    }
  }, [editMode, editAccount]);

  const accountIcons = [
    { icon: FaWallet, name: 'FaWallet' },
    { icon: FaPiggyBank, name: 'FaPiggyBank' },
    { icon: FaMobileAlt, name: 'FaMobileAlt' },
    { icon: FaMoneyBill, name: 'FaMoneyBill' },
    { icon: BiMoney, name: 'BiMoney' },
    { icon: MdTrendingUp, name: 'MdTrendingUp' },
    { icon: FaCreditCard, name: 'FaCreditCard' },
    { icon: MdAccountBalance, name: 'MdAccountBalance' },
    { icon: MdSavings, name: 'MdSavings' },
    { icon: FaPaypal, name: 'FaPaypal' },
    { icon: SiGooglepay, name: 'SiGooglepay' },
    { icon: BsCurrencyDollar, name: 'BsCurrencyDollar' },
    { icon: FaUniversity, name: 'FaUniversity' },
    { icon: BsCurrencyExchange, name: 'BsCurrencyExchange' },
    { icon: BiCoin, name: 'BiCoin' }
  ];

  const colors = [
    '#9B59B6',
    '#F39C12',
    '#F1C40F',
    '#E91E63',
    '#3498DB',
    '#95A5A6'
  ];
  const usedColors = existingAccounts
    .filter(account => !editMode || account.id !== editAccount?.id)
    .map(account => account.color);
  const availableColors = colors.filter(color => !usedColors.includes(color));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIconSelect = (iconName) => {
    setFormData(prev => ({
      ...prev,
      icon: iconName
    }));
  };

  const handleColorSelect = (color) => {
    if (!usedColors.includes(color)) {
      setFormData(prev => ({
        ...prev,
        color: color
      }));
    }
  };

  const handleCustomColorChange = (color) => {
    setFormData(prev => ({
      ...prev,
      color: color.hex
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }
    
    const accountData = {
      id: editMode ? editAccount.id : Date.now(),
      name: formData.name.trim(),
      balance: parseFloat(formData.amount) || 0,
      icon: formData.icon,
      color: formData.color,
      enabled: editMode ? editAccount.enabled : true,
      type: editMode ? editAccount.type : 'custom'
    };
    
    onSubmit(accountData, editMode);
    setFormData({
      name: '',
      amount: '',
      icon: 'FaWallet',
      color: '#9B59B6'
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 font-poppins p-4"
    >
      <div className="bg-white rounded-3xl max-w-md w-full mx-4 relative shadow-2xl transform transition-all duration-300 scale-100">
        <div className="bg-green-100 rounded-t-3xl p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h3 className="text-2xl font-bold text-gray-800">{editMode ? 'Edit Account' : 'Add New Account'}</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Account Name"
                  required
                />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                  placeholder="150"
                  min="0"
                  step="0.01"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">
                  {getCurrencyCode()}
                </span>
              </div>
            </div>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Icons:</label>
            <div className="grid grid-cols-6 gap-3">
              {accountIcons.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleIconSelect(item.name)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl transition-all ${
                    formData.icon === item.name 
                      ? 'bg-green-600 ring-2 ring-green-300' 
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  <item.icon size={20} />
                </button>
))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Colors:</label>
            <div className="flex gap-3">
              {colors.map((color, index) => {
                const isUsed = usedColors.includes(color);
                const isSelected = formData.color === color;
                
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    disabled={isUsed}
                    className={`w-12 h-12 rounded-2xl transition-all relative ${
                      isSelected
                        ? 'ring-2 ring-gray-400 ring-offset-2'
                        : isUsed
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'
                    }`}
                    style={{ backgroundColor: color }}
                    title={isUsed ? 'Color already in use' : `Select ${color}`}
                  >
                    {isUsed && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
              <div className="relative">
              <label 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors cursor-pointer ${
                  colors.includes(formData.color) 
                    ? 'bg-gray-300 text-gray-500 hover:bg-gray-400' 
                    : 'text-white hover:opacity-80'
                }`}
                style={!colors.includes(formData.color) ? { backgroundColor: formData.color } : {}}
              >
                <FaPlus size={16} />
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleCustomColorChange({ hex: e.target.value })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
          >
            {editMode ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default AddAccountModal;
