import React, { useState } from "react";
import { FaTimes, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import ResetIcon from "../../assets/reset.png";
import SuccessModal from "./SuccessModal";

const ResetPasswordModal = ({ isOpen, onClose, email, verificationCode }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newPassword || !confirmPassword) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

   
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[@$!%*?&]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecial) {
      setMessage("Password must include uppercase, lowercase, number, and special character.");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/users/reset-password", {
        email,
        code: verificationCode,
        newPassword,
      });
      
      
      setShowSuccessModal(true);
    } catch (error) {
      setMessage(error.response?.data?.error || "❌ Failed to reset password. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
    setMessageType("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowSuccessModal(false);
    onClose();
  };

  const handleSuccessConfirm = () => {
    handleClose();
    window.location.href = "/"; 
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none backdrop-blur-sm"
      style={{ zIndex: 9999 }}
    >
      <div
        className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full max-w-lg transform transition-all duration-300 scale-100 relative pointer-events-auto"
        style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}
      >
      
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={24} />
        </button>

        <div className="px-8 py-10 flex flex-col items-center text-center">
      
          <div className="mb-6">
            <img
              src={ResetIcon}
              alt="Reset Password"
              className="w-32 h-32 object-contain"
            />
          </div>

      
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Reset Password
          </h2>

          <p className="text-gray-500 mb-8 max-w-sm">
            Enter your new password below
          </p>

        
          {message && (
            <div
              className={`mb-6 p-3 rounded-lg text-sm w-full ${
                messageType === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}


          <form onSubmit={handleSubmit} className="w-full space-y-5">
            
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="flex items-center rounded-xl overflow-hidden border-2 border-gray-200 focus-within:border-green-500 transition-colors relative">
                <div className="flex items-center justify-center bg-green-500 px-4 py-3">
                  <FaLock className="text-white" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password..."
                  className="flex-1 px-4 py-3 outline-none text-sm text-gray-700 pr-12"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-500 hover:text-green-600 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

         
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="flex items-center rounded-xl overflow-hidden border-2 border-gray-200 focus-within:border-green-500 transition-colors relative">
                <div className="flex items-center justify-center bg-green-500 px-4 py-3">
                  <FaLock className="text-white" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password..."
                  className="flex-1 px-4 py-3 outline-none text-sm text-gray-700 pr-12"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 text-gray-500 hover:text-green-600 focus:outline-none"
                >
                  {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

           
            <div className="text-left bg-gray-50 p-4 rounded-lg">
              <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className={newPassword.length >= 8 ? "text-green-600" : ""}>
                  • At least 8 characters
                </li>
                <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>
                  • One uppercase letter
                </li>
                <li className={/[a-z]/.test(newPassword) ? "text-green-600" : ""}>
                  • One lowercase letter
                </li>
                <li className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>
                  • One number
                </li>
                <li className={/[@$!%*?&]/.test(newPassword) ? "text-green-600" : ""}>
                  • One special character (@$!%*?&)
                </li>
              </ul>
            </div>

         
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl text-white font-semibold bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>

  
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleClose}
        onConfirm={handleSuccessConfirm}
      />
    </div>
  );
};

export default ResetPasswordModal;
