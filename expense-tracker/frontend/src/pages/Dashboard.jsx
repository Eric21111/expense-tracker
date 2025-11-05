import React, { useState, useEffect } from "react";
import Sidebar from "../components/shared/Sidebar";
import { useSidebar } from "../contexts/SidebarContext";
import {
  FaSearch,
  FaBell,
  FaChevronDown,
  FaShoppingCart,
  FaHamburger,
  FaCar,
  FaBolt,
  FaShoppingBag,
  FaPiggyBank,
  FaLightbulb,
  FaExclamationTriangle,
  FaChartLine,
  FaUser,
} from "react-icons/fa";
import { IoChevronBack, IoChevronForward, IoRibbon, IoAdd } from "react-icons/io5";
import ManIllustration from "../assets/man.svg";

const Dashboard = () => {
  const [username, setUsername] = useState("User");
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1));
  const { isExpanded } = useSidebar(); 

  useEffect(() => {
   
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUsername(user.name || user.displayName || "User");
      } catch (e) {
      
      }
    }
  }, []);

  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    
    
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const changeMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const calendarDays = getDaysInMonth(currentDate);
  const highlightedDays = [7, 8, 9, 10, 11];

  return (
    <div className="flex min-h-screen bg-[#F5F5F5] font-poppins">
      <Sidebar />
      <main className={`flex-1 bg-[#F5F5F5] transition-all duration-300 ease-in-out ${isExpanded ? "ml-64" : "ml-20"}`}>
     
        <header className="bg-gray-100 shadow-sm px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-0 flex-1 max-w-md">
          
           <h1 className="text-[40px] font-bold text-gray-800 tracking-tight">Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
      
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition">
              <FaBell className="text-gray-700 text-lg" />
            </button>
            
           
            <button className="flex w-70 items-center gap-3 bg-white px-3 py-2 rounded-lg shadow-md hover:bg-gray-50 transition"  style={{ borderRadius: '30px'}}>
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <FaUser className="text-gray-600" />
              </div>
              <div className="flex flex-col items-start flex-1">
                <span className="text-sm font-bold text-gray-800 leading-tight">{username}</span>
                <span className="text-xs text-gray-600 leading-tight">Account</span>
              </div>
              <FaChevronDown className="text-white text-base flex-shrink-0 ml-2" style={{ backgroundColor: 'black', borderRadius: '30px', padding: '5px', width: '25px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
            </button>
          </div>
        </header>

        <div className="p-8">
        
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
           
            <div className="lg:col-span-2 space-y-6">
           
              <div 
                className="p-6 md:p-8 flex items-center justify-between shadow-lg h-[180px] relative"
                style={{
                  background: 'linear-gradient(to right, #34A853, #CCEFCC)',
                  borderRadius: '30px'
                }}
              >
                <div className="text-white z-10 flex-1">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Welcome Back, {username}</h1>
                  <p className="text-white/90 text-sm md:text-base lg:text-lg">Here's your financial overview for today.</p>
                </div>
                <div className="hidden lg:block absolute right-0 bottom-0 z-0">
                  <img 
                    src={ManIllustration} 
                    alt="Man with laptop on arrow" 
                    className="h-[270px] w-auto object-contain"
                    style={{ 
                      transform: 'translate(-60px, 40px)',
                      maxHeight: '270px'
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 shadow-md relative overflow-hidden" style={{ borderRadius: '30px' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">PHP 7,500</h3>
                  <p className="text-base font-bold text-green-600 ">Total Balance</p>
                  <p className="text-xs text-gray-500 mt-1">Remaining funds this month.</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center absolute top-4 right-4">
                  <span className="text-green-600 text-2xl font-bold">₱</span>
                </div>
              </div>
            </div>

          
            <div className="bg-white p-6 shadow-md relative overflow-hidden" style={{ borderRadius: '30px' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">PHP 11,000</h3>
                  <p className="text-base font-bold text-green-600">Total Expenses</p>
                  <p className="text-xs text-gray-500 mt-1">Spent so far this month.</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center absolute top-4 right-4">
                  <FaPiggyBank className="text-green-600 text-2xl" />
                </div>
              </div>
            </div>


            <div className="bg-white p-6 shadow-md relative overflow-hidden" style={{ borderRadius: '30px' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">PHP 1,500</h3>
                  <p className="text-base font-bold text-green-600">Total Savings</p>
                  <p className="text-xs text-gray-500 mt-1">Saved amount this month.</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center absolute top-4 right-4">
                  <FaPiggyBank className="text-green-600 text-2xl" />
                </div>
              </div>
            </div>
            </div>
            </div>

         
            <div className="bg-white p-6 shadow-md flex flex-col justify-between h-full" style={{ borderRadius: '30px' }}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded transition">
                    <IoChevronBack className="text-gray-600" />
                  </button>
                  <h3 className="text-lg font-bold text-green-600">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                  <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded transition">
                    <IoChevronForward className="text-gray-600" />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-600 py-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`text-center text-sm py-2 rounded transition ${
                        day === null
                          ? ""
                          : highlightedDays.includes(day)
                          ? "bg-green-500 text-white font-semibold"
                          : "hover:bg-gray-100 cursor-pointer"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[2fr_1.2fr_0.8fr] gap-6 mb-6 items-stretch">

            <div className="bg-white p-6 shadow-md flex flex-col" style={{ borderRadius: '30px' }}>
              <h2 className="text-xl font-bold text-green-600 mb-6">Expense Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-6">
             
                <div className="relative" style={{ height: '240px' }}>
                  
                  <div className="absolute left-0 top-0 w-10" style={{ height: 'calc(100% - 24px)' }}>
                    <div className="h-full flex flex-col justify-between">
                      {[5000, 4000, 3000, 2000, 1000, 0].map((value) => (
                        <div key={value} className="flex items-center justify-end pr-2">
                          <span className="text-xs text-gray-500 font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  
                  <div className="ml-12 relative" style={{ height: 'calc(100% - 24px)' }}>
                   
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[0, 1000, 2000, 3000, 4000, 5000].map((value) => (
                        <div
                          key={value}
                          className="w-full border-t border-gray-200"
                        />
                      ))}
                    </div>

                    <div className="relative h-full flex items-end justify-between gap-2">
                      {[
                        { name: "Food", value: 3700, color: "bg-green-400" },
                        { name: "Transport", value: 2900, color: "bg-green-600" },
                        { name: "Bills", value: 5000, color: "bg-green-400" },
                        { name: "Entertainment", value: 2100, color: "bg-green-600" },
                        { name: "Others", value: 2500, color: "bg-green-400" },
                      ].map((category) => (
                        <div key={category.name} className="flex-1 flex flex-col items-center justify-end h-full">
                      
                          <div
                            className={`w-full ${category.color} rounded-t-lg transition-all hover:opacity-90 cursor-pointer relative group`}
                            style={{
                              height: `${(category.value / 5000) * 100}%`,
                              minHeight: '8px',
                            }}
                          >
                           
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              PHP {category.value.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                 
                  <div className="ml-12 absolute bottom-0 left-0 right-0 flex justify-between gap-2" style={{ height: '24px' }}>
                    {[
                      { name: "Food" },
                      { name: "Transport" },
                      { name: "Bills" },
                      { name: "Entertainment" },
                      { name: "Others" },
                    ].map((category) => (
                      <div key={category.name} className="flex-1 text-center">
                        <span className="text-xs text-gray-600 font-medium">{category.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

      
                <div className="flex flex-col justify-center h-full">
                  <h3 className="text-xl font-bold text-green-600 mb-4">Top 3 Spending</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-800 font-medium">1.</span>
                        <p className="text-gray-800 font-medium">Bills</p>
                      </div>
                      <p className="text-gray-800 font-medium">PHP 5,000</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-800 font-medium">2.</span>
                        <p className="text-gray-800 font-medium">Food</p>
                      </div>
                      <p className="text-gray-800 font-medium">PHP 3,700</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-800 font-medium">3.</span>
                        <p className="text-gray-800 font-medium">Transport</p>
                      </div>
                      <p className="text-gray-800 font-medium">PHP 2,900</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          
            <div className="bg-white p-6 shadow-md flex flex-col" style={{ borderRadius: '30px' }}>
              <h2 className="text-xl font-bold mb-8 text-center" style={{ color: '#34A853' }}>Budget Progress</h2>
              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-full max-w-[260px] mx-auto">
                  <svg className="w-full" viewBox="0 0 200 110" style={{ height: '130px' }}>
                    
                    <path
                      d="M 20 90 A 80 80 0 0 1 180 90"
                      stroke="#C8E6C9"
                      strokeWidth="22"
                      fill="none"
                      strokeLinecap="round"
                    />
            
                    <path
                      d="M 20 90 A 80 80 0 0 1 180 90"
                      stroke="#34A853"
                      strokeWidth="22"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${Math.PI * 80 * 0.3} ${Math.PI * 80 * 0.7}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center" style={{ marginTop: '10px' }}>
                      <p className="font-bold mb-2" style={{ color: '#34A853', fontSize: '30px' }}>30%</p>
                      <p className="text-sm font-normal" style={{ color: '#424242' }}>of budget used</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

 
            <div className="p-3 flex flex-col justify-between shadow-lg"
              style={{
                borderRadius: '24px',
                background: 'linear-gradient(to bottom, #FFE082, #FFCCBC)'
              }}
            >
 
              <div className="mb-3">
                <h2 className="text-base font-semibold text-gray-800">Achievements</h2>
              </div>
              
           
              <div className="bg-white rounded-xl p-3 flex flex-col items-center flex-1 justify-between shadow-md">
                <div className="flex flex-col items-center flex-1 w-full">
               
                  <div className="relative mb-3">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-md"
                      style={{
                        background: 'linear-gradient(to bottom, #FFA726, #FFD54F)'
                      }}
                    >
                      <IoRibbon className="text-white text-3xl" />
                    </div>
                   
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold text-xs">3</span>
                    </div>
                  </div>
                  
                
                  <h3 className="text-base font-bold text-gray-800 mb-1.5 px-2.5 py-1 bg-white rounded-lg shadow-sm border border-gray-100">
                    Budget Master
                  </h3>
                  
               
                  <p className="text-xs text-gray-700 text-center leading-tight max-w-xs mb-3 bg-white px-2.5 py-1 rounded-lg">
                    Congratulations! You've stayed under budget for 3 consecutive months. Keep up the great work!
                  </p>
                </div>
                
            
                <button 
                  className="w-full text-white font-bold py-1.5 px-3 transition-all hover:shadow-xl hover:scale-105 text-xs"
                  style={{
                    background: 'linear-gradient(to right, #FF8A50, #FFB74D)',
                    borderRadius: '999px',
                    boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
                  }}
                >
                  LEVEL 3 ACHIEVED
                </button>
              </div>
            </div>
          </div>

    
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
           
            <div className="lg:col-span-2 bg-white p-6 shadow-md" style={{ borderRadius: '30px' }}>
              <h2 className="text-xl font-bold text-green-600 mb-6">Recent Expenses</h2>
              <div className="space-y-3">
                {[
                  { name: "Grocery", time: "Today", amount: 1000, icon: FaShoppingCart },
                  { name: "Food", time: "Yesterday", amount: 850, icon: FaHamburger },
                  { name: "Transport", time: "2 days ago", amount: 500, icon: FaCar },
                  { name: "Bills", time: "3 days ago", amount: 1500, icon: FaBolt },
                  { name: "Shopping", time: "4 days ago", amount: 1200, icon: FaShoppingBag },
                ].map((expense, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <expense.icon className="text-green-600 text-xl" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{expense.name}</p>
                        <p className="text-sm text-gray-500">{expense.time}</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-red-600">-PHP {expense.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

 
            <div className="bg-white p-6 shadow-md border-l-4 border-green-500" style={{ borderRadius: '30px' }}>
              <div className="flex items-center gap-2 mb-4">
                <FaLightbulb className="text-green-500 text-2xl" />
                <h2 className="text-xl font-bold text-green-600">AI Insights</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Personalized recommendations based on your spending patterns.
              </p>
              <div className="space-y-4 mb-4">
                 
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaExclamationTriangle className="text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm mb-1">Budget Alert</p>
                      <p className="text-xs text-gray-600">
                        You're on track to exceed your food budget by PHP 500 this month. Consider meal prepping.
                      </p>
                    </div>
                  </div>

                
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaChartLine className="text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm mb-1">Great Progress!</p>
                      <p className="text-xs text-gray-600">
                        You've saved PHP 200 on transportation compared to last month. Keep it up!
                      </p>
                    </div>
                  </div>

          
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaPiggyBank className="text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm mb-1">Savings Goal</p>
                      <p className="text-xs text-gray-600">
                        At this rate, you'll reach your PHP 5,000 savings goal in 3 months. Stay consistent!
                      </p>
                    </div>
                  </div>
                </div>
              <button className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2">
                <IoAdd className="text-xl" />
                Get More Insights
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
