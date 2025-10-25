import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/shared/Header';
import Monitor1 from '../assets/home/Monitor_1.svg';
import IconPiggyBank from '../assets/home/icon-piggybank.svg';
import IconSpending from '../assets/home/icon-spending.svg';
import IconAIInsights from '../assets/home/icon-AIinsights.svg';
import IconBudgetMonitor from '../assets/home/icon-budgetandmonitor.svg';
import IconReports from '../assets/home/icon-reports.svg';
import IconAchievements from '../assets/home/icon-achievements.svg';
import AboutPicture from '../assets/home/about_picture.svg';
import MonitorFront from '../assets/home/Monitor_front.svg';
import Students from '../assets/home/Students.svg';
import Employees from '../assets/home/Employees.svg';
import BusinessOwners from '../assets/home/BusinessOwners.svg';
import IconDashboard from '../assets/home/icon-dashboard.svg';
import IconAI from '../assets/home/icon-ai.svg';
import IconTag from '../assets/home/icon-tag.svg';
import IconGoal from '../assets/home/icon-goal.svg';
import IconSecured from '../assets/home/icon-secured.svg';
import IconAccessibility from '../assets/home/icon-accesibikity.svg';
import Monitor2 from '../assets/home/monitor_2.svg';
import EmailUs from '../assets/home/email_us.svg';
import LandingPageBG from '../assets/home/landingpageBG.svg';

const Home = () => {
  const navigate = useNavigate();
  
 
  
  return (
    <div className="font-poppins bg-[#f5f5f5] overflow-x-hidden pt-20">
      <Header />
  <section 
        className="rounded-[50px] mx-[150px] my-5 p-[80px_60px] flex items-center justify-between min-h-[700px] shadow-[0_20px_40px_rgba(0,0,0,0.15)] relative overflow-visible"
        style={{
          background: `linear-gradient(to left, rgba(52, 168, 83, 0.95), rgba(20, 66, 33, 0.589)), url(${LandingPageBG}) no-repeat center center fixed`,
          backgroundSize: 'cover'
        }}
      >
        <div className="flex-1 relative z-[3] flex items-center justify-center">
          <img 
            src={Monitor1} 
            alt="TrackIT Monitor" 
            className="w-full max-w-[800px] h-auto absolute top-[-280px] left-[-170px] z-[3]" 
          />
        </div>


        <div className="flex-1 z-[2] text-right">
          <h1 className="text-[56px] leading-[1.2] mb-[30px] font-bold text-white">
            Simplify your budgeting, track every expense, and reach your financial goals — <span className="text-[#FFE599]"> all in one place.</span>
          </h1>
          <div className="flex gap-[15px] mt-[40px] justify-end">
            <button 
              onClick={() => navigate('/login')} 
              className="py-[15px] px-[35px] rounded-[30px] font-semibold transition-all text-[16px] bg-white text-[#2d5f4f] shadow-[4px_4px_4px_rgba(0,0,0,0.2)] hover:bg-[#f0f0f0] hover:-translate-y-0.5"
            >
              Explore
            </button>
            <button 
              onClick={() => navigate('/register')} 
              className="py-[15px] px-[35px] rounded-[30px] font-semibold transition-all text-[16px] bg-gradient-to-l from-[rgba(52,168,83,0.95)] to-[rgba(20,66,33,0.589)] text-white shadow-[4px_4px_4px_rgba(0,0,0,0.2)] hover:shadow-[4px_4px_4px_rgba(0,0,0,0.2)] hover:-translate-y-0.5"
            >
              Start Saving
            </button>
          </div>
        </div>
      </section>

      <section className="py-[60px_0] mt-[100px] mb-[50px] text-center">
        <div className="max-w-[1200px] mx-auto px-5">
          <h1 className="text-[40px] mb-[50px] font-extrabold">
            What You Can Do With <span className="text-[#34A853]">Trackit?</span>
          </h1>
          
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[30px] mb-[40px]">
            <div className="bg-white rounded-2xl p-[40px_30px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] hover:bg-[#d1f4e0] cursor-pointer">
              <div className="w-20 h-20 bg-[#d1f4e0] rounded-full mx-auto mb-5 flex items-center justify-center">
                <img src={IconPiggyBank} alt="Piggy Bank" className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-[#34A853]">Add and Manage<br />Expenses</h3>
              <p className="text-base leading-relaxed text-[#6D7278] mt-3">Easily record your daily transactions — manually or using image upload for faster entry.</p>
            </div>


            <div className="bg-white rounded-2xl p-[40px_30px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] hover:bg-[#d1f4e0] cursor-pointer">
              <div className="w-20 h-20 bg-[#d1f4e0] rounded-full mx-auto mb-5 flex items-center justify-center">
                <img src={IconSpending} alt="Spending" className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-[#34A853]">Categorize<br />Spendings</h3>
              <p className="text-base leading-relaxed text-[#6D7278] mt-3">Automatically or manually organize your expenses under categories like Food, Bills, or Transport.</p>
            </div>


            <div className="bg-white rounded-2xl p-[40px_30px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] hover:bg-[#d1f4e0] cursor-pointer">
              <div className="w-20 h-20 bg-[#d1f4e0] rounded-full mx-auto mb-5 flex items-center justify-center">
                <img src={IconAIInsights} alt="AI Insights" className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-[#34A853]">AI-Powered<br />Insights</h3>
              <p className="text-base leading-relaxed text-[#6D7278] mt-3">Get personalized recommendations and spending analyses to help you make smarter decisions.</p>
            </div>


            <div className="bg-white rounded-2xl p-[40px_30px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] hover:bg-[#d1f4e0] cursor-pointer">
              <div className="w-20 h-20 bg-[#d1f4e0] rounded-full mx-auto mb-5 flex items-center justify-center">
                <img src={IconBudgetMonitor} alt="Budget Monitor" className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-[#34A853]">Budget Planning<br />and Monitoring</h3>
              <p className="text-base leading-relaxed text-[#6D7278] mt-3">Set budget limits per category and instantly see how close you are to exceeding or meeting your goals.</p>
            </div>


            <div className="bg-white rounded-2xl p-[40px_30px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] hover:bg-[#d1f4e0] cursor-pointer">
              <div className="w-20 h-20 bg-[#d1f4e0] rounded-full mx-auto mb-5 flex items-center justify-center">
                <img src={IconReports} alt="Reports" className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-[#34A853]">Visual Reports and<br />Dashboard</h3>
              <p className="text-base leading-relaxed text-[#6D7278] mt-3">Track your finances through clear, colorful charts that display your expenses, budgets, and AI insights at a glance.</p>
            </div>

            <div className="bg-white rounded-2xl p-[40px_30px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] hover:bg-[#d1f4e0] cursor-pointer">
              <div className="w-20 h-20 bg-[#d1f4e0] rounded-full mx-auto mb-5 flex items-center justify-center">
                <img src={IconAchievements} alt="Achievements" className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-[#34A853]">Achievements<br />Badges</h3>
              <p className="text-base leading-relaxed text-[#6D7278] mt-3">Earn recognition as you reach your financial goals and milestones — because smart saving deserves to be celebrated.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
