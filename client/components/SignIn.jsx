import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:9192/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      {/*//Previous login functionalities
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        alert("Login successful!");
        navigate("/dashboard"); // Redirect after login
      } else {
        alert(data || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
    }
  */}

    // Better and alternative Approach to use AuthContext saara authentication authcontext se hi hoga, global management
    // Agar dikkat aayegi to we can move back to above previous code
   if (res.ok) {
        // Get full name from response or fetch it
        let fullName = data.name || data.fullName;
        
        // If backend doesn't return name, try to fetch user details
        if (!fullName && data.token) {
          try {
            const userRes = await fetch("http://localhost:9192/api/user/profile", {
              headers: { 
                "Authorization": `Bearer ${data.token}`,
                "Content-Type": "application/json"
              }
            });
            if (userRes.ok) {
              const userData = await userRes.json();
              fullName = userData.name || userData.fullName;
            }
          } catch (error) {
            console.error("Error fetching user details:", error);
          }
        }
        
        // Use the login function from context (handles all localStorage)
        login(data.token, data.email, data.fullName, data.role, data.id);
        toast.success("🎉 Login Successful!", { position: "top-right" });
        navigate("/");
      } else {
        toast.error(data.message || "❌ Invalid credentials", { position: "top-right" });
      }
    } catch (error) {
      console.error(error);
      toast.error("⚠️ An error occurred during login", { position: "top-right" });
    }

    
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-9">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-10">
          Sign In
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-7">
            <label className="block text-black mb-2 font-bold">Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-7">
            <label className="block text-black mb-2 font-bold">Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
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

export default SignIn;
