import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("User");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sign Up clicked");

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:9192/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phoneNumber,
          dob: dob,
          password: password,
          role: accountType,
        }),
      });

      const data = await res.text();

      if (res.ok) {
        toast.success("🎉 Registration Successful! ", { position: "top-right" });
        navigate("/signin");
      } else {
        toast.error(data.message || "❌ Registration failed", { position: "top-right" });
      }
    } catch (error) {
      console.error(error);
      toast.error("⚠️ Something went wrong", { position: "top-right" });
    }
  };

  return (
    <div className="flex justify-center items-center items-start min-h-screen pt-24 pb-10 bg-gray-100">
      <div className="w-full bg-white rounded-2xl shadow-lg p-10 max-w-sm md:max-w-[525px]">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-10">
          Create Account
        </h2>

        <form className="space-y-4 mt-11" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Full Name:</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Phone Number:</label>
            <input
              type="tel"
              placeholder="Enter your Phone Number"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value;
                // Only digits
                if (/^\d*$/.test(value) && value.length <= 10) {
                  setPhoneNumber(value);
                }
              }}
              pattern="[6-9][0-9]{9}"
              title="Phone number must be 10 digits and start with 6, 7, 8, or 9"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Date of Birth:</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 10))
                .toISOString()
                .split("T")[0]}  // today's date and User should be 10+
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Confirm Password:</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div >
            <label className="block text-gray-700 font-bold mb-2">Account Type:</label>
            <div className="flex space-x-8">
              <label className="flex items-center space-x-2 text-gray-600">
                <input
                  type="radio"
                  name="accountType"
                  value="User"
                  checked={accountType === "User"}
                  onChange={() => setAccountType("User")}
                  className="form-radio text-blue-700 h-5 w-5"
                />
                <span>User</span>
              </label>

              <label className="flex items-center space-x-2 text-gray-600">
                <input
                  type="radio"
                  name="accountType"
                  value="ORGANIZER"
                  checked={accountType === "ORGANIZER"}
                  onChange={() => setAccountType("ORGANIZER")}
                  className="form-radio text-blue-700 h-5 w-5"
                />
                <span>Event Organizer</span>
              </label>
            </div>
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition mt-5"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>

        <p className="text-center mt-2">
          <Link to="/" className="text-gray-600 hover:underline">
            ⬅ Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
