import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="flex items-center justify-center px-12 py-5 fixed top-4 left-0 right-0 w-full z-[9999] bg-transparent pointer-events-none"
      style={{ zIndex: 9999 }}
    >
      <div className="flex items-center justify-center border border-white/70 rounded-full px-2 py-1 shadow-md shadow-gray-500/30 bg-white/20 backdrop-blur-md pointer-events-auto">
        <button
          onClick={() => navigate("/")}
          className={`px-6 py-1 text-sm font-medium rounded-full transition ${
            location.pathname === "/"
              ? "bg-[#CCEFCC] !text-black"
              : "text-black hover:bg-[#CCEFCC] hover:text-black"
          }`}
        >
          Home
        </button>

        <button
          onClick={() => navigate("/login")}
          className={`px-6 py-1 text-sm font-medium rounded-full transition ${
            location.pathname === "/login" || location.pathname === "/register"
              ? "bg-[#CCEFCC] !text-black"
              : "text-black hover:bg-[#CCEFCC] hover:text-black"
          }`}
        >
          Login
        </button>

        {/* <button
          onClick={() => navigate("/about")}
          className={`px-6 py-1 text-sm font-medium rounded-full transition ${
            location.pathname === "/about"
              ? "bg-[#CCEFCC] text-black"
              : "hover:bg-[#CCEFCC] hover:text-black"
          }`}
        >
          About
        </button> */}
      </div>
    </nav>
  );
};

export default Header;
