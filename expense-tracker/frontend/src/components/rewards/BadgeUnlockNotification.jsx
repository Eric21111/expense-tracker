import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const BadgeUnlockNotification = ({ badge, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!badge) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ 
            y: 0, 
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 260,
              damping: 20
            }
          }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto"
        >
          <div className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-4 min-w-[300px]">
            <div className="bg-gradient-to-br from-emerald-400 to-green-500 rounded-full p-3 shadow-md">
              <img 
                src={badge.icon} 
                alt={badge.name}
                className="w-12 h-12 object-contain brightness-0 invert"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {badge.name}
              </h3>
              <p className="text-sm text-gray-600">
                {badge.description}
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BadgeUnlockNotification;
