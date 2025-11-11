import React from "react";
import { IoRibbon } from "react-icons/io5";

const AchievementsCard = () => {
  return (
    <div
      className="p-3 flex flex-col justify-between shadow-lg"
      style={{
        borderRadius: "24px",
        background: "linear-gradient(to bottom, #FFE082, #FFCCBC)",
      }}
    >
      <div className="mb-3">
        <h2 className="text-base font-semibold text-gray-800">Achievements</h2>
      </div>

      <div className="bg-white rounded-xl p-3 flex flex-col items-center flex-1 justify-between shadow-md">
        <div className="flex flex-col items-center flex-1 w-full">
          <div className="relative mb-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-md"
              style={{
                background: "linear-gradient(to bottom, #FFA726, #FFD54F)",
              }}
            >
              <IoRibbon className="text-white text-3xl" />
            </div>
            
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-sm"></div>
          </div>

          <h3 className="text-base font-bold text-gray-800 mb-1.5 px-2.5 py-1 bg-white rounded-lg shadow-sm border border-gray-100">
            Budget Master
          </h3>

          <p className="text-xs text-gray-700 text-center leading-tight max-w-xs mb-3 bg-white px-2.5 py-1 rounded-lg">
            Congratulations! You've stayed under budget for 3 consecutive
            months. Keep up the great work!
          </p>
        </div>

        <button
          className="w-full text-white font-bold py-1.5 px-3 transition-all hover:shadow-xl hover:scale-105 text-xs"
          style={{
            background: "linear-gradient(to right, #FF8A50, #FFB74D)",
            borderRadius: "999px",
            boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)",
          }}
        >
          LEVEL 3 ACHIEVED
        </button>
      </div>
    </div>
  );
};

export default AchievementsCard;