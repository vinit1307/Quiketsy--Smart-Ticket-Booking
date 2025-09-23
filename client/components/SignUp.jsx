import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="flex justify-center items-center items-start min-h-screen pt-24 pb-10 bg-gray-100">
      <div className="w-full bg-white rounded-2xl shadow-lg p-10 max-w-sm md:max-w-[525px]">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-10">
          Create Account
        </h2>

        <form className="space-y-4 mt-11">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Full Name:</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Phone Number:</label>
            <input
              type="tel"
              placeholder="Enter your Phone Number"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Date of Birth:</label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Confirm Password:</label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition mt-5"
          >
            Sign Up
          </button>
        </form>

        {/* Link to Sign In */}
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
        {/* Back to Home */}
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
