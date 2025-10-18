import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="flex items-center justify-between px-12 py-5 absolute top-4 left-0 w-full z-50 bg-transparent"
    >
      <div className="flex items-center justify-center mx-auto border border-white/70 rounded-full px-2 py-1 shadow-lg shadow-gray-500/50 bg-white/20 backdrop-blur-md">
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
