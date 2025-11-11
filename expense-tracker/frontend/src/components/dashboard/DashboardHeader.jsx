import React from "react";
import { FaBell, FaChevronDown, FaUser } from "react-icons/fa";

const DashboardHeader = ({ username }) => {
  return (
    <header className="bg-gray-100 shadow-sm px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-0 flex-1 max-w-md">
        <h1 className="text-[40px] font-bold text-gray-800 tracking-tight">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition">
          <FaBell className="text-gray-700 text-lg" />
        </button>

        <button
          className="flex w-70 items-center gap-3 bg-white px-3 py-2 rounded-lg shadow-md hover:bg-gray-50 transition"
          style={{ borderRadius: "30px" }}
        >
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <FaUser className="text-gray-600" />
          </div>
          <div className="flex flex-col items-start flex-1">
            <span className="text-sm font-bold text-gray-800 leading-tight">
              {username}
            </span>
            <span className="text-xs text-gray-600 leading-tight">
              Account
            </span>
          </div>
          <FaChevronDown
            className="text-white text-base flex-shrink-0 ml-2"
            style={{
              backgroundColor: "black",
              borderRadius: "30px",
              padding: "5px",
              width: "25px",
              height: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;