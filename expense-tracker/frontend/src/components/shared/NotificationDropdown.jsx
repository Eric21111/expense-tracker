import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaCheckCircle, FaTrash, FaCog } from 'react-icons/fa';
import {
  getStoredNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
  getUnreadNotificationCount,
  dismissAlert
} from '../../services/notificationService';

const NotificationDropdown = ({ userEmail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [expenseLimitEnabled, setExpenseLimitEnabled] = useState(true);
  const dropdownRef = useRef(null);

  const checkExpenseLimitSetting = () => {
    try {
      let email = userEmail;

      if (!email) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          email = user.email;
        } else {
          email = localStorage.getItem('userEmail');
        }
      }

      if (email) {
        const settings = localStorage.getItem(`notificationSettings_${email}`);
        if (settings) {
          const parsedSettings = JSON.parse(settings);
          return parsedSettings.expenseLimit !== false;
        }
      }
      return true;
    } catch (error) {
      console.error('Error checking expense limit setting:', error);
      return true;
    }
  };

  const loadNotifications = async () => {
    const storedNotifications = await getStoredNotifications(userEmail);
    setNotifications(storedNotifications);
    const count = await getUnreadNotificationCount(userEmail);
    setUnreadCount(count);
    setExpenseLimitEnabled(checkExpenseLimitSetting());
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    
    const handleNotificationsUpdate = () => {
      console.log('🔔 Notifications update event received - refreshing...');
      loadNotifications();
    };
    
    window.addEventListener('notificationsUpdated', handleNotificationsUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('notificationsUpdated', handleNotificationsUpdate);
    };
  }, [userEmail]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notificationId) => {
    await markNotificationAsRead(notificationId, userEmail);
    loadNotifications();
  };

  const handleDismissNotification = async (notification) => {
    if (notification.category && notification.type && notification.percentage) {
      dismissAlert(notification.category, notification.type, notification.percentage);
    }
    await markNotificationAsRead(notification._id || notification.id, userEmail);
    loadNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead(userEmail);
    loadNotifications();
  };

  const handleClearAll = async () => {
    const currentNotifications = await getStoredNotifications(userEmail);
    currentNotifications.forEach(notification => {
      if (notification.category && notification.type && notification.percentage) {
        dismissAlert(notification.category, notification.type, notification.percentage);
      }
    });

    await clearAllNotifications(userEmail);
    loadNotifications();
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'danger': return '🚨';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      default: return '📬';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'danger': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-orange-500 bg-orange-50';
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  if (!expenseLimitEnabled) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition"
      >
        <FaBell className="text-gray-700 text-base sm:text-lg" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed sm:absolute right-0 sm:right-0 top-16 sm:top-12 left-0 sm:left-auto w-full sm:w-96 bg-white rounded-none sm:rounded-lg shadow-lg border-t sm:border border-gray-200 z-50 max-h-[calc(100vh-4rem)] sm:max-h-96 overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 flex items-center gap-2">
                <FaBell className="text-green-600 text-sm sm:text-base" />
                Budget Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 sm:py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>

          {notifications.length > 0 && (
            <div className="p-2 sm:p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between gap-2">
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1 sm:gap-2 text-xs text-blue-600 hover:text-blue-700 transition"
                >
                  <FaCheckCircle className="text-xs sm:text-sm" />
                  <span className="hidden sm:inline">Mark all read</span>
                  <span className="sm:hidden">Mark all</span>
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1 sm:gap-2 text-xs text-red-600 hover:text-red-700 transition"
                >
                  <FaTrash className="text-xs sm:text-sm" />
                  Clear all
                </button>
              </div>
            </div>
          )}

          <div className="max-h-[calc(100vh-16rem)] sm:max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 sm:p-6 text-center text-gray-500">
                <FaBell className="mx-auto mb-2 text-gray-300 text-xl sm:text-2xl" />
                <p className="text-xs sm:text-sm">No notifications yet</p>
                <p className="text-xs text-gray-400">Budget alerts will appear here</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id || notification.id}
                  onClick={() => handleDismissNotification(notification)}
                  className={`p-3 sm:p-4 border-l-4 cursor-pointer hover:bg-gray-50 transition ${getNotificationColor(notification.type)
                    } ${!notification.read ? 'font-medium' : 'opacity-75'}`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-base sm:text-lg flex-shrink-0 mt-0.5 sm:mt-1">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                        {notification.message}
                      </p>
                      {notification.category && (
                        <div className="mt-1.5 sm:mt-2 flex items-center justify-between gap-2">
                          <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-0.5 sm:py-1 rounded truncate">
                            {notification.category}
                          </span>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                      )}
                      {!notification.read && (
                        <div className="mt-1">
                          <span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 sm:p-3 bg-gray-50 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Manage notification settings in your account preferences
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
