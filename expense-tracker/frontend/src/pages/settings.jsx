import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/shared/Sidebar";
import DeleteAccountModal from "../components/DeleteAccountModal";
import DeleteSuccessModal from "../components/DeleteSuccessModal";
import { getAuth, signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import app from "../firebaseConfig";
import { useSidebar } from "../contexts/SidebarContext";
import { useCurrency } from '../contexts/CurrencyContext';
import { clearAllUserData } from '../utils/userDataUtils';
import PasswordChangeVerificationModal from "../components/PasswordChangeVerificationModal";
import SuccessModal from "../components/transactions/SuccessModal";
import { HiMenuAlt2 } from "react-icons/hi";

const Settings = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    currency: "PHP",
    startMonth: "",
    monthlyLimit: "7500",
  });

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    photoURL: "",
    role: "User"
  });

  const [dashboardView, setDashboardView] = useState(() => {
    return localStorage.getItem("dashboardView") || "Monthly";
  });
  const [notifications, setNotifications] = useState({
    expenseLimit: true,
    budgetGoal: true,
    billReminders: false,
    weeklySummary: true,
    emailNotifications: false,
  });
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    general: ""
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [showPasswordSuccessModal, setShowPasswordSuccessModal] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [showUsernameSuccessModal, setShowUsernameSuccessModal] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);
  const [showPhotoSuccessModal, setShowPhotoSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { isExpanded, setIsMobileMenuOpen } = useSidebar();
  const { currency, updateCurrency } = useCurrency();

  const loadUserData = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserData({
          fullName: user.name || user.fullName || user.displayName || user.username || "User",
          email: user.email || "",
          photoURL: user.photoURL || "",
          role: user.role || "User"
        });
        
        setFormData(prev => ({
          ...prev,
          fullName: user.name || user.fullName || user.displayName || "",
          username: user.username || user.name || "",
          email: user.email || "",
          phone: user.phone || ""
        }));
      } catch (e) {
        console.error("Error loading user data:", e);
      }
    }
  };

  const loadNotificationSettings = () => {
    const storedUser = localStorage.getItem("user");
    let userEmail = localStorage.getItem('userEmail');
    
    if (!userEmail && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        userEmail = user.email;
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    
    if (userEmail) {
      const savedSettings = localStorage.getItem(`notificationSettings_${userEmail}`);
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setNotifications(parsedSettings);
        } catch (e) {
          console.error("Error loading notification settings:", e);
        }
      }
    }
  };

  useEffect(() => {
    loadUserData();
    loadNotificationSettings();

    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const isGoogle = user.providerData.some(
          (provider) => provider.providerId === "google.com"
        );
        setIsGoogleUser(isGoogle);
        
        setUserData(prev => ({
          ...prev,
          fullName: user.displayName || prev.fullName,
          email: user.email || prev.email,
          photoURL: user.photoURL || prev.photoURL
        }));
      } else {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setIsGoogleUser(userData.provider === 'google');
          } catch (e) {
            setIsGoogleUser(false);
          }
        } else {
          setIsGoogleUser(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (name === 'currency') {
      updateCurrency(value);
    }
  };

  const handleNotificationToggle = (type) => {
    setNotifications((prev) => {
      const newNotifications = {
        ...prev,
        [type]: !prev[type],
      };
      
      const userEmail = localStorage.getItem('userEmail') || userData.email;
      if (userEmail) {
        localStorage.setItem(`notificationSettings_${userEmail}`, JSON.stringify(newNotifications));
        
        if (type === 'expenseLimit' && !newNotifications.expenseLimit) {
          localStorage.removeItem(`budgetAlerts_${userEmail}`);
          localStorage.removeItem(`dismissedAlerts_${userEmail}`);
          localStorage.removeItem('budget_notifications');
        }
      }
      
      return newNotifications;
    });
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordErrors(prev => ({
      ...prev,
      [name]: "",
      general: ""
    }));
  };

  const validatePassword = (password) => {
    const requirements = {
      minLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    return {
      isValid: Object.values(requirements).every(req => req),
      requirements
    };
  };

  const handleSendVerificationCode = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        console.error("User information not found. Please login again.");
        navigate("/login");
        return;
      }
      
      const user = JSON.parse(storedUser);
      setVerificationEmail(user.email);
      
      const res = await axios.post("http://localhost:5000/users/send-password-change-code", {
        email: user.email
      });
      
      if (res.data.debugCode) {
        console.log("Verification code for testing:", res.data.debugCode);
      }
      
      setShowVerificationModal(true);
    } catch (error) {
      console.error("Error sending verification code:", error);
      console.error("Failed to send verification code:", error);
    }
  };

  const handleVerificationSuccess = () => {
    setIsEmailVerified(true);
    setShowVerificationModal(false);
  };

  const handleChangePassword = async () => {
    setPasswordErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      general: ""
    });

    if (isGoogleUser) {
      setPasswordErrors(prev => ({
        ...prev,
        general: "Password change is not available for Google accounts. Google users manage their passwords through Google."
      }));
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordErrors(prev => ({
        ...prev,
        newPassword: "Password must be at least 6 characters"
      }));
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrors(prev => ({
        ...prev,
        confirmPassword: "Passwords do not match"
      }));
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordErrors(prev => ({
        ...prev,
        newPassword: "New password must be different from current password"
      }));
      return;
    }

    setIsUpdatingPassword(true);
    
    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      
      if (!user) {
        if (!isEmailVerified) {
          setPasswordErrors(prev => ({
            ...prev,
            general: "Please verify your email before changing your password."
          }));
          handleSendVerificationCode();
          return;
        }
        
        try {
          const storedUser = localStorage.getItem("user");
          const userData = JSON.parse(storedUser);
          
          const res = await axios.post("http://localhost:5000/users/change-password", {
            email: userData.email,
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
          });
          
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
          });
          
          setIsEmailVerified(false);
          setShowPasswordSuccessModal(true);
          return;
        } catch (error) {
          console.error("Password update error:", error);
          setPasswordErrors(prev => ({
            ...prev,
            general: error.response?.data?.error || "Failed to update password. Please try again."
          }));
          return;
        } finally {
          setIsUpdatingPassword(false);
        }
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );
      
      await reauthenticateWithCredential(user, credential);
      
      await updatePassword(user, passwordData.newPassword);
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      setShowPasswordSuccessModal(true);
      
    } catch (error) {
      console.error("Password update error:", error);
      
      if (error.code === 'auth/wrong-password') {
        setPasswordErrors(prev => ({
          ...prev,
          currentPassword: "Current password is incorrect"
        }));
      } else if (error.code === 'auth/weak-password') {
        setPasswordErrors(prev => ({
          ...prev,
          newPassword: "Password is too weak. Please choose a stronger password."
        }));
      } else if (error.code === 'auth/requires-recent-login') {
        setPasswordErrors(prev => ({
          ...prev,
          general: "For security reasons, please logout and login again before changing your password."
        }));
      } else {
        setPasswordErrors(prev => ({
          ...prev,
          general: "Failed to update password. Please try again."
        }));
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        console.error("User information not found.");
        navigate("/login");
        return;
      }

      const userData = JSON.parse(storedUser);
      const email = userData.email;

      if (!email) {
        console.error("Email not found.");
        navigate("/login");
        return;
      }

      const response = await axios.post("http://localhost:5000/users/delete", {
        email: email
      });

      clearAllUserData(email);
      
      const auth = getAuth(app);
      if (auth.currentUser) {
        await signOut(auth);
      }
      

      const handleLogout = async () => {
        const auth = getAuth(app);
        try {
          await signOut(auth);
          localStorage.removeItem("user");
          navigate("/auth");
        } catch (error) {
          console.error("Logout error:", error);
        }
      };

      const handleClearAllData = () => {
        if (formData.email) {
          clearAllUserData(formData.email);
          setShowClearDataModal(false);
          window.location.reload();
        }
      };

      setShowDeleteModal(false);
      setShowDeleteSuccessModal(true);
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Delete account error:", error);
      const errorMsg = error.response?.data?.error || "Failed to delete account. Please try again.";
      console.error("Delete account error:", errorMsg);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };


  const handleEditUsername = () => {
    setIsEditingUsername(true);
    setNewUsername(userData.fullName || "");
  };

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      return;
    }

    setIsSavingUsername(true);
    try {
      const storedUser = localStorage.getItem("user");
      const user = JSON.parse(storedUser);
      
      const res = await axios.post("http://localhost:5000/users/update-username", {
        email: user.email,
        newUsername: newUsername.trim()
      });

      const updatedUser = { ...user, name: newUsername.trim() };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setUserData(prev => ({
        ...prev,
        fullName: newUsername.trim()
      }));

      setIsEditingUsername(false);
      setShowUsernameSuccessModal(true);
      
      window.dispatchEvent(new Event("userStorageChange"));
    } catch (error) {
      console.error("Error updating username:", error);
    } finally {
      setIsSavingUsername(false);
    }
  };

  const handleCancelEditUsername = () => {
    setIsEditingUsername(false);
    setNewUsername("");
  };

  const handleEditPhoto = () => {
    setIsEditingPhoto(true);
  };

  const handlePhotoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Photo size must be less than 5MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file");
        return;
      }
      
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = async () => {
    if (!selectedPhoto) {
      alert("Please select a photo first");
      return;
    }

    setIsSavingPhoto(true);
    try {
      const storedUser = localStorage.getItem("user");
      const user = JSON.parse(storedUser);
      
      const formData = new FormData();
      formData.append('email', user.email);
      formData.append('photo', selectedPhoto);
      
      const res = await axios.post("http://localhost:5000/users/update-photo", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const updatedUser = { ...user, photoURL: res.data.photoURL };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setUserData(prev => ({
        ...prev,
        photoURL: res.data.photoURL
      }));

      setIsEditingPhoto(false);
      setSelectedPhoto(null);
      setPhotoPreview("");
      setShowPhotoSuccessModal(true);
      
      window.dispatchEvent(new Event("userStorageChange"));
    } catch (error) {
      console.error("Error updating photo:", error);
      alert("Failed to update photo. Please try again.");
    } finally {
      setIsSavingPhoto(false);
    }
  };

  const handleCancelEditPhoto = () => {
    setIsEditingPhoto(false);
    setSelectedPhoto(null);
    setPhotoPreview("");
  };

  const handleDashboardViewChange = (view) => {
    const prevView = dashboardView;
    if (prevView !== view) {
      setDashboardView(view);
      localStorage.setItem("dashboardView", view);
      
      window.dispatchEvent(new CustomEvent("dashboardViewChange", { detail: view }));
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      <Sidebar />
      <main className={`flex-1 bg-[#F5F5F5] transition-all duration-300 ease-in-out ml-0 lg:ml-20 ${isExpanded ? "lg:ml-64" : "lg:ml-20"}`}>
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <header className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors"
                aria-label="Open menu"
              >
                <HiMenuAlt2 className="text-2xl text-gray-700" />
              </button>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Settings</h1>
            </div>
            <div className="inline-flex items-center bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1 rounded-full">
              Personal Information
            </div>
          </header>

          <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 lg:gap-8">
              <div className="relative flex-shrink-0">
                {(isEditingPhoto && photoPreview) ? (
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-green-500"
                  />
                ) : userData.photoURL ? (
                  <img 
                    src={userData.photoURL} 
                    alt="Profile" 
                    className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-3xl sm:text-4xl">
                    {(isEditingUsername && newUsername) ? newUsername.charAt(0).toUpperCase() : userData.fullName ? userData.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                {isEditingPhoto && (
                  <label className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoFileChange}
                      className="hidden"
                    />
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                )}
              </div>
              <div className="flex-1 w-full text-center sm:text-left">
                {isEditingUsername ? (
                  <div className="mb-2">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Enter username"
                      className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 bg-white border-2 border-green-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 w-full max-w-md"
                      autoFocus
                    />
                  </div>
                ) : (
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-2">
                    {userData.fullName || 'User Name'}
                  </h2>
                )}
                <p className="text-gray-500 text-sm sm:text-base mb-1 sm:mb-2">{userData.email}</p>
                <p className="text-gray-500 text-sm sm:text-base mb-3 sm:mb-4">{userData.role}</p>
                {isEditingUsername ? (
                  <div className="flex gap-2 justify-center sm:justify-start">
                    <button 
                      onClick={handleSaveUsername}
                      disabled={isSavingUsername}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSavingUsername ? "Saving..." : "Save"}
                    </button>
                    <button 
                      onClick={handleCancelEditUsername}
                      disabled={isSavingUsername}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 justify-center sm:justify-start">
                      <button 
                        onClick={handleEditUsername}
                        disabled={isGoogleUser}
                        className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                          isGoogleUser 
                            ? 'bg-gray-400 cursor-not-allowed opacity-60' 
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                        title={isGoogleUser ? "Google account users must change name via Google Account settings" : ""}
                      >
                        Change Name
                      </button>
                    {isEditingPhoto ? (
                      <>
                        <button 
                          onClick={handleSavePhoto}
                          disabled={isSavingPhoto || !selectedPhoto}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSavingPhoto ? "Saving..." : "Save Photo"}
                        </button>
                        <button 
                          onClick={handleCancelEditPhoto}
                          disabled={isSavingPhoto}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={handleEditPhoto}
                        disabled={isGoogleUser}
                        className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                          isGoogleUser 
                            ? 'bg-gray-400 cursor-not-allowed opacity-60' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white`}
                        title={isGoogleUser ? "Google account users must change photo via Google Account settings" : ""}
                      >
                        Change Photo
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-base sm:text-lg">💰</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Financial Preferences</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Default Currency</label>
                  <select
                    value={currency}
                    onChange={handleInputChange}
                    name="currency"
                    className="w-full px-2.5 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="PHP">₱ PHP - Philippine Peso</option>
                    <option value="USD">$ USD - US Dollar</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Default Dashboard View</label>
                  <div className="flex gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => handleDashboardViewChange("Daily")}
                      className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                        dashboardView === "Daily"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Daily
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDashboardViewChange("Weekly")}
                      className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                        dashboardView === "Weekly"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Weekly
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDashboardViewChange("Monthly")}
                      className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                        dashboardView === "Monthly"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-base sm:text-lg">🔔</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Notifications</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-sm sm:text-base">Expense Limit Warning</div>
                    <div className="text-xs sm:text-sm text-gray-500">Get alerts when nearing budget limit</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={notifications.expenseLimit}
                      onChange={() => handleNotificationToggle("expenseLimit")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-sm sm:text-base">Bill Reminders</div>
                    <div className="text-xs sm:text-sm text-gray-500">Never miss payment deadlines</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={notifications.billReminders}
                      onChange={() => handleNotificationToggle("billReminders")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-sm sm:text-base">Email Notification</div>
                    <div className="text-xs sm:text-sm text-gray-500">Receive updates via email</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={() => handleNotificationToggle("emailNotifications")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-base sm:text-lg">🔒</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Password</h3>
            </div>
            
            {isGoogleUser ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="text-blue-600 text-base sm:text-lg flex-shrink-0">ℹ️</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-blue-800 font-medium mb-1 text-sm sm:text-base">Google Account Detected</p>
                    <p className="text-blue-700 text-xs sm:text-sm">
                      You are logged in with a Google account. Password changes must be made through your Google Account settings.
                    </p>
                    <a 
                      href="https://myaccount.google.com/security" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline text-xs sm:text-sm mt-2 inline-block"
                    >
                      Go to Google Account Security →
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">
                  {isEmailVerified 
                    ? "Email verified ✅ You can now change your password." 
                    : "Please verify your email before changing your password."}
                </p>
                
                {!isEmailVerified && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-yellow-600 text-base sm:text-lg flex-shrink-0">⚠️</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-yellow-800 font-medium mb-2 text-sm sm:text-base">Email Verification Required</p>
                        <p className="text-yellow-700 text-xs sm:text-sm mb-3">
                          For security reasons, you need to verify your email before changing your password.
                        </p>
                        <button
                          onClick={handleSendVerificationCode}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                        >
                          Send Verification Code
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {passwordErrors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-600 text-xs sm:text-sm">{passwordErrors.general}</p>
                  </div>
                )}
              </>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Your Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Current Password"
                    disabled={isGoogleUser}
                    className={`w-full px-2.5 sm:px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                    } ${isGoogleUser ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'}`}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Enter your new Password"
                    disabled={isGoogleUser}
                    className={`w-full px-2.5 sm:px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                    } ${isGoogleUser ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'}`}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Confirm Password"
                    disabled={isGoogleUser}
                    className={`w-full px-2.5 sm:px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } ${isGoogleUser ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'}`}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
                  )}
                </div>
                
                <div className="flex gap-2 sm:gap-3 pt-2">
                  <button 
                    onClick={() => {
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                      });
                      setPasswordErrors({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                        general: ""
                      });
                    }}
                    disabled={isGoogleUser}
                    className={`flex-1 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                      isGoogleUser
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleChangePassword}
                    disabled={isGoogleUser || isUpdatingPassword}
                    className={`flex-1 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                      isGoogleUser || isUpdatingPassword
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                    title={isGoogleUser ? "Password change is not available for Google accounts" : ""}
                  >
                    {isUpdatingPassword ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
              
              <div className="lg:pl-8">
                <h4 className="text-xs sm:text-sm font-medium text-gray-600 mb-3 sm:mb-4">Password must contains:</h4>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      passwordData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-700">Min 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      /[a-z]/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-700">Lower-case Letter</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-700">Special Character</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      /[A-Z]/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-700">Upper-case Letter</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      /\d/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-700">Number</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm mb-6 text-center">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Delete My Account</h3>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-medium transition-colors mx-auto"
            >
              Delete Account
            </button>
          </div>
        </div>
      </main>
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteAccount}
        isLoading={isDeleting}
      />
      <DeleteSuccessModal
        isOpen={showDeleteSuccessModal}
        onClose={() => setShowDeleteSuccessModal(false)}
      />
      {showVerificationModal && (
        <PasswordChangeVerificationModal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          email={verificationEmail}
          onBack={() => setShowVerificationModal(false)}
          onSuccess={handleVerificationSuccess}
        />
      )}
      <SuccessModal
        isOpen={showPasswordSuccessModal}
        message="Password updated successfully! Your account is now secured with your new password."
        onClose={() => setShowPasswordSuccessModal(false)}
      />
      <SuccessModal
        isOpen={showUsernameSuccessModal}
        message="Username updated successfully!"
        onClose={() => setShowUsernameSuccessModal(false)}
      />
      <SuccessModal
        isOpen={showPhotoSuccessModal}
        message="Profile photo updated successfully! Your new photo is now visible."
        onClose={() => setShowPhotoSuccessModal(false)}
      />
    </div>
  );
};

export default Settings;

