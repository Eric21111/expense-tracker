import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="flex items-center justify-between px-12 py-5 relative "
      
    >
 
      <h1
        onClick={() => navigate("/home")}
        className="text-lg font-bold absolute left-12 cursor-pointer hover:opacity-80 transition color-[#144221]"
      >
        Trackit
      </h1>

    
      <div className="flex items-center justify-center mx-auto border border-white rounded-full px-2 py-1 shadow-2xl shadow-gray-500/70">

        <button
          onClick={() => navigate("/home")}
          className={`px-6 py-1 text-sm font-medium rounded-full transition ${
            location.pathname === "/home"
              ? "bg-[#CCEFCC] text-black"
              : "hover:bg-[#CCEFCC] hover:text-black"
          }`}
        >
          Home
        </button>

        <button
          onClick={() => navigate("/")}
          className={`px-6 py-1 text-sm font-medium rounded-full transition ${
            location.pathname === "/"
               ? "bg-[#CCEFCC] text-black"
              : "hover:bg-[#CCEFCC] hover:text-black"
          }`}
        >
          Login
        </button>

        <button
          onClick={() => navigate("/about")}
          className={`px-6 py-1 text-sm font-medium rounded-full transition ${
            location.pathname === "/about"
              ? "bg-[#CCEFCC] text-black"
              : "hover:bg-[#CCEFCC] hover:text-black"
          }`}
        >
          About
        </button>
      </div>
    </nav>
  );
};

export default Header;
