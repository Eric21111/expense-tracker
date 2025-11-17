import React from "react";

const StatCard = ({ icon, value, title, subtitle, iconColor, titleColor }) => {
  return (
    <div
      className="bg-white p-4 sm:p-5 rounded-2xl shadow-lg"
      style={{ borderRadius: "20px" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-lg sm:text-2xl font-bold text-gray-800 truncate">{value}</p>
          <p
            className="text-xs sm:text-sm mt-1 font-medium truncate"
            style={{ color: titleColor || "#6B7281" }}
          >
            {title}
          </p>
          <p className="text-xs text-gray-400 truncate">{subtitle}</p>
        </div>

        <div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ml-2"
          style={{ backgroundColor: iconColor ? `${iconColor}20` : "#E5E7EB" }}
        >
          {React.cloneElement(icon, {
            style: { color: iconColor || "#374151" },
            className: "text-base sm:text-lg"
          })}
        </div>
      </div>
    </div>
  );
};

export default StatCard;