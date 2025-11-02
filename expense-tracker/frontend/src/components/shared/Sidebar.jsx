import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HiOutlineSquares2X2,
  HiOutlineCurrencyDollar,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { IoRibbon, IoLogOut, IoSettings } from "react-icons/io5";
import Logo from "../../assets/logo.png";
import { useSidebar } from "../../contexts/SidebarContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isExpanded, setIsExpanded } = useSidebar();
  const timeoutRef = React.useRef(null);

  // Reset sidebar to collapsed state when component mounts, route changes, or user logs in
  React.useEffect(() => {
    setIsExpanded(false);
  }, [location.pathname, setIsExpanded]);

  // Also reset when user logs in (listening to storage changes)
  React.useEffect(() => {
    const handleUserStorageChange = () => {
      // Reset sidebar when user logs in (localStorage user is added)
      const user = localStorage.getItem("user");
      if (user) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("userStorageChange", handleUserStorageChange);
    
    // Also check on mount
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
    // Clear user data from localStorage
    localStorage.removeItem("user");
    
    // Dispatch custom event to notify App component
    window.dispatchEvent(new Event("userStorageChange"));
    
    // Navigate to login
    navigate("/login");
  };

  const handleMouseEnter = () => {
    // Clear any pending collapse timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    // Use a small delay to ensure the sidebar collapses even if there are child elements
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
      timeoutRef.current = null;
    }, 100);
  };

  // Cleanup timeout on unmount
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
    </aside>
  );
};

export default Sidebar;

