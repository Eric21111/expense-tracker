import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import NotificationDropdown from "./NotificationDropdown";
import { processAndShowAlerts } from "../../services/notificationService";
import { useSidebar } from "../../contexts/SidebarContext";

const Header2 = ({ username, title }) => {
  const [userEmail, setUserEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [photoError, setPhotoError] = useState(false);
  const { setIsMobileMenuOpen } = useSidebar();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserEmail(user.email || '');
        setProfilePhoto(user.photoURL || user.profilePhoto || user.picture || '');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  
  useEffect(() => {
    if (userEmail) {
    
      processAndShowAlerts(userEmail);
      
      
      const interval = setInterval(() => {
        processAndShowAlerts(userEmail);
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [userEmail]);

  return (
    <header className="bg-gray-100 shadow-sm px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
       
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <HiMenuAlt2 className="text-2xl text-gray-700" />
        </button>
     
        <h1 className="text-xl sm:text-2xl lg:text-[40px] font-bold text-gray-800 tracking-tight">
          {title || "Page Title"} 
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <NotificationDropdown userEmail={userEmail} />

        <button
          className="flex items-center gap-1 sm:gap-3 bg-white px-10 sm:px-3 py-2 rounded-lg shadow-md hover:bg-gray-50 transition w-55"
          style={{ borderRadius: "30px" }}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {profilePhoto && !photoError ? (
              <img 
                src={profilePhoto} 
                alt={username || 'Profile'}
                className="w-full h-full object-cover"
                onError={() => setPhotoError(true)}
              />
            ) : (
              <FaUser className="text-gray-600 text-sm sm:text-base" />
            )}
          </div>
          <div className="hidden sm:flex flex-col items-start flex-1">
            <span className="text-sm font-bold text-gray-800 leading-tight">
              {username}
            </span>
            <span className="text-xs text-gray-600 leading-tight">
              Account
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header2;