import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';
import TransactionIconCatalogModal from './TransactionIconCatalogModal';

import GcashIcon from '../../assets/income icon/arcticons_gcash.svg';
import BankIcon from '../../assets/income icon/clarity_bank-solid.svg';
import BuildingIcon from '../../assets/income icon/clarity_building-line.svg';
import FoodIcon from '../../assets/income icon/fluent_food-24-regular.svg';
import CouponIcon from '../../assets/income icon/mdi_coupon.svg';
import MechanicIcon from '../../assets/income icon/mdi_mechanic.svg';
import CreditCardIcon from '../../assets/income icon/mynaui_credit-card-solid.svg';
import WorkIcon from '../../assets/income icon/pajamas_work.svg';
import AnalyticsIcon from '../../assets/income icon/tdesign_chart-analytics.svg';
import MoneyExchangeIcon from '../../assets/income icon/hugeicons_money-exchange-01.svg';
import GroupIcon from '../../assets/income icon/Group.svg';
import VectorIcon from '../../assets/income icon/Vector.svg';
import OldManIcon from '../../assets/income icon/healthicons_old-man-outline.svg';
import MoneyExchange2Icon from '../../assets/income icon/hugeicons_money-exchange-03.svg';
import ElectricBoltIcon from '../../assets/income icon/material-symbols_electric-bolt-outline-rounded.svg';
import WorkMaintenanceIcon from '../../assets/income icon/pajamas_work-item-maintenance.svg';
import CreditCard2Icon from '../../assets/income icon/streamline_credit-card-2-remix.svg';

import ShoppingBagIcon from '../../assets/expense icons/flowbite_shopping-bag-outline.svg';
import PhoneIcon from '../../assets/expense icons/gridicons_phone.svg';
import DressIcon from '../../assets/expense icons/hugeicons_dress-04.svg';
import ShoesIcon from '../../assets/expense icons/hugeicons_running-shoes.svg';
import ShoppingIcon from '../../assets/expense icons/icon-park-outline_shopping.svg';
import BeerIcon from '../../assets/expense icons/icon-park-twotone_beer.svg';
import CarIcon from '../../assets/expense icons/lucide_car.svg';
import CookingIcon from '../../assets/expense icons/lucide_cooking-pot.svg';
import ElectricIcon from '../../assets/expense icons/material-symbols_electric-bolt-outline-rounded.svg';
import TravelIcon from '../../assets/expense icons/material-symbols_travel.svg';
import LaundryIcon from '../../assets/expense icons/mdi_local-laundry-service.svg';
import GameIcon from '../../assets/expense icons/mingcute_game-2-fill.svg';
import MedicalIcon from '../../assets/expense icons/streamline-plump_medical-bag-solid.svg';
import PetIcon from '../../assets/expense icons/streamline-plump_pet-paw.svg';
import GiftIcon from '../../assets/expense icons/tabler_gift.svg';
import EducationIcon from '../../assets/expense icons/tdesign_education-filled.svg';

