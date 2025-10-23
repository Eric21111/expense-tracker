import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import ShieldIcon from "../../assets/shield.png";
import VerifyCodeModal from "./VerifyCodeModal";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [sentEmail, setSentEmail] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email address.");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/users/forgot-password", {
        email,
      });
      setMessage(res.data.message || "Verification code sent to your email!");
      setMessageType("success");
      setSentEmail(email);
      
   
      setTimeout(() => {
        setShowVerifyModal(true);
      }, 1000);
    } catch (error) {
      console.error("Frontend error:", error);
      console.error("Error response:", error.response?.data);
      const errorMsg = error.response?.data?.error || "❌ Failed to send reset email. Please try again.";
      const errorDetails = error.response?.data?.details ? ` (${error.response.data.details})` : "";
      setMessage(errorMsg + errorDetails);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setMessage("");
    setMessageType("");
    setShowVerifyModal(false);
    setSentEmail("");
    onClose();
  };

  const handleBackToEmail = () => {
    setShowVerifyModal(false);
    setEmail(sentEmail);
  };

  if (showVerifyModal) {
    return (
      <VerifyCodeModal
        isOpen={isOpen}
        onClose={handleClose}
        email={sentEmail}
        onBack={handleBackToEmail}
      />
    );
  }

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
              src={ShieldIcon} 
              alt="Shield" 
              className="w-32 h-32 object-contain"
            />
          </div>

          
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Forgot Password?
          </h2>

      
          <p className="text-gray-500 mb-8 max-w-sm">
            We will sent a verification code to you registered email address
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


          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Email Address
              </label>
              <div className="flex items-center rounded-xl overflow-hidden border-2 border-gray-200 focus-within:border-green-500 transition-colors">
                <div className="flex items-center justify-center bg-green-500 px-4 py-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 10C12.21 10 14 8.21 14 6C14 3.79 12.21 2 10 2C7.79 2 6 3.79 6 6C6 8.21 7.79 10 10 10ZM10 12C7.33 12 2 13.34 2 16V18H18V16C18 13.34 12.67 12 10 12Z" fill="white"/>
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 px-4 py-3 outline-none text-sm text-gray-700"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>


            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl text-white font-semibold bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
