import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import Footer from "../../components/shared/Footer";
import Logo from "../../assets/logo.png";
import PiggyIllustration from "../../assets/piggy.png";
import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "../../firebaseConfig";
import PasswordInput from "../../components/PasswordInput";
import Header from "../../components/shared/Header";


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
      
      localStorage.setItem("user", JSON.stringify({
        name: `${firstName} ${lastName}`,
        email: email
      }));
      
      window.dispatchEvent(new Event("userStorageChange"));
      
      alert(res.data.message);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const res = await axios.post("http://localhost:5000/users/google", {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      });
      
      localStorage.setItem("user", JSON.stringify({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        displayName: user.displayName
      }));
      
      window.dispatchEvent(new Event("userStorageChange"));
      
      alert(res.data.message);
      navigate("/dashboard");
    } catch (error) {
      alert("❌ Google login failed.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] font-poppins">
      <Header/>
      <main className="flex-1 flex items-center justify-center py-4 px-4 sm:py-6 lg:py-6 lg:m-1">
     
          <div className="hidden lg:block relative flex-1 order-2 ">
            <div className="hidden lg:block relative flex-1">
              <div
                aria-hidden
                style={{
                  width: 600,
                  height: 690,
                  borderRadius: 30,
                  background:
                    "linear-gradient(-135deg, #CCEFCC 0%, #34A853 55%, #144221 100%)",
                  clipPath: "ellipse(100% 70% at 100% 60%)",
                  transform: "translateX(190px)",
                }}
              />
              <h1 className="absolute left-130 text-left top-50 text-6xl font-semibold leading-tight text-white items-end">
                Your <span className="text-[#FFE082]"><br />money,</span><br />
                Your <br />
                <span className="text-white">control.</span>
              </h1>

            </div>
          </div>

          <img
            src={PiggyIllustration}
            alt="piggy"
            className="hidden lg:block absolute w-[900px] h-auto pointer-events-none left-80 z-50"
          />

          <div
            className={`mx-auto w-full max-w-[520px] bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 md:p-10 lg:mt-15 lg:ml-50 transform transition-all duration-400 ease-out
              ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
            style={{ transitionDuration: "400ms" }}
          >


            <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
              <img src={Logo} alt="Trackit Logo" className="w-12 h-12 sm:w-14 sm:h-14 mb-2 sm:mb-3" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 px-2">
                Welcome to <span className="text-green-600">Trackit!</span>
              </h2>
            </div>

          
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 border border-green-300 rounded-xl overflow-hidden flex items-center">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name..."
                    className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 outline-none text-sm text-gray-700 placeholder-gray-400"
                    required
                  />
                </div>

                <div className="flex-1 border border-green-300 rounded-xl overflow-hidden flex items-center">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name..."
                    className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 outline-none text-sm text-gray-700 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

             
              <div className="border border-green-300 rounded-xl overflow-hidden flex items-center">
                <div className="flex items-center justify-center bg-green-500 px-3 sm:px-4 py-3 sm:py-4">
                  <FaUser className="text-white text-sm sm:text-base" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 outline-none text-sm text-gray-700 placeholder-gray-400"
                  required
                />
              </div>

             
              <PasswordInput password={password} setPassword={setPassword} />


              <div className="text-xs sm:text-sm text-center">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-green-600 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 sm:py-3 rounded-lg text-sm sm:text-base text-white font-semibold bg-gradient-to-r from-green-400 to-green-600 shadow-sm hover:shadow-md transform hover:-translate-y-[1px] transition-all duration-200"
              >
                Register
              </button>
            </form>

          
            <div className="mt-4 sm:mt-6 mb-3 sm:mb-4 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="text-xs text-gray-400">or</div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

           
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 sm:gap-3 border border-gray-300 py-2.5 sm:py-3 rounded-lg hover:bg-gray-50 shadow-sm transition transform hover:scale-[1.01] duration-150"
            >
              <FcGoogle size={18} className="sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                Continue with Google
              </span>
            </button>
          </div>
        
      </main>
    </div>
  );
};

export default Register;