const AddCategoryModal = ({ isOpen, onClose, onAddCategory, transactionType }) => {
  const [categoryName, setCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('GcashIcon');
  const [selectedIconSrc, setSelectedIconSrc] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#9B59B6');
  const [userEmail, setUserEmail] = useState('');
  const [showIconCatalog, setShowIconCatalog] = useState(false);
  
  const categoryType = transactionType === 'Income' ? 'Income' : 'Expense';
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserEmail(user.email || '');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);
  useEffect(() => {
    if (transactionType === 'Income') {
      setSelectedIcon('GcashIcon');
    } else {
      setSelectedIcon('ShoppingBagIcon');
    }
  }, [transactionType]);

  if (!isOpen) return null;

  const incomeIcons = [
    { name: 'GcashIcon', src: GcashIcon, alt: 'Gcash' },
    { name: 'BankIcon', src: BankIcon, alt: 'Bank' },
    { name: 'BuildingIcon', src: BuildingIcon, alt: 'Building' },
    { name: 'FoodIcon', src: FoodIcon, alt: 'Food' },
    { name: 'CouponIcon', src: CouponIcon, alt: 'Coupon' },
    { name: 'MechanicIcon', src: MechanicIcon, alt: 'Mechanic' },
    { name: 'CreditCardIcon', src: CreditCardIcon, alt: 'Credit Card' },
    { name: 'WorkIcon', src: WorkIcon, alt: 'Work' },
    { name: 'AnalyticsIcon', src: AnalyticsIcon, alt: 'Analytics' },
    { name: 'MoneyExchangeIcon', src: MoneyExchangeIcon, alt: 'Money Exchange' },
    { name: 'GroupIcon', src: GroupIcon, alt: 'Group' },
    { name: 'VectorIcon', src: VectorIcon, alt: 'Vector' },
    { name: 'OldManIcon', src: OldManIcon, alt: 'Person' },
    { name: 'MoneyExchange2Icon', src: MoneyExchange2Icon, alt: 'Money Exchange 2' },
    { name: 'ElectricBoltIcon', src: ElectricBoltIcon, alt: 'Electric Bolt' },
    { name: 'WorkMaintenanceIcon', src: WorkMaintenanceIcon, alt: 'Maintenance Work' },
    { name: 'CreditCard2Icon', src: CreditCard2Icon, alt: 'Credit Card 2' },
  ];

  const expenseIcons = [
    { name: 'ShoppingBagIcon', src: ShoppingBagIcon, alt: 'Shopping Bag' },
    { name: 'PhoneIcon', src: PhoneIcon, alt: 'Phone' },
    { name: 'DressIcon', src: DressIcon, alt: 'Dress' },
    { name: 'ShoesIcon', src: ShoesIcon, alt: 'Shoes' },
    { name: 'ShoppingIcon', src: ShoppingIcon, alt: 'Shopping' },
    { name: 'BeerIcon', src: BeerIcon, alt: 'Beer' },
    { name: 'CarIcon', src: CarIcon, alt: 'Car' },
    { name: 'CookingIcon', src: CookingIcon, alt: 'Cooking' },
    { name: 'ElectricIcon', src: ElectricIcon, alt: 'Electric' },
    { name: 'TravelIcon', src: TravelIcon, alt: 'Travel' },
    { name: 'LaundryIcon', src: LaundryIcon, alt: 'Laundry' },
    { name: 'GameIcon', src: GameIcon, alt: 'Game' },
    { name: 'MedicalIcon', src: MedicalIcon, alt: 'Medical' },
    { name: 'PetIcon', src: PetIcon, alt: 'Pet' },
    { name: 'GiftIcon', src: GiftIcon, alt: 'Gift' },
    { name: 'EducationIcon', src: EducationIcon, alt: 'Education' },
  ];

  const availableIcons = categoryType === 'Income' ? incomeIcons : expenseIcons;

  const availableColors = [
    '#9B59B6',
    '#F39C12',
    '#F1C40F',
    '#E91E63',
    '#3498DB'
  ];

  const handleIconSelect = (iconData) => {
    setSelectedIcon(iconData.name);
    setSelectedIconSrc(iconData.src);
  };

  const handleSubmit = () => {
    if (!categoryName.trim() || !userEmail) return;

    const newCategory = {
      name: categoryName.trim(),
      type: categoryType,
      icon: selectedIcon,
      iconSrc: selectedIconSrc,
      bgColor: selectedColor,
      textColor: 'text-white',
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    const storageKey = `customCategories_${userEmail}`;
    const existingCategories = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedCategories = [...existingCategories, newCategory];
    localStorage.setItem(storageKey, JSON.stringify(updatedCategories));

    onAddCategory(newCategory);
    setCategoryName('');
    setSelectedIconSrc(null);
    if (transactionType === 'Income') {
      setSelectedIcon('GcashIcon');
    } else {
      setSelectedIcon('ShoppingBagIcon');
    }
    setSelectedColor('#9B59B6');
    
    onClose();
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-green-500 to-green-400 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Add New Category</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1"
            >
              <FaTimes className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Gift"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaTimes size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Icons:
            </label>
            
            {selectedIconSrc && (
              <div className="mb-3 p-3 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                    <img 
                      src={selectedIconSrc} 
                      alt={selectedIcon}
                      className="w-7 h-7"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Selected from Catalog</p>
                    <p className="text-xs text-gray-500">{selectedIcon}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIconSrc(null);
                      setSelectedIcon(categoryType === 'Income' ? 'GcashIcon' : 'ShoppingBagIcon');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
              {availableIcons.map((iconOption) => (
                <button
                  key={iconOption.name}
                  type="button"
                  onClick={() => {
                    setSelectedIcon(iconOption.name);
                    setSelectedIconSrc(null);
                  }}
                  className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all ${
                    selectedIcon === iconOption.name && !selectedIconSrc
                      ? 'bg-green-600'
                      : 'bg-green-400 hover:bg-green-500'
                  }`}
                >
                  <img 
                    src={iconOption.src} 
                    alt={iconOption.alt}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowIconCatalog(true)}
                className="w-full aspect-square rounded-lg bg-gray-200 text-gray-400 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <FaPlus className="text-lg sm:text-xl" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Colors:
            </label>
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
              {availableColors.map((color, index) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg transition-all flex-shrink-0 ${
                      isSelected
                        ? 'ring-2 ring-gray-400 ring-offset-2'
                        : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'
                    }`}
                    style={{ backgroundColor: color }}
                    title={`Select ${color}`}
                  />
                );
              })}
              <div className="relative flex-shrink-0">
                <label 
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    availableColors.includes(selectedColor) 
                      ? 'bg-gray-300 text-gray-500 hover:bg-gray-400' 
                      : 'text-white hover:opacity-80'
                  }`}
                  style={!availableColors.includes(selectedColor) ? { backgroundColor: selectedColor } : {}}
                  title="Custom color picker"
                >
                  <FaPlus className="text-sm sm:text-base" />
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!categoryName.trim()}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      
      <TransactionIconCatalogModal
        isOpen={showIconCatalog}
        onClose={() => setShowIconCatalog(false)}
        onSelectIcon={handleIconSelect}
        currentIcon={selectedIcon}
      />
    </div>
  );
};

export default AddCategoryModal;
