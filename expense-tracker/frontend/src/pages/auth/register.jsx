import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";
import Logo from "../../assets/logo.png";
import PiggyIllustration from "../../assets/piggy.png"; 

const Register = () => {
  const [mounted, setMounted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      return alert("Please fill in all fields.");
    }
    try {
      const res = await axios.post("http://localhost:5000/users/register", {
        name: `${firstName} ${lastName}`,
        email,
        password,
      });
      alert(res.data.message);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex flex-1 items-center justify-center px-6 md:px-12 lg:px-20 py-6">
        <div className="relative max-w-7xl w-full flex gap-8 md:gap-20 items-center">
       
          <div className="hidden lg:block relative flex-1 order-2 w-[900px]">
            <div className="absolute inset-0 flex items-center justify-end">
              <div
                className="h-[560px] w-[520px] rounded-[48px] shadow-xl"
                style={{
                  width:620,
                  height: 700,
                  borderRadius: 30,
                  background: "linear-gradient(-135deg, #CCEFCC 0%, #34A853 55%, #144221 100%)",
                  clipPath: "ellipse(100% 70% at 100% 60%)",
                  transform: "translateX(110px)",
                }}
              />
              <h1 className="absolute left-130 top-10 text-6xl font-bold leading-tight text-white items-end">
              Your <span className="text-[#FFE082]"><br />Money,</span><br />
              Your <br />
              <span className="text-white">Controll.</span>
            </h1>
            </div>
            <img 
              src={PiggyIllustration}
               alt="piggy" 
               className="Absolute top-40 w-[920px] h-auto pointer-events-none -translate-x-73 " 
               />
           
          </div>
          
              
          
          

    
          <div
            className={`mx-auto w-full max-w-[560px] md:max-w-[520px] top-5 bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-10 transform transition-all duration-450 ease-out
              ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDuration: "400ms" }}
            role="region"
            aria-label="register card"
          >
            <div className="flex flex-col items-center md:items-start">
              <img src={Logo} alt="Trackit Logo" className="w-14 h-14 mb-2" />
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                Create a <span className="text-green-600">Trackit</span> Account
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-1">First Name</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border border-green-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-1">Last Name</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border border-green-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full border border-green-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="w-full border border-green-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>

              <div className="flex justify-between items-center">
                <div></div>
                <button type="button" className="text-gray-500 hover:underline text-sm">
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="mt-2 w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold py-3 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-[1px] transition-all duration-200"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default Register;
