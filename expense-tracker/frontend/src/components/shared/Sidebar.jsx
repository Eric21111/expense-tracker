import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HiOutlineSquares2X2,
  HiOutlineCurrencyDollar,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { IoRibbon, IoLogOut, IoSettings } from "react-icons/io5";
import { FiArchive } from "react-icons/fi";
import Logo from "../../assets/logo.png";
import { useSidebar } from "../../contexts/SidebarContext";
import LogoutModal from "../LogoutModal";
import { getAuth, signOut } from "firebase/auth";
import app from "../../firebaseConfig";
import Transaction from "../../assets/sidebar icons/transaction.svg";
import Budget from "../../assets/sidebar icons/budget.svg";
import Dashboard from "../../assets/sidebar icons/dashboard.svg";
import Accounts from "../../assets/sidebar icons/accounts.svg";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isExpanded, setIsExpanded, isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  React.useEffect(() => {
    setIsExpanded(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname, setIsExpanded, setIsMobileMenuOpen]);

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
      icon: Dashboard,
      path: "/dashboard",
    },
    {
      name: "Transaction",
      icon: Transaction,
      path: "/transaction",
    },
    {
      name: "Budget",
      icon: Budget,
      path: "/budget",
    },
    {
      name: "Archive",
      icon: FiArchive,
      path: "/archive",
    },
    {
      name: "Rewards",
      icon: IoRibbon,
      path: "/rewards",
    },
    {
      name: "Accounts",
      icon: Accounts,
      path: "/accounts",
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
      const auth = getAuth(app);
      if (auth.currentUser) {
        await signOut(auth);
      }

      localStorage.removeItem("user");

      window.dispatchEvent(new Event("userStorageChange"));

      setShowLogoutModal(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);

      localStorage.removeItem("user");
      window.dispatchEvent(new Event("userStorageChange"));
      setShowLogoutModal(false);
      navigate("/login");
    }
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-screen bg-white shadow-lg transition-all duration-300 ease-in-out z-40 cursor-pointer ${isExpanded ? "w-64" : "w-20"
          } hidden lg:block`}
        onClick={toggleSidebar}
        style={{
          borderRadius: "0 20px 20px 0",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          className={`flex items-center ${isExpanded ? "justify-start pl-4" : "justify-center"
            } pt-6 pb-8 transition-all duration-300`}
        >
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

        <nav id="sidebar-nav" className="flex flex-col gap-2 px-3 mt-4">
          {menuItems.map((item) => {
            const active = isActive(item.path);

            const isSvgPath = typeof item.icon === "string";
            const IconComponent = !isSvgPath ? item.icon : null;

            return (
              <button
                key={item.name}
                id={`sidebar-item-${item.name.toLowerCase()}`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(item.path);
                }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${active
                  ? "bg-gradient-to-b from-green-400 to-green-600 text-white shadow-md"
                  : "text-black hover:bg-gray-100"
                  } ${isExpanded ? "justify-start" : "justify-center"}`}
              >
                {isSvgPath ? (
                  <img
                    src={item.icon}
                    alt={item.name}

                    className={`w-5 h-5 flex-shrink-0 ${active ? "filter brightness-0 invert" : ""
                      }`}
                  />
                ) : (
                  <IconComponent
                    className={`text-xl flex-shrink-0 ${active ? "text-white" : "text-black"
                      }`}
                  />
                )}
                {isExpanded && (
                  <span
                    className={`font-medium transition-opacity duration-300 whitespace-nowrap ${active ? "text-white" : "text-black"
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
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-black hover:bg-gray-100 w-full ${isExpanded ? "justify-start" : "justify-center"
              }`}
          >
            <IoLogOut className="text-xl text-black flex-shrink-0" />
            {isExpanded && (
              <span className="font-medium transition-opacity duration-300 text-black whitespace-nowKrap">
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

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            WebkitBackgroundColor: 'rgba(0, 0, 0, 0.1)'
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`lg:hidden fixed left-0 top-0 h-screen bg-white shadow-lg transition-transform duration-300 ease-in-out z-50 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } w-64`}
        style={{
          borderRadius: "0 20px 20px 0",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex items-center justify-start pl-4 pt-6 pb-8">
          <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
            <img
              src={Logo}
              alt="TrackIT Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="ml-3 text-xl font-bold text-green-600">
            TrackIT
          </span>
        </div>

        <nav className="flex flex-col gap-2 px-3 mt-4">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            const isSvgPath = typeof item.icon === "string";
            const IconComponent = !isSvgPath ? item.icon : null;

            return (
              <button
                key={item.name}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${active
                  ? "bg-gradient-to-b from-green-400 to-green-600 text-white shadow-md"
                  : "text-black hover:bg-gray-100"
                  } justify-start`}
              >
                {isSvgPath ? (
                  <img
                    src={item.icon}
                    alt={item.name}
                    className={`w-5 h-5 flex-shrink-0 ${active ? "filter brightness-0 invert" : ""
                      }`}
                  />
                ) : (
                  <IconComponent
                    className={`text-xl flex-shrink-0 ${active ? "text-white" : "text-black"
                      }`}
                  />
                )}
                <span
                  className={`font-medium ${active ? "text-white" : "text-black"
                    }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-0 right-0 px-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
            className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-black hover:bg-gray-100 w-full justify-start"
          >
            <IoLogOut className="text-xl text-black flex-shrink-0" />
            <span className="font-medium text-black">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;