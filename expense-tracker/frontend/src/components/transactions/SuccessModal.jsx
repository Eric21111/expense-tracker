import React, { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';

const SuccessModal = ({ isOpen, onClose, message = "Your expenses has been added." }) => {
  const [showCheck, setShowCheck] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (isOpen) {
   
      setShowCheck(false);
      setShowText(false);
      
  
      setTimeout(() => setShowCheck(true), 100);
      
     
      setTimeout(() => setShowText(true), 400);
      
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none backdrop-blur-sm bg-black/50" 
      style={{ zIndex: 9999 }}
    >
      <div 
        className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full max-w-md transform transition-all duration-300 scale-100 relative pointer-events-auto p-8"
        style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}
      >
        <div className="flex flex-col items-center text-center">
          
          <div className="relative mb-6">
            <div 
              className={`w-20 h-20 rounded-full bg-green-100 flex items-center justify-center transition-all duration-500 ${
                showCheck 
                  ? 'scale-100 opacity-100' 
                  : 'scale-0 opacity-0'
              }`}
            >
              <div 
                className={`w-16 h-16 rounded-full bg-green-500 flex items-center justify-center transition-all duration-500 ${
                  showCheck 
                    ? 'scale-100 rotate-0' 
                    : 'scale-0 rotate-180'
                }`}
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                }}
              >
                <FaCheck 
                  className={`text-white text-3xl transition-all duration-300 ${
                    showCheck 
                      ? 'opacity-100 translate-x-0 translate-y-0' 
                      : 'opacity-0 -translate-x-4 translate-y-4'
                  }`}
                  style={{
                    transitionDelay: showCheck ? '200ms' : '0ms'
                  }}
                />
              </div>
            </div>
            
       
            {showCheck && (
              <>
                <div 
                  className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-ping"
                  style={{
                    animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
                  }}
                />
                <div 
                  className="absolute inset-0 rounded-full bg-green-500 opacity-10"
                  style={{
                    animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
                    animationDelay: '0.3s'
                  }}
                />
              </>
            )}
          </div>

        
          <h2 
            className={`text-3xl font-bold text-gray-900 mb-2 transition-all duration-500 ${
              showText 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`}
          >
            Success!
          </h2>
          
          <p 
            className={`text-gray-600 transition-all duration-500 ${
              showText 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`}
            style={{
              transitionDelay: showText ? '100ms' : '0ms'
            }}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
