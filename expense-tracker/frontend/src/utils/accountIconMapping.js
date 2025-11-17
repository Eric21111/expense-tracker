import { FaWallet, FaMobileAlt, FaPiggyBank, FaCreditCard } from 'react-icons/fa';

export const iconMap = {
  'FaWallet': FaWallet,
  'FaMobileAlt': FaMobileAlt,
  'FaPiggyBank': FaPiggyBank,
  'FaCreditCard': FaCreditCard,
  'FaMoneyBill': FaWallet,
  'BiMoney': FaWallet,
  'MdTrendingUp': FaWallet,
  'MdAccountBalance': FaWallet,
  'MdSavings': FaPiggyBank,
  'FaPaypal': FaWallet,
  'SiGooglepay': FaMobileAlt,
  'BsCurrencyDollar': FaWallet,
  'FaUniversity': FaWallet,
  'BsCurrencyExchange': FaWallet,
  'BiCoin': FaWallet
};

export const getIconComponent = (iconName) => {
  return iconMap[iconName] || FaWallet;
};
