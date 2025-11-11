import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useSidebar } from '../contexts/SidebarContext';
import aiIcon from '../assets/budget/ai.svg';
import alertIcon from '../assets/budget/alert.svg';
import coinsIcon from '../assets/budget/coins.svg';
import moneyIcon from '../assets/budget/money.svg';
import progressIcon from '../assets/budget/progress.svg';
import shoppingIcon from '../assets/budget/pig.svg';
import groceryIcon from '../assets/budget/grocery.svg';
import transportationIcon from '../assets/budget/transportation.svg';
import Sidebar from '../components/shared/Sidebar';
import Header2 from '../components/shared/Header2';


const Budget = () => {
  const { isExpanded } = useSidebar();


  return (
    <div className="flex min-h-screen bg-[#F5F5F5] font-poppins">
      <Sidebar />
      <main
        className={`flex-1 bg-gray-50 transition-all duration-300 ease-in-out ${
          isExpanded ? "ml-64" : "ml-20"
        }`}
      >
        <Header2 username="User" title="Budget" />
       
        <div className="w-full max-w-[1400px] px-12 py-8 mx-auto">
   
   
      <div className="flex flex-col lg:flex-row items-start gap-6 mb-9">
         
       
        <div className="flex flex-col lg:flex-row flex-1 gap-6 w-full">
         
       
          <div className="flex-1 bg-white p-6 px-7 rounded-[20px] shadow-md relative overflow-hidden flex flex-col justify-center h-[180px] text-left">
            <h2 className="text-[30px] font-bold text-gray-900 mb-2 tracking-tight">
              PHP 10000
            </h2>
            <p className="text-sm font-semibold mb-1 leading-tight">
              Total Budgeted
            </p>
            <div className="absolute top-6 right-5 w-14 h-14 opacity-90">
              <img src={shoppingIcon} alt="Wallet" className="w-full h-full object-contain" />
            </div>
          </div>


         
          <div className="flex-1 bg-white p-6 px-7 rounded-[20px] shadow-md relative overflow-hidden flex flex-col justify-center h-[180px] text-left">
            <h2 className="text-[30px] font-bold text-gray-900 mb-2 tracking-tight">
              PHP 6000
            </h2>
            <p className="text-sm font-semibold mb-1 leading-tight text-amber-500">
              Total Expenses
            </p>
            <span className="text-xs text-gray-400 block">
              Spent so far this month
            </span>
            <div className="absolute top-6 right-5 w-14 h-14 opacity-90">
              <img src={moneyIcon} alt="Expenses" className="w-full h-full object-contain" />
            </div>
          </div>


       
          <div className="flex-1 bg-white p-6 px-7 rounded-[20px] shadow-md relative overflow-hidden flex flex-col justify-center h-[180px] text-left">
            <h2 className="text-[30px] font-bold text-gray-900 mb-2 tracking-tight">
              PHP 4000
            </h2>
            <p className="text-sm font-semibold mb-1 leading-tight text-blue-500">
              Remaining
            </p>
            <span className="text-xs text-gray-400 block">
              Remaining funds for budget
            </span>
            <div className="absolute top-6 right-5 w-14 h-14 opacity-90">
              <img src={coinsIcon} alt="Coins" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>


   
        <div className="w-full lg:w-[420px] flex-shrink-0 bg-gradient-to-br from-[#144221] via-[#34A853] to-[#CCEFCC] p-7 rounded-[20px] shadow-md h-fit">
          <div className="flex items-center gap-2.5 mb-2">
            <img src={aiIcon} alt="Robot" className="w-6 h-6" />
            <h3 className="text-lg font-bold text-white">
              AI Insights
            </h3>
          </div>
          <p className="text-xs text-white mb-6 leading-relaxed">
            Personalized recommendations based on your spending patterns
          </p>


         
          <div className="bg-white p-4 px-[18px] rounded-[14px] mb-3 flex gap-3.5 items-start shadow-sm">
            <div className="flex-shrink-0">
              <img src={alertIcon} alt="Alert" className="w-10 h-10 rounded-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900 mb-1">
                Budget Alert
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                You're about to exceed your food budget by PHP 500 this month. Consider adjusting spending.
              </p>
            </div>
          </div>


          <div className="bg-white p-4 px-[18px] rounded-[14px] mb-3 flex gap-3.5 items-start shadow-sm">
            <div className="flex-shrink-0">
              <img src={progressIcon} alt="Idea" className="w-10 h-10 rounded-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900 mb-1">
                Great Progress!
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                You've saved PHP 200 on transportation compared to last month. Keep it up!
              </p>
            </div>
          </div>
        </div>
      </div>


   
      <div className="mt-8">
        <h2 className="text-[20px] font-bold mb-6 translate-y-[-220px]" style={{ color: '#34A853' }}>
          Budget Overview
        </h2>


       
        <div className="space-y-6 w-210 translate-y-[-240px]">
         
         
          <div className="bg-white p-6 rounded-[20px] shadow-md">
            <div className="flex items-start gap-4">
             
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                <img src={groceryIcon} alt="Grocery" className="w-8 h-8" />
              </div>
             
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Grocery</h3>
                    <p className="text-xs text-gray-500">11/12/25</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-600">
                      Near Limit
                    </span>
                    <button className="text-gray-400 hover:text-blue-500 transition-colors">
                      <FiEdit2 size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
               
               
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Budget Limit</p>
                    <p className="text-base font-bold text-gray-900">PHP 5000</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Spent</p>
                    <p className="text-base font-bold text-gray-900">PHP 4200</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Remaining</p>
                    <p className="text-base font-bold text-amber-500">PHP 800</p>
                  </div>
                </div>
               
               
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" style={{ width: '84%' }}></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-600">84%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


         
          <div className="bg-white p-6 rounded-[20px] shadow-md">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <img src={transportationIcon} alt="Transportation" className="w-8 h-8" />
              </div>
             
     
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Transportation</h3>
                    <p className="text-xs text-gray-500">11/12/25</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                      Over Budget
                    </span>
                    <button className="text-gray-400 hover:text-blue-500 transition-colors">
                      <FiEdit2 size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
               
               
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Budget Limit</p>
                    <p className="text-base font-bold text-gray-900">PHP 5000</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Spent</p>
                    <p className="text-base font-bold text-gray-900">PHP 4200</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Remaining</p>
                    <p className="text-base font-bold text-red-500">-PHP 800</p>
                  </div>
                </div>
               
               
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-600">84%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


         
          <div className="bg-white p-6 rounded-[20px] shadow-md">
            <div className="flex items-start gap-4">
             
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                <img src={shoppingIcon} alt="Shopping" className="w-8 h-8" />
              </div>
             
 
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Shopping</h3>
                    <p className="text-xs text-gray-500">11/12/25</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                      On Track
                    </span>
                    <button className="text-gray-400 hover:text-blue-500 transition-colors">
                      <FiEdit2 size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
       
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Budget Limit</p>
                    <p className="text-base font-bold text-gray-900">PHP 5000</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Spent</p>
                    <p className="text-base font-bold text-gray-900">PHP 4200</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Remaining</p>
                    <p className="text-base font-bold text-green-500">PHP 1200</p>
                  </div>
                </div>
               
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: '84%' }}></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-600">84%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
        </div>
      </main>
    </div>
  );
};


export default Budget;