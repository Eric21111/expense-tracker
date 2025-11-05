import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HiOutlineSquares2X2,
  HiOutlineCurrencyDollar,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { IoRibbon, IoLogOut, IoSettings } from "react-icons/io5";
import Logo from "../../assets/logo.png";
import { useSidebar } from "../../contexts/SidebarContext";
import LogoutModal from "../LogoutModal";
import { getAuth, signOut } from "firebase/auth";
import app from "../../firebaseConfig";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isExpanded, setIsExpanded } = useSidebar();
  const timeoutRef = React.useRef(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

 
  React.useEffect(() => {
    setIsExpanded(false);
  }, [location.pathname, setIsExpanded]);


  React.useEffect(() => {
    const handleUserStorageChange = () => {
    
      const user = localStorage.getItem("user");
      if (user) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("userStorageChange", handleUserStorageChange);
    
  
    handleUserStorageChange();

    return () => {
      window.removeEventListener("userStorageChange", handleUserStorageChange);
    };
  }, [setIsExpanded]);

  const menuItems = [
    {
      name: "Dashboard",
      icon: HiOutlineSquares2X2,
      path: "/dashboard",
    },
    {
      name: "Expenses",
      icon: HiOutlineCurrencyDollar,
      path: "/expenses",
    },
    {
      name: "Budget",
      icon: HiOutlineChartBar,
      path: "/budget",
    },
    {
      name: "Rewards",
      icon: IoRibbon,
      path: "/rewards",
    },
    {
      name: "Settings",
      icon: IoSettings,
      path: "/settings",
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      // Sign out from Firebase if user is logged in
      const auth = getAuth(app);
      if (auth.currentUser) {
        await signOut(auth);
      }
      
      // Remove user from localStorage
      localStorage.removeItem("user");
      
      // Dispatch custom event to notify components
      window.dispatchEvent(new Event("userStorageChange"));
      
      // Close modal and navigate to login
      setShowLogoutModal(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still logout even if Firebase signOut fails
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("userStorageChange"));
      setShowLogoutModal(false);
      navigate("/login");
    }
  };

  const handleMouseEnter = () => {

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
      timeoutRef.current = null;
    }, 100);
  };


  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white shadow-lg transition-all duration-300 ease-in-out z-50 ${
        isExpanded ? "w-64" : "w-20"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        borderRadius: "0 20px 20px 0",
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
      }}
    >
   
      <div className={`flex items-center ${isExpanded ? "justify-start pl-4" : "justify-center"} pt-6 pb-8 transition-all duration-300`}>
        <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
          <img 
            src={Logo} 
            alt="TrackIT Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        {isExpanded && (
          <span className="ml-3 text-xl font-bold text-green-600 transition-opacity duration-300 whitespace-nowrap">
            TrackIT
          </span>
        )}
      </div>

      <nav className="flex flex-col gap-2 px-3 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                active
                  ? "bg-gradient-to-b from-green-400 to-green-600 text-white shadow-md"
                  : "text-black hover:bg-gray-100"
              } ${isExpanded ? "justify-start" : "justify-center"}`}
            >
              <Icon className={`text-xl flex-shrink-0 ${active ? "text-white" : "text-black"}`} />
              {isExpanded && (
                <span
                  className={`font-medium transition-opacity duration-300 whitespace-nowrap ${
                    active ? "text-white" : "text-black"
                  }`}
                >
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </nav>

    
      <div className="absolute bottom-6 left-0 right-0 px-3">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-black hover:bg-gray-100 w-full ${
            isExpanded ? "justify-start" : "justify-center"
          }`}
        >
          <IoLogOut className="text-xl text-black flex-shrink-0" />
          {isExpanded && (
            <span className="font-medium transition-opacity duration-300 text-black whitespace-nowrap">
              Logout
            </span>
          )}
        </button>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </aside>
  );
};

export default Sidebar;

