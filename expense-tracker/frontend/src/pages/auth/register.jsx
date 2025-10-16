import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !firstName || !lastName) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/users/register", {
        name: `${firstName} ${lastName}`,
        email,
        password,
      });

      alert(res.data.message);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.error || "❌ Registration failed.");
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

        <div
          className="w-[520px] p-10 rounded-2xl shadow-md"
          style={{ backgroundColor: "#D9D9D94A" }}
        >
          <h3 className="text-center text-sm font-semibold text-gray-600">
            Mo'Moolah
          </h3>
          <h2 className="text-center text-2xl font-semibold mb-6">
            Create a Trackit Account
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-9">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-1/2 border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-1/2 border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
              required
            />

            <button
              type="submit"
              className="mt-2 bg-black text-white py-2 rounded-md hover:opacity-90 transition"
            >
              Sign up
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-600">
            Have an Account?{" "}
            <button
              onClick={() => navigate("/")}
              className="font-semibold text-black hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
