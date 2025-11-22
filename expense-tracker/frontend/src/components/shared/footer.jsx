import React from "react";
import { Link } from "react-router-dom";
import logoWhite from "../../assets/logo_whiteVer.svg";
import landingBg from "../../assets/landingpageBG.svg";

const Footer = () => {
  return (
    <footer 
      className="relative text-white py-16 px-8 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(to left, rgba(52, 168, 83, 0.9), rgba(20, 66, 33, 0.9)), url(${landingBg})`
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_2.2fr] gap-12 lg:gap-20 items-start">

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 relative flex-shrink-0">
              <img src={logoWhite} alt="TrackIT Logo" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-3xl font-bold m-0 text-white leading-none">TrackIT</h3>
          </div>
          <div>
            <p className="text-base leading-relaxed text-white m-0 font-normal">Developed by Consolve Studio</p>
            <p className="text-base leading-relaxed text-white m-0 font-normal">Zamboanga City, Philippines</p>
          </div>
        </div>

        <div>
          <h4 className="text-lg mb-5 font-bold text-white">Navigation</h4>
          <ul className="list-none space-y-2.5">
            <li><Link to="/" className="text-white/95 no-underline text-sm hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/login" className="text-white/95 no-underline text-sm hover:text-white transition-colors">Log In</Link></li>
            <li>
              <button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white/95 no-underline text-sm hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 font-inherit text-left"
              >
                About
              </button>
            </li>
            <li>
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white/95 no-underline text-sm hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 font-inherit text-left"
              >
                Features
              </button>
            </li>
            <li>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white/95 no-underline text-sm hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 font-inherit text-left"
              >
                How it Works
              </button>
            </li>
            <li>
              <button 
                onClick={() => document.getElementById('target-users')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white/95 no-underline text-sm hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 font-inherit text-left"
              >
                Target Users
              </button>
            </li>
            <li>
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white/95 no-underline text-sm hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 font-inherit text-left"
              >
                Benefits
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg mb-5 font-bold text-white">Information</h4>
          <ul className="list-none space-y-2.5">
            <li><a href="#" className="text-white/95 no-underline text-sm hover:text-white transition-colors">Zamboanga City, Philippines</a></li>
            <li><a href="mailto:consolvestudio@gmail.com" className="text-white/95 no-underline text-sm hover:text-white transition-colors">consolvestudio@gmail.com</a></li>
            <li><a href="tel:+631234567891" className="text-white/95 no-underline text-sm hover:text-white transition-colors">+63 123 456 7891</a></li>
          </ul>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-1 md:col-span-2 lg:items-start md:items-center">
          <h3 className="text-[23px] leading-[1.3] m-0 font-bold text-left text-white lg:text-center md:text-center max-w-md">
            Start tracking, budgeting, and understanding your spending in a smarter way — today.
          </h3>
          <Link 
            to="/register" 
            className="inline-block bg-white/90 text-green-700 py-3 px-10 rounded-full no-underline font-semibold text-base transition-all hover:bg-white shadow-lg ml-24"
          >
            Get Started
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
