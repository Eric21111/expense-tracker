import React from "react";

const StatCard = ({ title, amount, description, icon }) => {
  return (
    <div
      className="bg-white p-6 shadow-md relative overflow-hidden"
      style={{ borderRadius: "30px" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{amount}</h3>
          <p className="text-base font-bold text-green-600 ">{title}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center absolute top-4 right-4">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;