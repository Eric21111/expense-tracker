import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/shared/Sidebar";
import DeleteAccountModal from "../components/DeleteAccountModal";
import DeleteSuccessModal from "../components/DeleteSuccessModal";
import { getAuth, signOut } from "firebase/auth";
import app from "../firebaseConfig";
import { useSidebar } from "../contexts/SidebarContext";

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

  const [dashboardView, setDashboardView] = useState("Monthly");
  const [notifications, setNotifications] = useState({
    expenseLimit: true,
    budgetGoal: true,
    billReminders: false,
    weeklySummary: true,
    emailNotifications: false,
  });
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { isExpanded } = useSidebar();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        
        const isGoogle = user.providerData.some(
          (provider) => provider.providerId === "google.com"
        );
        setIsGoogleUser(isGoogle);
      } else {
       
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setIsGoogleUser(!!userData.photoURL);
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
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChangePassword = () => {
   
    console.log("Change password clicked");
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        alert("❌ User information not found. Please login again.");
        navigate("/login");
        return;
      }

      const userData = JSON.parse(storedUser);
      const email = userData.email;

      if (!email) {
        alert("❌ Email not found. Please login again.");
        navigate("/login");
        return;
      }

      const response = await axios.post("http://localhost:5000/users/delete", {
        email,
      });

   
      localStorage.removeItem("user");
      
      
      const auth = getAuth(app);
      if (auth.currentUser) {
        await signOut(auth);
      }
      

      setShowDeleteModal(false);
      setShowSuccessModal(true);
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Delete account error:", error);
      const errorMsg = error.response?.data?.error || "❌ Failed to delete account. Please try again.";
      alert(errorMsg);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };


  const handleChangePhoto = () => {

    console.log("Change photo clicked");
  };

  return (
    <div className="flex min-h-screen bg-[#f7f9fc] font-['Inter',Arial,sans-serif] text-[#1a1a1a]">
      <Sidebar />
      <main className={`flex-1 bg-[#f7f9fc] transition-all duration-300 ease-in-out ${isExpanded ? "ml-64" : "ml-20"}`}>
        <div className="max-w-[1100px] mx-auto my-10 px-5">
        <header className="mb-6">
          <h1 className="text-[1.8rem] font-semibold mb-1">Settings</h1>
          <p className="text-[#6b7280] text-[0.95rem] mb-6">
            Manage your account settings and preferences
          </p>
        </header>

    
        <section className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] mb-6 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <div className="flex items-start gap-6 flex-wrap">
            <div className="flex flex-col items-center gap-2.5">
              <div className="bg-[#22c55e] w-[100px] h-[100px] rounded-xl flex items-center justify-center text-white font-bold text-[1.8rem]">
                <span>JD</span>
              </div>
              <button
                type="button"
                onClick={handleChangePhoto}
                className="bg-transparent border-none text-[#16a34a] cursor-pointer font-medium hover:underline"
              >
                Change Photo
              </button>
            </div>

            <form className="flex-1 grid gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className="text-[0.9rem] text-[#374151] mb-1 block"
                  >
                    Full Name:
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-2.5 py-2.5 border border-[#d1d5db] rounded-lg text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="username"
                    className="text-[0.9rem] text-[#374151] mb-1 block"
                  >
                    Username:
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-2.5 py-2.5 border border-[#d1d5db] rounded-lg text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="text-[0.9rem] text-[#374151] mb-1 block"
                  >
                    Email Address:
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-2.5 py-2.5 border border-[#d1d5db] rounded-lg text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="text-[0.9rem] text-[#374151] mb-1 block"
                  >
                    Phone Number:
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter contact number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-2.5 py-2.5 border border-[#d1d5db] rounded-lg text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={isGoogleUser}
                  className={`border-none rounded-lg px-[18px] py-2.5 font-medium transition-colors ${
                    isGoogleUser
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-[#22c55e] text-white hover:bg-[#16a34a] cursor-pointer"
                  }`}
                  title={isGoogleUser ? "Password change is not available for Google accounts" : ""}
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
     
          <aside className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow">
            <h3 className="text-xl font-semibold mb-4">Financial Preferences</h3>
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="currency" className="text-[0.9rem] text-[#374151] mb-1 block">
                Default Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="px-2.5 py-2.5 rounded-lg border border-[#d1d5db] text-[0.95rem] bg-white focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
              >
                <option value="PHP">₱ PHP - Philippine Peso</option>
                <option value="USD">$ USD - Dollar</option>
              </select>

              <label htmlFor="startMonth" className="text-[0.9rem] text-[#374151] mb-1 block">
                Start of Month
              </label>
              <input
                id="startMonth"
                name="startMonth"
                type="number"
                min="1"
                max="31"
                placeholder="Enter day (1–31)"
                value={formData.startMonth}
                onChange={handleInputChange}
                className="px-2.5 py-2.5 rounded-lg border border-[#d1d5db] text-[0.95rem] bg-white focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
              />

              <label htmlFor="monthlyLimit" className="text-[0.9rem] text-[#374151] mb-1 block">
                Monthly Budget Limit
              </label>
              <input
                id="monthlyLimit"
                name="monthlyLimit"
                type="number"
                value={formData.monthlyLimit}
                onChange={handleInputChange}
                className="px-2.5 py-2.5 rounded-lg border border-[#d1d5db] text-[0.95rem] bg-white focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
              />

              <label className="text-[0.9rem] text-[#374151] mb-1 block">
                Default Dashboard View
              </label>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setDashboardView("Daily")}
                  className={`flex-1 py-2 font-medium rounded-lg cursor-pointer transition-colors border ${
                    dashboardView === "Daily"
                      ? "bg-[#22c55e] text-white border-[#22c55e]"
                      : "bg-[#f3f4f6] border-[#d1d5db] text-[#374151] hover:bg-gray-200"
                  }`}
                >
                  Daily
                </button>
                <button
                  type="button"
                  onClick={() => setDashboardView("Weekly")}
                  className={`flex-1 py-2 font-medium rounded-lg cursor-pointer transition-colors border ${
                    dashboardView === "Weekly"
                      ? "bg-[#22c55e] text-white border-[#22c55e]"
                      : "bg-[#f3f4f6] border-[#d1d5db] text-[#374151] hover:bg-gray-200"
                  }`}
                >
                  Weekly
                </button>
                <button
                  type="button"
                  onClick={() => setDashboardView("Monthly")}
                  className={`flex-1 py-2 font-medium rounded-lg cursor-pointer transition-colors border ${
                    dashboardView === "Monthly"
                      ? "bg-[#22c55e] text-white border-[#22c55e]"
                      : "bg-[#f3f4f6] border-[#d1d5db] text-[#374151] hover:bg-gray-200"
                  }`}
                >
                  Monthly
                </button>
              </div>
            </form>
          </aside>

 
          <aside className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow">
            <h3 className="text-xl font-semibold mb-4">Notifications</h3>
            <div className="flex flex-col gap-3">
              <label className="flex justify-between items-center py-2.5 border-b border-[#f3f4f6] cursor-pointer">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-[#374151]">
                    Expense Limit Warning
                  </span>
                  <span className="text-[0.85rem] text-[#9ca3af] leading-tight">
                    Get alerts when nearing budget limit
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.expenseLimit}
                  onChange={() => handleNotificationToggle("expenseLimit")}
                  className="w-10 h-5 appearance-none bg-[#d1d5db] rounded-[10px] relative cursor-pointer transition-colors checked:bg-[#22c55e] before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform checked:before:translate-x-5"
                />
              </label>

              <label className="flex justify-between items-center py-2.5 border-b border-[#f3f4f6] cursor-pointer">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-[#374151]">
                    Budget Goal Reached
                  </span>
                  <span className="text-[0.85rem] text-[#9ca3af] leading-tight">
                    Celebrate your savings milestones
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.budgetGoal}
                  onChange={() => handleNotificationToggle("budgetGoal")}
                  className="w-10 h-5 appearance-none bg-[#d1d5db] rounded-[10px] relative cursor-pointer transition-colors checked:bg-[#22c55e] before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform checked:before:translate-x-5"
                />
              </label>

              <label className="flex justify-between items-center py-2.5 border-b border-[#f3f4f6] cursor-pointer">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-[#374151]">Bill Reminders</span>
                  <span className="text-[0.85rem] text-[#9ca3af] leading-tight">
                    Never miss payment deadlines
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.billReminders}
                  onChange={() => handleNotificationToggle("billReminders")}
                  className="w-10 h-5 appearance-none bg-[#d1d5db] rounded-[10px] relative cursor-pointer transition-colors checked:bg-[#22c55e] before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform checked:before:translate-x-5"
                />
              </label>

              <label className="flex justify-between items-center py-2.5 border-b border-[#f3f4f6] cursor-pointer">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-[#374151]">Weekly Summary</span>
                  <span className="text-[0.85rem] text-[#9ca3af] leading-tight">
                    Review your spending weekly
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.weeklySummary}
                  onChange={() => handleNotificationToggle("weeklySummary")}
                  className="w-10 h-5 appearance-none bg-[#d1d5db] rounded-[10px] relative cursor-pointer transition-colors checked:bg-[#22c55e] before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform checked:before:translate-x-5"
                />
              </label>

              <label className="flex justify-between items-center py-2.5 cursor-pointer">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-[#374151]">
                    Email Notifications
                  </span>
                  <span className="text-[0.85rem] text-[#9ca3af] leading-tight">
                    Receive updates via email
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailNotifications}
                  onChange={() => handleNotificationToggle("emailNotifications")}
                  className="w-10 h-5 appearance-none bg-[#d1d5db] rounded-[10px] relative cursor-pointer transition-colors checked:bg-[#22c55e] before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform checked:before:translate-x-5"
                />
              </label>
            </div>
          </aside>
        </section>


        <section className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] mb-6 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow">
          <h3 className="text-[1.2rem] font-semibold mb-4">Privacy & Security</h3>
          <div className="flex justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[250px] bg-[#f9fafb] rounded-[10px] p-4 text-center">
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={isGoogleUser}
                className={`border-none rounded-lg px-[18px] py-2.5 font-medium transition-colors mb-1 ${
                  isGoogleUser
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[#22c55e] text-white hover:bg-[#16a34a] cursor-pointer"
                }`}
                title={isGoogleUser ? "Password change is not available for Google accounts" : ""}
              >
                Change Password
              </button>
              <p className="text-[0.85rem] text-[#6b7280] mt-1">
                Update account password
              </p>
            </div>

            <div className="flex-1 min-w-[250px] bg-[#f9fafb] rounded-[10px] p-4 text-center">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="border-none rounded-lg px-[18px] py-2.5 font-medium cursor-pointer transition-colors bg-[#ef4444] text-white hover:bg-[#dc2626] mb-1"
              >
                Delete Account
              </button>
              <p className="text-[0.85rem] text-[#6b7280] mt-1">
                Permanently remove account
              </p>
            </div>
          </div>
        </section>
        </div>
      </main>
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteAccount}
        isLoading={isDeleting}
      />
      <DeleteSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default Settings;

