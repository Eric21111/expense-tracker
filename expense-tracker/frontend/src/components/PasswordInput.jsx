import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";

const PasswordInput = ({ password, setPassword }) => {
  const [strength, setStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const inputContainerRef = useRef(null);

  const evaluateStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[@$!%*?&]/.test(pass)) score++;

    if (score <= 2) return "Weak";
    if (score === 3 || score === 4) return "Medium";
    if (score === 5) return "Strong";
    return "";
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setStrength(evaluateStrength(value));
    setIsTyping(value.length > 0);
  };

  const getBarColor = () => {
    if (strength === "Weak") return "bg-red-500";
    if (strength === "Medium") return "bg-yellow-500";
    if (strength === "Strong") return "bg-green-500";
    return "bg-gray-300";
  };

  const rules = [
    { 
      test: (pass) => pass.length >= 8 && pass.length <= 50, 
      label: "At least 8 and at most 50 characters in length" 
    },
    { 
      test: /[a-z]/, 
      label: "At least one lower-case letter (a-z)" 
    },
    { 
      test: /[A-Z]/, 
      label: "At least one upper-case letter (A-Z)" 
    },
    { 
      test: /[0-9]/, 
      label: "At least one digit (0-9)" 
    },
    { 
      test: /[@#$!%*?&]/, 
      label: "At least one and at most ten non alpha-numeric character(s) (Example: @, #, $)" 
    },
  ];

 
  const allRulesMet = rules.every((rule) => {
    return typeof rule.test === 'function' 
      ? rule.test(password) 
      : rule.test.test(password);
  });

  useEffect(() => {
    const shouldShow = (showTooltip || isTyping) && !allRulesMet;
    if (shouldShow && inputContainerRef.current) {
      const rect = inputContainerRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top + window.scrollY,
        left: rect.right + window.scrollX + 16, 
      });
    }
  }, [showTooltip, isTyping, allRulesMet]);

  return (
    <div className="w-full relative">
     
      <div 
        ref={inputContainerRef}
        className="border border-green-300 rounded-xl overflow-hidden flex items-center relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
       
        <div className="flex items-center justify-center bg-green-500 px-4 py-4">
          <FaLock className="text-white" />
        </div>

     
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handleChange}
          onFocus={() => setShowTooltip(true)}
          placeholder="Enter your password..."
          className="flex-1 px-4 py-3 outline-none text-sm text-gray-700 placeholder-gray-400"
          required
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$"
        
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 text-gray-500 hover:text-green-600 focus:outline-none"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

     
    
      {(showTooltip || isTyping) && !allRulesMet && createPortal(
        <div 
          className="fixed w-80 z-[99999] pointer-events-none"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
        >
          <div className="bg-gray-800 rounded-lg p-4 space-y-2 shadow-2xl border border-gray-700">
            {rules.map((rule, index) => {
              const passed = typeof rule.test === 'function' 
                ? rule.test(password) 
                : rule.test.test(password);
              return (
                <div key={index} className="flex items-start gap-2">
                  <FaCheckCircle 
                    className={`mt-0.5 flex-shrink-0 ${
                      passed ? "text-green-500" : "text-gray-500"
                    }`}
                    size={16}
                  />
                  <span
                    className={`text-sm ${
                      passed ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {rule.label}
                  </span>
                </div>
              );
            })}
          </div>
         
          <div className="absolute left-0 top-4 -ml-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-800"></div>
        </div>,
        document.body
      )}

    
      {isTyping && (
        <div className="mt-2">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getBarColor()} transition-all duration-300`}
              style={{
                width:
                  strength === "Weak"
                    ? "33%"
                    : strength === "Medium"
                    ? "66%"
                    : strength === "Strong"
                    ? "100%"
                    : "0%",
              }}
            ></div>
          </div>

          {strength && (
            <p
              className={`text-sm mt-1 font-medium ${
                strength === "Weak"
                  ? "text-red-500"
                  : strength === "Medium"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {strength} Password
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
