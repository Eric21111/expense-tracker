import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({ password, setPassword }) => {
  const [strength, setStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

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
    { test: /.{8,}/, label: "At least 8 characters" },
    { test: /[A-Z]/, label: "At least one uppercase letter" },
    { test: /[a-z]/, label: "At least one lowercase letter" },
    { test: /[0-9]/, label: "At least one number" },
    { test: /[@$!%*?&]/, label: "At least one special character (@$!%*?&)" },
  ];

  return (
    <div className="w-full">
     
      <div className="border border-green-300 rounded-xl overflow-hidden flex items-center relative">
       
        <div className="flex items-center justify-center bg-green-500 px-4 py-4">
          <FaLock className="text-white" />
        </div>

     
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handleChange}
          placeholder="Enter your password..."
          className="flex-1 px-4 py-3 outline-none text-sm text-gray-700 placeholder-gray-400"
          required
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$"
          title="Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character."
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 text-gray-500 hover:text-green-600 focus:outline-none"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

     
      <div
        className={`transition-all duration-500 ease-in-out ${
          isTyping ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
      
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

       
        <div className="mt-2 text-xs text-gray-600 space-y-1">
          {rules.map((rule, index) => {
            const passed = rule.test.test(password);
            return (
              <div key={index} className="flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    passed ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
                <span
                  className={`${passed ? "text-green-600 font-medium" : ""}`}
                >
                  {rule.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PasswordInput;
