import React from "react";

const WelcomeBanner = ({ username, illustration }) => {
  return (
    <div
      className="p-6 md:p-8 flex items-center justify-between shadow-lg h-[180px] relative"
      style={{
        background: "linear-gradient(to right, #34A853, #CCEFCC)",
        borderRadius: "30px",
      }}
    >
      <div className="text-white z-10 flex-1">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
          Welcome Back, {username}
        </h1>
        <p className="text-white/90 text-sm md:text-base lg:text-lg">
          Here's your financial overview for today.
        </p>
      </div>
      <div className="hidden lg:block absolute right-0 bottom-0 z-0">
        <img
          src={illustration}
          alt="Man with laptop on arrow"
          className="h-[270px] w-auto object-contain"
          style={{
            transform: "translate(-60px, 40px)",
            maxHeight: "270px",
          }}
        />
      </div>
    </div>
  );
};

export default WelcomeBanner;