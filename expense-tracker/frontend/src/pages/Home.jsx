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
      
    
    
    
    </div>
  );
};

export default Home;
