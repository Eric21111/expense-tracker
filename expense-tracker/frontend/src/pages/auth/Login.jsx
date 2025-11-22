import React, { useEffect, useState } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import Header from "../../components/shared/Header";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/shared/Footer";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "../../firebaseConfig";
import Logo from "../../assets/logo.png";
import WalletIllustration from "../../assets/wallet.png";
import PasswordInput from "../../components/PasswordInput";
import ForgotPasswordModal from "../../components/ForgotPasswordModal";
<link
  href="https:
  rel="stylesheet"
></link>;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setErrorMessage("");

    try {
      const res = await axios.post("http:
        email,
        password,
      });

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        localStorage.setItem(
          "user",
          JSON.stringify({ email, name: email.split("@")[0] })
        );
      }

      window.dispatchEvent(new Event("userStorageChange"));

      setEmail("");
      setPassword("");
      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.error || "Invalid email or password. Please try again.";
      setErrorMessage(message);
      console.error("Login error:", message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const res = await axios.post("http:
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          displayName: user.displayName,
          provider: 'google'
        })
      );

      window.dispatchEvent(new Event("userStorageChange"));

      navigate("/dashboard");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] font-poppins">
      <Header />
      <main className="flex-1 flex items-center justify-center py-4 px-4 sm:py-6 lg:py-6">
        <div className="relative w-full max-w-[1900px] flex items-center justify-between gap-50">
          <div className="hidden lg:block relative flex-1">
            <div
              aria-hidden
              style={{
                width: 620,
                height: 700,
                borderRadius: 30,
                background:
                  "linear-gradient(135deg,#CCEFCC 0%, #34A853 55%, #144221 100%)",
                clipPath: "ellipse(100% 70% at 0% 60%)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                transform: "translateX(10px)",
              }}
            />
            <h1 className="absolute left-10 top-48 text-6xl font-semibold leading-tight text-white">
              Make{" "}
              <span className="text-[#FFE082]">
                <br />
                Every
              </span>{" "}
              Peso <br />
              Count <br />
              <span className="text-white">(Literally!)</span>
            </h1>
          </div>

          <img
            src={WalletIllustration}
            alt="wallet"
            className="hidden lg:block absolute left-90 top-40 w-[900px] h-auto pointer-events-none"
          />

          <div
            className={`relative mx-auto w-full max-w-[520px] bg-white rounded-2xl top-5 shadow-lg border border-gray-100 p-6 sm:p-8 lg:p-10 transform transition-all duration-400 ease-out
            ${
              mounted
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
            role="region"
          >
            <div className="flex flex-col items-center mb-4 sm:mb-6">
              <img
                src={Logo}
                alt="Trackit Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 mb-2 sm:mb-3 object-contain"
              />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center px-2">
                Welcome Back to <span className="text-green-600">Trackit!</span>
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                  Email
                </label>
                <div className="flex items-stretch rounded-xl overflow-hidden border border-green-300 shadow-sm">
                  <div className="flex items-center justify-center bg-green-500 px-3 sm:px-4">
                    <FaUser className="text-white text-sm sm:text-base" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMessage("");
                    }}
                    placeholder="Enter your email..."
                    className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 outline-none text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                  Password
                </label>
                <div className="flex items-stretch rounded-xl overflow-hidden border border-green-300 shadow-sm relative">
                  <div className="flex items-center justify-center bg-green-500 px-3 sm:px-4">
                    <FaLock className="text-white text-sm sm:text-base" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMessage("");
                    }}
                    placeholder="Enter your password..."
                    className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 outline-none text-sm pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={16} />
                    ) : (
                      <FaEye size={16} />
                    )}
                  </button>
                </div>
                {errorMessage && (
                  <p className="mt-2 text-sm text-red-600">
                    {errorMessage}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm gap-2 sm:gap-0">
                <div>
                  No Account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="text-green-600 font-semibold hover:underline"
                  >
                    Sign up
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-gray-500 hover:underline whitespace-nowrap"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full mt-1 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base text-white font-semibold bg-gradient-to-r from-green-400 to-green-600 shadow-sm hover:shadow-md transform hover:-translate-y-[1px] transition-all duration-200"
              >
                Login
              </button>
            </form>

            <div className="mt-4 sm:mt-5 mb-2 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="text-xs text-gray-400">or</div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full mt-2 flex items-center justify-center gap-2 sm:gap-3 border border-gray-300 py-2.5 sm:py-3 rounded-lg hover:bg-gray-50 shadow-sm transition transform hover:scale-[1.01] duration-150"
            >
              <FcGoogle size={18} className="sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                Continue with Google
              </span>
            </button>
          </div>

          <div className="hidden lg:block flex-1" />
        </div>
      </main>

      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </div>
  );
};

export default Login;
