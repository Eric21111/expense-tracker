import { FaWallet, FaMobileAlt, FaPiggyBank, FaCreditCard, FaMoneyBill, FaUniversity, FaPaypal } from 'react-icons/fa';
import { SiGooglepay } from 'react-icons/si';
import { MdAccountBalance, MdSavings, MdTrendingUp } from 'react-icons/md';
import { BiCoin, BiMoney } from 'react-icons/bi';
import { BsCurrencyExchange, BsCurrencyDollar } from 'react-icons/bs';

export const iconMap = {
  'FaWallet': FaWallet,
  'FaMobileAlt': FaMobileAlt,
  'FaPiggyBank': FaPiggyBank,
  'FaCreditCard': FaCreditCard,
  'FaMoneyBill': FaMoneyBill,
  'BiMoney': BiMoney,
  'MdTrendingUp': MdTrendingUp,
  'MdAccountBalance': MdAccountBalance,
  'MdSavings': MdSavings,
  'FaPaypal': FaPaypal,
  'SiGooglepay': SiGooglepay,
  'BsCurrencyDollar': BsCurrencyDollar,
  'FaUniversity': FaUniversity,
  'BsCurrencyExchange': BsCurrencyExchange,
  'BiCoin': BiCoin,
  'wallet': FaWallet
};

export const getIconComponent = (iconName) => {
  return iconMap[iconName] || FaWallet;
};
