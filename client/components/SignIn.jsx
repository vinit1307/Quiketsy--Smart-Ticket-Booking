import React from "react";
import { Link } from "react-router-dom";


const SignIn = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-9">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-10">
          Sign In
        </h2>
        <form className="space-y-4">
          {/* Email */}
          <div className="mb-7">
            <label className="block text-black mb-2 font-bold">Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div className="mb-7">
            <label className="block text-black mb-2 font-bold">Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition mt-2"
          >
            Sign In
          </button>

          {/* <div className="flex justify-center items-center font-bold">
            Don't have an account? Sign Up
          </div> */}

          
        </form>
        <p className="text-center mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
      </div>
    </div>
  );
};

export default SignIn;
