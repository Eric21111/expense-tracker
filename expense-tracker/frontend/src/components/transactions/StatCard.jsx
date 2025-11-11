import React from "react";

const StatCard = ({ icon, value, title, subtitle, iconColor, titleColor }) => {
  return (
    <div
  
      className="bg-white p-5 rounded-2xl shadow-lg"
      style={{ borderRadius: "20px" }}
    >
    
      <div className="flex items-center justify-between">
        
       
        <div>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p
            className="text-xs mt-1 font-medium"
            style={{ color: titleColor || "#6B7281" }}
          >
            {title}
          </p>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>

    
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" 
          style={{ backgroundColor: iconColor ? `${iconColor}20` : "#E5E7EB" }} 
        >
         
          {React.cloneElement(icon, {
            style: { color: iconColor || "#374151" },
          })}
        </div>

      </div>
    </div>
  );
};

export default StatCard;