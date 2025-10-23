import React, { useState, useRef } from "react";
import { FaTimes, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import ShieldIcon from "../../assets/shield.png";
import ResetPasswordModal from "./ResetPasswordModal";

const VerifyCodeModal = ({ isOpen, onClose, email, onBack }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [verifiedCode, setVerifiedCode] = useState("");
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
   
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

  
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {

    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newCode[index] = char;
    });
    setCode(newCode);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      setMessage("Please enter all 6 digits");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/users/verify-code", {
        email,
        code: verificationCode,
      });
      
      setMessage(res.data.message || "Code verified successfully!");
      setMessageType("success");
      setVerifiedCode(verificationCode);
      

      setTimeout(() => {
        setShowResetPasswordModal(true);
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.error || "❌ Invalid or expired code. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCode(["", "", "", "", "", ""]);
    setMessage("");
    setMessageType("");
    setShowResetPasswordModal(false);
    setVerifiedCode("");
    onClose();
  };

 
  if (showResetPasswordModal) {
    return (
      <ResetPasswordModal
        isOpen={isOpen}
        onClose={handleClose}
        email={email}
        verificationCode={verifiedCode}
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
          onClick={onBack}
          className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaArrowLeft size={24} />
        </button>


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
            Enter 6-Digit
            <br />
            Verification Code
          </h2>

     
          <p className="text-gray-500 mb-8 max-w-sm">
            We have sent a verification code to your registered email address
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
    
            <div className="flex justify-center gap-2 mb-6">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                  disabled={isLoading}
                />
              ))}
            </div>

   
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl text-white font-semibold bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Done"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyCodeModal;
