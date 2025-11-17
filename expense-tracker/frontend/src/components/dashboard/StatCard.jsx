import React from "react";

const StatCard = ({ title, amount, description, icon }) => {
  return (
    <div
      className="bg-white p-4 sm:p-6 shadow-md relative overflow-hidden"
      style={{ borderRadius: "20px" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 break-words">{amount}</h3>
          <p className="text-sm sm:text-base font-bold text-green-600">{title}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;