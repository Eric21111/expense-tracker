import React, { useState } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/users", {
        email,
        password,
      });

      if (res.status === 201 || res.status === 200) {
        alert("✅ User data successfully added to database!");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.error) {
        alert("❌ " + error.response.data.error);
      } else {
        alert("❌ Failed to add user data. Check console for details.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex flex-1 items-center justify-center px-20 gap-60">
       
        <div>
          <h2 className="text-5xl font-extrabold leading-snug text-black mb-70">
            Make Every Peso <br /> Count <br />
            <span className="font-semibold">(Literally!)</span>
          </h2>
        </div>

   
        <div className="w-[520px]  p-10 rounded-2xl shadow-md" style={{ backgroundColor: "#D9D9D94A" }}>
          <h3 className="text-center text-sm font-semibold text-gray-600">
            Mo'Moolah
          </h3>
          <h2 className="text-center text-2xl font-semibold mb-6">
            Welcome to Trackit
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 bg-black text-white py-2 rounded-md hover:opacity-90 transition"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            or Login with
          </div>
          <div className="flex justify-center mt-2">
            <button className="border rounded-full p-2 hover:bg-gray-100 transition">
              <FcGoogle size={22} />
            </button>
          </div>

          <p className="text-center text-sm mt-4 text-gray-600">
            No Account?{" "}
            <a href="#" className="font-semibold text-black hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
