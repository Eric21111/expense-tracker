import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaShoppingCart, FaUtensils, FaBolt, FaShoppingBag, FaCar, FaGift, FaDollarSign } from 'react-icons/fa';
import AddCategoryModal from './AddCategoryModal';

const CategorySelectionModal = ({ isOpen, onClose, onSelectCategory, transactionType }) => {
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [customCategories, setCustomCategories] = useState([]);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (isOpen) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          const email = user.email || '';
          setUserEmail(email);
          
          const storageKey = `customCategories_${email}`;
          const savedCategories = JSON.parse(localStorage.getItem(storageKey) || '[]');
          setCustomCategories(savedCategories);
        } catch (e) {
          console.error('Error loading user data or custom categories:', e);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const expenseCategories = [
    { name: 'Grocery', icon: FaShoppingCart, bgColor: 'bg-orange-400', textColor: 'text-white' },
    { name: 'Food', icon: FaUtensils, bgColor: 'bg-orange-500', textColor: 'text-white' },
    { name: 'Bills', icon: FaBolt, bgColor: 'bg-purple-400', textColor: 'text-white' },
    { name: 'Shopping', icon: FaShoppingBag, bgColor: 'bg-pink-400', textColor: 'text-white' },
    { name: 'Transportation', icon: FaCar, bgColor: 'bg-blue-400', textColor: 'text-white' },
    { name: 'Entertainment', icon: FaGift, bgColor: 'bg-green-400', textColor: 'text-white' },
    { name: 'Others', icon: FaShoppingCart, bgColor: 'bg-gray-400', textColor: 'text-white' },
  ];

  const incomeCategories = [
    { name: 'Salary', icon: FaDollarSign, bgColor: 'bg-green-500', textColor: 'text-white' },
    { name: 'Gift', icon: FaGift, bgColor: 'bg-pink-400', textColor: 'text-white' },
  ];

  const customCategoriesFiltered = customCategories.filter(cat => 
    cat.type === (transactionType === 'Income' ? 'Income' : 'Expense')
  );
  
  const defaultCategories = transactionType === 'Income' ? incomeCategories : expenseCategories;
  const categories = [...defaultCategories, ...customCategoriesFiltered];


  const getIconSrc = (iconName, categoryType) => {
    const iconPaths = {
      'GcashIcon': '/src/assets/income icon/arcticons_gcash.svg',
      'BankIcon': '/src/assets/income icon/clarity_bank-solid.svg',
      'BuildingIcon': '/src/assets/income icon/clarity_building-line.svg',
      'FoodIcon': '/src/assets/income icon/fluent_food-24-regular.svg',
      'CouponIcon': '/src/assets/income icon/mdi_coupon.svg',
      'MechanicIcon': '/src/assets/income icon/mdi_mechanic.svg',
      'CreditCardIcon': '/src/assets/income icon/mynaui_credit-card-solid.svg',
      'WorkIcon': '/src/assets/income icon/pajamas_work.svg',
      'AnalyticsIcon': '/src/assets/income icon/tdesign_chart-analytics.svg',
      'MoneyExchangeIcon': '/src/assets/income icon/hugeicons_money-exchange-01.svg',
      'GroupIcon': '/src/assets/income icon/Group.svg',
      'VectorIcon': '/src/assets/income icon/Vector.svg',
      'OldManIcon': '/src/assets/income icon/healthicons_old-man-outline.svg',
      'MoneyExchange2Icon': '/src/assets/income icon/hugeicons_money-exchange-03.svg',
      'ElectricBoltIcon': '/src/assets/income icon/material-symbols_electric-bolt-outline-rounded.svg',
      'WorkMaintenanceIcon': '/src/assets/income icon/pajamas_work-item-maintenance.svg',
      'CreditCard2Icon': '/src/assets/income icon/streamline_credit-card-2-remix.svg',
      'ShoppingBagIcon': '/src/assets/expense icons/flowbite_shopping-bag-outline.svg',
      'PhoneIcon': '/src/assets/expense icons/gridicons_phone.svg',
      'DressIcon': '/src/assets/expense icons/hugeicons_dress-04.svg',
      'ShoesIcon': '/src/assets/expense icons/hugeicons_running-shoes.svg',
      'ShoppingIcon': '/src/assets/expense icons/icon-park-outline_shopping.svg',
      'BeerIcon': '/src/assets/expense icons/icon-park-twotone_beer.svg',
      'CarIcon': '/src/assets/expense icons/lucide_car.svg',
      'CookingIcon': '/src/assets/expense icons/lucide_cooking-pot.svg',
      'ElectricIcon': '/src/assets/expense icons/material-symbols_electric-bolt-outline-rounded.svg',
      'TravelIcon': '/src/assets/expense icons/material-symbols_travel.svg',
      'LaundryIcon': '/src/assets/expense icons/mdi_local-laundry-service.svg',
      'GameIcon': '/src/assets/expense icons/mingcute_game-2-fill.svg',
      'MedicalIcon': '/src/assets/expense icons/streamline-plump_medical-bag-solid.svg',
      'PetIcon': '/src/assets/expense icons/streamline-plump_pet-paw.svg',
      'GiftIcon': '/src/assets/expense icons/tabler_gift.svg',
      'EducationIcon': '/src/assets/expense icons/tdesign_education-filled.svg',
    };
    
    return iconPaths[iconName] || iconPaths['GcashIcon'];
  };

  const handleCategorySelect = (categoryName) => {
    onSelectCategory(categoryName);
    onClose();
  };

  const handleAddNewCategory = (newCategory) => {
    setCustomCategories(prev => [...prev, newCategory]);
    onSelectCategory(newCategory.name);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
     <div
      id="backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 font-poppins p-4"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-400 px-6 py-4">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>


        <div className="px-6 py-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {categories.map((category) => {
              const isCustomCategory = category.id;
              
              return (
                <div
                  key={category.id || category.name}
                  onClick={() => handleCategorySelect(category.name)}
                  className="flex flex-col items-center p-3 cursor-pointer hover:scale-105 transition-transform duration-200"
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-2 shadow-lg text-white ${
                      isCustomCategory ? '' : category.bgColor
                    }`}
                    style={isCustomCategory ? { backgroundColor: category.bgColor } : {}}
                  >
                    {isCustomCategory ? (
                      <img
                        src={category.iconSrc || getIconSrc(category.icon, category.type)}
                        alt={category.name}
                        className="w-7 h-7"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                    ) : (
                      category.icon ? <category.icon size={24} className="text-white" /> : null
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center">{category.name}</span>
                </div>
              );
            })}
            <div
              onClick={() => setShowAddCategoryModal(true)}
              className="flex flex-col items-center p-3 cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gray-200 mb-2 shadow-lg">
                <FaPlus className="text-xl text-gray-600" />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center">Add More</span>
            </div>
          </div>
        </div>
      </div>
      
      <AddCategoryModal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onAddCategory={handleAddNewCategory}
        transactionType={transactionType}
      />
    </div>
  );
};


export default CategorySelectionModal;
