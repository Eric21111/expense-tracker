import React from "react";

const Header = () => {
  return (
    <nav className="flex items-center justify-between px-12 py-5 relative" style={{ backgroundColor: "#D9D9D94A" }}>
      
      <h1 className="text-lg font-bold absolute left-12">Trackit</h1>

     
      <div className="flex items-center justify-center mx-auto border border-black rounded-full px-2 py-1">
        <button className="px-6 py-1 text-sm font-medium rounded-full hover:bg-black hover:text-white transition">
          Home
        </button>
        <button className="px-6 py-1 text-sm font-medium rounded-full bg-black text-white">
          Login
        </button>
        <button className="px-6 py-1 text-sm font-medium rounded-full hover:bg-black hover:text-white transition">
          About
        </button>
      </div>
    </nav>
  );
};

export default Header;
