import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Monitor1 from '../assets/home/Monitor_1.svg';
import Header from '../components/shared/Header';
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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Message sent! We will get back to you soon.');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="font-poppins bg-[#f5f5f5] overflow-x-hidden pt-16 md:pt-20">
      <Header/>
      <section 
        className="rounded-2xl lg:rounded-[50px] mx-4 sm:mx-6 md:mx-10 lg:mx-20 xl:mx-[150px] my-5 p-6 sm:p-10 md:p-16 lg:p-[80px_60px] flex flex-col lg:flex-row items-center justify-between min-h-[400px] md:min-h-[500px] lg:min-h-[700px] shadow-[0_20px_40px_rgba(0,0,0,0.15)] relative overflow-hidden lg:overflow-visible"
        style={{
          background: `linear-gradient(to left, rgba(52, 168, 83, 0.95), rgba(20, 66, 33, 0.589)), url(${LandingPageBG}) no-repeat center center fixed`,
          backgroundSize: 'cover'
        }}
      >
        <div className="w-full lg:flex-1 relative z-[3] flex items-center justify-center mb-8 lg:mb-0">
          <img 
            src={Monitor1} 
            alt="TrackIT Monitor" 
            className="w-[280px] sm:w-[350px] md:w-[450px] lg:w-full lg:max-w-[800px] h-auto relative lg:absolute lg:top-[-280px] lg:left-[-170px] z-[3]" 
          />
        </div>

        <div className="w-full lg:flex-1 z-[2] text-center lg:text-right">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[56px] leading-[1.2] mb-5 md:mb-[30px] font-bold text-white">
            Simplify your budgeting, track every expense, and reach your financial goals — <span className="text-[#FFE599]"> all in one place.</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-[15px] mt-6 md:mt-[40px] justify-center lg:justify-end">
            <button 
              onClick={() => {
                document.getElementById("Explore").scrollIntoView({ behavior: "smooth" });
              }} 
              className="py-3 px-6 md:py-[15px] md:px-[35px] rounded-[30px] font-semibold transition-all text-sm md:text-[16px] bg-white text-[#2d5f4f] shadow-[4px_4px_4px_rgba(0,0,0,0.2)] hover:bg-[#f0f0f0] hover:-translate-y-0.5"
            >
              Explore
            </button>
            <button 
              onClick={() => navigate('/login')}  
              className="py-3 px-6 md:py-[15px] md:px-[35px] rounded-[30px] font-semibold transition-all text-sm md:text-[16px] bg-gradient-to-l from-[rgba(52,168,83,0.95)] to-[rgba(20,66,33,0.589)] text-white shadow-[4px_4px_4px_rgba(0,0,0,0.2)] hover:shadow-[4px_4px_4px_rgba(0,0,0,0.2)] hover:-translate-y-0.5"
            >
              Start Saving
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 mt-12 md:mt-20 lg:mt-[100px] mb-8 md:mb-[50px] text-center" id='Explore'>
        <div className="max-w-[1200px] mx-auto px-5">
          <h1 className="text-2xl md:text-3xl lg:text-[40px] mb-8 md:mb-[50px] font-extrabold">
            What You Can Do With <span className="text-[#34A853]">Trackit?</span>
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-[30px] mb-[40px]">
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
      <section className="relative w-full min-h-[400px] md:min-h-[500px] lg:h-[60vh] bg-[#34A853] overflow-hidden flex items-center py-12 md:py-16 lg:py-0">
        <div className="container max-w-[1200px] mx-auto px-5">
          <div className="flex flex-col lg:flex-row items-center lg:items-start">
            <div className="w-full lg:w-1/2 text-white z-[2] text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl lg:text-[42px] font-extrabold mb-5 md:mb-[30px] text-white">
                About <span className="text-[#FBBC05]">Trackit</span>
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-white mb-5 opacity-95">
                Trackit is a web-based application designed to help individuals manage their personal finances efficiently. It enables users to track income and expenses, set financial goals, and visualize spending patterns in an appealing visual form that analyze spending patterns of a suggested level of money needs.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-white opacity-95">
                Built for students, employees, and small business owners, the system transforms financial management into a clear, data-driven, and motivating experience.
              </p>
            </div>
            <div className="hidden lg:block absolute right-0 top-0 w-1/2 h-full overflow-hidden">
              <img src={AboutPicture} alt="About Trackit" className="w-full h-full object-cover" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[rgba(52,168,83,1)] via-[rgba(52,168,83,0.9)] to-[rgba(52,168,83,0)]"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f8f8] py-12 md:py-20 px-5 md:px-[10%] text-center font-poppins">
        <h2 className="text-2xl md:text-3xl lg:text-[40px] font-bold mb-8 md:mb-[60px]">
          Simple Steps to <span className="text-[#34A853]">Smarter Spending</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] grid-rows-auto lg:grid-rows-[repeat(2,auto)] items-center justify-items-center gap-y-6 md:gap-y-[40px] gap-x-0 lg:gap-x-[60px] relative">
    
          <div className="bg-white rounded-[15px] p-6 md:p-[30px_25px] text-left shadow-[0_4px_10px_rgba(0,0,0,0.1)] w-full max-w-[300px] transition-all hover:-translate-y-1 hover:bg-[#d1f4e0] cursor-pointer lg:col-start-1 lg:row-start-1">
            <div className="bg-[#34A853] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl mb-[10px]">1</div>
            <h3 className="text-[22px] text-[#34A853] mb-2">Create an Account or Sign In</h3>
            <p className="text-sm leading-[1.5]">Securely log in using your Gmail account or personal credentials.</p>
          </div>

          <div className="bg-white rounded-[15px] p-6 md:p-[30px_25px] text-left shadow-[0_4px_10px_rgba(0,0,0,0.1)] w-full max-w-[300px] transition-all hover:-translate-y-1 hover:bg-[#d1f4e0] cursor-pointer lg:col-start-1 lg:row-start-2">
            <div className="bg-[#34A853] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl mb-[10px]">2</div>
            <h3 className="text-[22px] text-[#34A853] mb-2">Add Your Expenses</h3>
            <p className="text-sm leading-[1.5]">Record spending details — the system will automatically categorize them using AI.</p>
          </div>

          <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 order-first lg:order-none mb-8 lg:mb-0">
            <img src={MonitorFront} alt="Trackit App on computer" className="w-[250px] md:w-[320px]" />
          </div>

          <div className="bg-white rounded-[15px] p-6 md:p-[30px_25px] text-left shadow-[0_4px_10px_rgba(0,0,0,0.1)] w-full max-w-[300px] transition-all hover:-translate-y-1 hover:bg-[#d1f4e0] cursor-pointer lg:col-start-3 lg:row-start-1">
            <div className="bg-[#34A853] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl mb-[10px]">3</div>
            <h3 className="text-[22px] text-[#34A853] mb-2">Set Your Budgets</h3>
            <p className="text-sm leading-[1.5]">Define limits for each category and track your progress in real-time.</p>
          </div>

          <div className="bg-white rounded-[15px] p-6 md:p-[30px_25px] text-left shadow-[0_4px_10px_rgba(0,0,0,0.1)] w-full max-w-[300px] transition-all hover:-translate-y-1 hover:bg-[#d1f4e0] cursor-pointer lg:col-start-3 lg:row-start-2">
            <div className="bg-[#34A853] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl mb-[10px]">4</div>
            <h3 className="text-[22px] text-[#34A853] mb-2">View AI Insights and Reports</h3>
            <p className="text-sm leading-[1.5]">See detailed spending trends and recommendations that guide your next financial moves.</p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 text-center">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="w-full max-w-[1200px] bg-[#CCEFCC] rounded-2xl md:rounded-[50px] p-8 md:p-12 lg:p-[60px_50px]">
            <h1 className="text-2xl md:text-3xl lg:text-[2.5em] mb-8 md:mb-10">
              Built for <span className="text-[#34A853]">Everyone</span> Who Handles Money
            </h1>

            <div className="flex justify-center items-stretch flex-wrap gap-5 max-w-[900px] mx-auto p-5 md:p-[30px]">
              <div className="bg-white rounded-[15px] p-5 shadow-[0_4px_6px_rgba(0,0,0,0.1)] flex-1 basis-[250px] max-w-[280px] flex flex-col justify-between min-h-[320px] transition-all hover:-translate-y-1 hover:bg-[#d1f4e0] cursor-pointer">
                <img src={Students} alt="Students" className="w-full h-[150px] object-cover rounded-[10px] mb-[15px]" />
                <h3 className="text-[#34A853] leading-5 text-[1.4em] mb-1">Students</h3>
                <p className="text-[0.9em] text-[#616161] flex-grow mt-2">Manage your allowance wisely and save what matters most!</p>
              </div>

              <div className="bg-white rounded-[15px] p-5 shadow-[0_4px_6px_rgba(0,0,0,0.1)] flex-1 basis-[250px] max-w-[280px] flex flex-col justify-between min-h-[320px] transition-all hover:-translate-y-1 hover:bg-[#d1f4e0] cursor-pointer">
                <img src={Employees} alt="Employees" className="w-full h-[150px] object-cover rounded-[10px] mb-[15px]" />
                <h3 className="text-[#34A853] leading-5 text-[1.4em] mb-1">Employees</h3>
                <p className="text-[0.9em] text-[#616161] flex-grow mt-2">Track your salary, organize your expenses and stay on top financially.</p>
              </div>
              
              <div className="bg-white rounded-[15px] p-5 shadow-[0_4px_6px_rgba(0,0,0,0.1)] flex-1 basis-[250px] max-w-[280px] flex flex-col justify-between min-h-[320px] transition-all hover:-translate-y-1 hover:bg-[#d1f4e0] cursor-pointer">
                <img src={BusinessOwners} alt="Small Business" className="w-full h-[150px] object-cover rounded-[10px] mb-[15px]" />
                <h3 className="text-[#34A853] leading-5 text-[1.4em] mb-1">Small Business Owners</h3>
                <p className="text-[0.9em] text-[#616161] flex-grow mt-2">Monitor operational costs, compute revenue, and grow your business!</p>
              </div>
            </div>  
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20 px-5">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-20">
          <div className="w-full lg:flex-1 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl lg:text-[40px] font-extrabold leading-[1.3] mb-6 md:mb-10">
              Designed to Be <span className="text-[#34A853]"> Smart, Simple, and Effective</span>
            </h2>
            <ul className="bg-white rounded-[20px] p-6 md:p-[35px_40px] shadow-[0_6px_25px_rgba(0,0,0,0.09)] list-none w-full max-w-[480px] mx-auto lg:mx-0">
              <li className="flex items-center gap-4 mb-2.5">
                <div className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0 p-2">
                  <img src={IconDashboard} alt="Dashboard" className="w-full h-full object-contain" />
                </div>
                <span className="text-lg font-semibold leading-snug">Clean, intuitive dashboard</span>
              </li>
              <li className="flex items-center gap-4 mb-2.5">
                <div className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0 p-2">
                  <img src={IconAI} alt="AI" className="w-full h-full object-contain" />
                </div>
                <span className="text-lg font-semibold leading-snug">AI-driven recommendations</span>
              </li>
              <li className="flex items-center gap-4 mb-2.5">
                <div className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0 p-2">
                  <img src={IconTag} alt="Categorization" className="w-full h-full object-contain" />
                </div>
                <span className="text-lg font-semibold leading-snug">Easy expense categorization</span>
              </li>
              <li className="flex items-center gap-4 mb-2.5">
                <div className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0 p-2">
                  <img src={IconGoal} alt="Goals" className="w-full h-full object-contain" />
                </div>
                <span className="text-lg font-semibold leading-snug">Goal-based budgeting</span>
              </li>
              <li className="flex items-center gap-4 mb-2.5">
                <div className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0 p-2">
                  <img src={IconSecured} alt="Security" className="w-full h-full object-contain" />
                </div>
                <span className="text-lg font-semibold leading-snug">Secure email login</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0 p-2">
                  <img src={IconAccessibility} alt="Access" className="w-full h-full object-contain" />
                </div>
                <span className="text-lg font-semibold leading-snug">Accessible anytime, anywhere</span>
              </li>
            </ul>
          </div>

          <div className="w-full lg:flex-1 relative flex justify-center items-center">
            <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full bg-gradient-to-r from-[rgba(204,239,204)] via-[rgba(52,168,83)] to-[rgba(20,66,33)] relative flex items-center justify-center">
              <img src={Monitor2} alt="Dashboard Preview" className="absolute w-[350px] sm:w-[450px] md:w-[550px] lg:w-[700px] -bottom-[65px] sm:-bottom-[80px] md:-bottom-[100px] lg:-bottom-[130px] left-1/2 -translate-x-1/2 drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-20 px-5 md:px-[30px]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 md:gap-12 lg:gap-[60px] items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl lg:text-[40px] font-extrabold mb-5 md:mb-[25px] text-black">
              Get in <span className="text-[#34A853]">Touch</span> with Us!
            </h2>
            <p className="text-sm md:text-base text-[#333] leading-relaxed mb-8 md:mb-10">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            <div className="bg-gradient-to-r from-[rgba(204,239,204)] to-[rgba(52,168,83)] rounded-[25px] p-8 md:p-[50px_40px] text-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] max-w-md mx-auto lg:mx-0">
              <div className="w-[60px] h-[60px] rounded-[15px] flex items-center justify-center mx-auto mb-5 md:mb-[25px] text-[30px]">
                <img src={EmailUs} alt="Email" className="w-[50px] h-[50px] md:w-[70px] md:h-[70px]" />
              </div>
              <h3 className="text-lg md:text-[1.4em] mb-2 font-bold break-words">consolvestudio@gmail.com</h3>
              <p className="text-sm md:text-[0.9em] text-[#333] m-0">Email Address</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-[25px] p-6 md:p-[45px_40px] shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div className="flex flex-col">
                <label className="text-[0.95em] font-semibold text-[#34A853] mb-2">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Juan"
                  className="py-3.5 px-4 border-none bg-[#f8f8f8] rounded-[10px] text-[0.95em] text-[#333] placeholder:text-[#999]"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[0.95em] font-semibold text-[#34A853] mb-2">Last Name</label>
                <input 
                  type="text"
                  name="lastName" 
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Dela Cruz"
                  className="py-3.5 px-4 border-none bg-[#f8f8f8] rounded-[10px] text-[0.95em] text-[#333] placeholder:text-[#999]"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col mb-5">
              <label className="text-[0.95em] font-semibold text-[#34A853] mb-2">Email</label>
              <input 
                type="email"
                name="email" 
                value={formData.email}
                onChange={handleInputChange}
                placeholder="juandelacruz@email.com"
                className="py-3.5 px-4 border-none bg-[#f8f8f8] rounded-[10px] text-[0.95em] text-[#333] placeholder:text-[#999]"
                required
              />
            </div>
            <div className="flex flex-col mb-5">
              <label className="text-[0.95em] font-semibold text-[#34A853] mb-2">Subject</label>
              <input 
                type="text"
                name="subject" 
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Subject"
                className="py-3.5 px-4 border-none bg-[#f8f8f8] rounded-[10px] text-[0.95em] text-[#333] placeholder:text-[#999]"
                required
              />
            </div>
            <div className="flex flex-col mb-5">
              <label className="text-[0.95em] font-semibold text-[#34A853] mb-2">Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Write us a message..."
                className="py-3.5 px-4 border-none bg-[#f8f8f8] rounded-[10px] text-[0.95em] text-[#333] placeholder:text-[#999] resize-y min-h-[120px]"
                required
              />
            </div>
            <button 
              type="submit" 
              className="bg-gradient-to-r from-[rgba(204,239,204)] to-[rgba(52,168,83)] text-white py-3 md:py-4 border-none rounded-[10px] text-sm md:text-base font-semibold cursor-pointer w-full transition-all hover:bg-[#34A853]"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default Home;
